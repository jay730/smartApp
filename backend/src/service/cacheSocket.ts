import net from "net";

export class CacheSocket {
  private socket: net.Socket | null = null;
  private host: string;
  private port: number;
  private onExpire?: () => void;

  constructor(host: string, port: number, onExpire?: () => void) {
    this.host = host;
    this.port = port;
    this.onExpire = onExpire;
  }

  public getSocket(): Promise<net.Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket && !this.socket.destroyed) {
        resolve(this.socket);
        return;
      }

      // creates socket once
      this.socket = net.createConnection(this.port, this.host, () => {
        resolve(this.socket!);
      });

      // reuses same socket
      this.socket.once("error", (err) => {
        this.expire();
        reject(err);
      });

      // clears on error / close
      //make sure close is not using expire and letting the socket exist.
      this.socket.once("close", () => {
        this.expire();
      });
    });
  }
  //write an integration test where the same instance of a socket is used for multiple virus scans.

  public expire() {
    this.socket = null;
    if (this.onExpire) {
      this.onExpire(); // notify factory
    }
  }

  // closes when close() called
  public close() {
    if (this.socket && !this.socket.destroyed) {
      this.socket.end();
      this.socket = null;
    }
  }
}