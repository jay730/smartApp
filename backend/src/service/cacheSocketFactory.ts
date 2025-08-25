import { CacheSocket } from "./cacheSocket";

export class CacheSocketFactory {
  private static instance: CacheSocketFactory;
  private sockets: Map<string, CacheSocket> = new Map();

  private static sockets: Map<string, CacheSocket> = new Map();
  private constructor() {}

  //1. hash table and store several ports
  // DO this -- 2. create a factory that accepts your port and your address
  // then that factory would be singleton and it would then return just that one instance.
  //when the socket fails. we will need a way to expire/kill the internal instance of the socket.
  
  //in the contrutor of the factory accept port and addrees
  //factory will manage an instan eorf the socket.


  public static getInstance(): CacheSocketFactory {
    if (!CacheSocketFactory.instance) {
      CacheSocketFactory.instance = new CacheSocketFactory();
    }
    return CacheSocketFactory.instance;
  }
  // ensures same (host,port) returns same instance
  public getSocketInstance(host: string, port: number): CacheSocket {
    const key = `${host}:${port}`;
    if (!this.sockets.has(key)) {
      // Pass a callback to remove from map if the socket dies
      const socket = new CacheSocket(host, port, () => {
        // Remove expired socket from the factory map
        this.sockets.delete(key);
        console.log(`Socket expired, removed from factory: ${key}`);
      });

      this.sockets.set(key, socket);
    }
    return this.sockets.get(key)!;
  }
  // ensures different (host,port) returns different instance
  public clearSocketInstance(host: string, port: number) {
    const key = `${host}:${port}`;
    const socket = this.sockets.get(key);
    socket?.close();
    this.sockets.delete(key);
  }
  // ensures clearing works for one or all sockets
  public clearAll() {
    for (const socket of this.sockets.values()) {
      socket.close();
    }
    this.sockets.clear();
  }
}
