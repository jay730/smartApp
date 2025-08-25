import net from 'net';
import { CacheSocketFactory } from '../../service/cacheSocketFactory';

/**
 * Unit tests focus on the singleton factory and its caching behavior by (host,port).
 */

describe('CacheSocketFactory (unit)', () => {
  const HOST = '127.0.0.1';
  let serverA: net.Server;
  let serverB: net.Server;
  let portA: number;
  let portB: number;

  beforeAll(async () => {
    serverA = net.createServer((socket) => socket.on('data', () => {}));
    serverB = net.createServer((socket) => socket.on('data', () => {}));

    await new Promise<void>((resolve) => serverA.listen(0, HOST, resolve));
    await new Promise<void>((resolve) => serverB.listen(0, HOST, resolve));

    portA = (serverA.address() as net.AddressInfo).port;
    portB = (serverB.address() as net.AddressInfo).port;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => serverA.close(() => resolve()));
    await new Promise<void>((resolve) => serverB.close(() => resolve()));
  });

  test('getInstance() returns the same singleton', () => {
    const f1 = CacheSocketFactory.getInstance();
    const f2 = CacheSocketFactory.getInstance();
    expect(f1).toBe(f2);
  });

  test('same (host,port) returns same CacheSocket instance', () => {
    const factory = CacheSocketFactory.getInstance();
    const s1 = factory.getSocketInstance(HOST, portA);
    const s2 = factory.getSocketInstance(HOST, portA);
    expect(s1).toBe(s2);
  });

  test('different (host,port) returns different CacheSocket instances', () => {
    const factory = CacheSocketFactory.getInstance();
    const s1 = factory.getSocketInstance(HOST, portA);
    const s2 = factory.getSocketInstance(HOST, portB);
    expect(s1).not.toBe(s2);
  });

  test('clearSocketInstance() removes only specified socket', () => {
    const factory = CacheSocketFactory.getInstance();
    const s1 = factory.getSocketInstance(HOST, portA);
    const s2 = factory.getSocketInstance(HOST, portB);

    factory.clearSocketInstance(HOST, portA);

    const s1Again = factory.getSocketInstance(HOST, portA);
    const s2Again = factory.getSocketInstance(HOST, portB);

    expect(s1Again).not.toBe(s1);
    expect(s2Again).toBe(s2);
  });

  test('clearAll() removes all sockets', () => {
    const factory = CacheSocketFactory.getInstance();
    const s1 = factory.getSocketInstance(HOST, portA);
    const s2 = factory.getSocketInstance(HOST, portB);

    factory.clearAll();

    const s1Again = factory.getSocketInstance(HOST, portA);
    const s2Again = factory.getSocketInstance(HOST, portB);

    expect(s1Again).not.toBe(s1);
    expect(s2Again).not.toBe(s2);
  });
});
