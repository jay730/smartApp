import net from 'net';
import express from 'express';
import request from 'supertest';

import { VirusScanner } from '../../service/virusScanner';
import { CacheSocketFactory } from '../../service/cacheSocketFactory';

/**
 * Integration test: ensure the same underlying socket (same instance) is reused
 * for multiple scans against the same (host,port) via CacheSocketFactory.
 *
 * We spin up a mock clamd-like TCP server that accepts zINSTREAM protocol minimally:
 * - Expects: "zINSTREAM\0" then multiple [4-byte length][chunk] frames, ending with length=0.
 * - Replies with "stream: OK\n" for any content.
 */

describe('VirusScanner socket reuse (integration)', () => {
  const HOST = '127.0.0.1';
  let port: number;
  let server: net.Server;

  // track connections to assert reuse
  let lastSocket: net.Socket | null = null;
  let connectionCount = 0;

  beforeAll(async () => {
    server = net.createServer((socket) => {
      connectionCount += 1;
      lastSocket = socket;

      let expectingHeader = true;
      let pendingLength: number | null = null;
      let buffer = Buffer.alloc(0);

      socket.on('data', (data) => {
        buffer = Buffer.concat([buffer, data]);

        // Very small, permissive parser for zINSTREAM frames
        while (buffer.length > 0) {
          if (expectingHeader) {
            // First 9 bytes expected: 'zINSTREAM\0'
            if (buffer.length < 9) break;
            const header = buffer.subarray(0, 9).toString('utf8');
            if (header !== 'zINSTREAM\0') {
              socket.destroy();
              return;
            }
            buffer = buffer.subarray(9);
            expectingHeader = false;
            continue;
          }

          if (pendingLength === null) {
            if (buffer.length < 4) break;
            pendingLength = buffer.readUInt32BE(0);
            buffer = buffer.subarray(4);
            if (pendingLength === 0) {
              // End of stream; respond OK
              socket.write('stream: OK\n');
              return;
            }
          }

          if (pendingLength !== null) {
            if (buffer.length < pendingLength) break;
            // consume chunk
            buffer = buffer.subarray(pendingLength);
            pendingLength = null;
          }
        }
      });

      socket.on('error', () => {});
    });

    await new Promise<void>((resolve) => server.listen(0, HOST, resolve));
    port = (server.address() as net.AddressInfo).port;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  test('reuses same TCP connection for multiple scans', async () => {
    // Ensure factory is clean
    CacheSocketFactory.getInstance().clearAll();

    const scanner = new VirusScanner(HOST, port);

    // First scan
    const scan1 = await scanner.scanStream(BufferToReadable(Buffer.from('first clean file')));
    expect(scan1.isInfected).toBe(false);
    const firstSocketRef = lastSocket;

    // Second scan
    const scan2 = await scanner.scanStream(BufferToReadable(Buffer.from('second clean file')));
    expect(scan2.isInfected).toBe(false);

    // Should still be the same connection and connectionCount should be 1
    expect(lastSocket).toBe(firstSocketRef);
    expect(connectionCount).toBe(1);
  });
});

function BufferToReadable(buf: Buffer) {
  const { Readable } = require('stream');
  const r = new Readable();
  r.push(buf);
  r.push(null);
  return r;
}
