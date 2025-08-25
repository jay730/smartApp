import net from 'net';
import { CacheSocket } from '../../service/cacheSocket';

/**
 * Unit tests focus on CacheSocket internal behavior and lifecycle events.
 */

describe('CacheSocket (unit)', () => {
  const HOST = '127.0.0.1';
  let server: net.Server;
  let port: number;

  beforeAll(async () => {
    // Spin up a lightweight TCP server that just accepts connections
    await new Promise<void>((resolve) => {
      server = net.createServer((socket) => {
        // No-op handler for unit tests
        socket.on('data', () => {});
      });
      server.listen(0, HOST, () => {
        const addr = server.address() as net.AddressInfo;
        port = addr.port;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  test('reuses same socket instance while alive', async () => {
    const cs = new CacheSocket(HOST, port);
    const s1 = await cs.getSocket();
    const s2 = await cs.getSocket();

    expect(s1).toBe(s2);
    expect(s1.destroyed).toBe(false);
  });

  test('expire() drops cached socket and triggers onExpire callback', async () => {
    const onExpire = jest.fn();
    const cs = new CacheSocket(HOST, port, onExpire);

    const s1 = await cs.getSocket();
    expect(s1.destroyed).toBe(false);

    cs.expire();

    // Next getSocket should yield a new instance (new underlying socket)
    const s2 = await cs.getSocket();
    expect(s2).not.toBe(s1);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  test('close() ends the underlying socket and clears cache', async () => {
    const cs = new CacheSocket(HOST, port);
    const s1 = await cs.getSocket();

    cs.close();

    // Underlying socket should be ended/destroyed or null
    expect((s1.destroyed || s1.readableEnded || s1.writableEnded)).toBeTruthy();

    const s2 = await cs.getSocket();
    expect(s2).not.toBe(s1);
  });
});
