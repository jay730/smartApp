import net from "net";
import { Readable } from "stream";

export interface ScanResult {
  raw: string;
  isInfected: boolean;
  signature?: string;
}

export class VirusScanner {
  private readonly host: string;
  private readonly port: number;

  constructor(host = "localhost", port = 3310) {
    this.host = host;
    this.port = port;
  }

  async scanStream(fileStream: Readable): Promise<ScanResult> {
    const socket = net.createConnection(this.port, this.host);
    socket.setEncoding("utf8");
    socket.setTimeout(10000);

    return new Promise<ScanResult>((resolve, reject) => {
      let response = "";
      let totalBytes = 0;

      socket.on("connect", () => {
        console.warn("Connected to clamd");
        socket.write("zINSTREAM\0");

        fileStream.on("data", (chunk) => {
          totalBytes += chunk.length;
          const lengthBuffer = Buffer.alloc(4);
          lengthBuffer.writeUInt32BE(chunk.length, 0);
          socket.write(lengthBuffer);
          socket.write(chunk);
        });

        fileStream.on("end", () => {
          console.warn(`File sent: ${totalBytes} bytes`);
          const zero = Buffer.alloc(4);
          socket.write(zero, () => {
            setTimeout(() => socket.end(), 10);
          });
        });

        fileStream.on("error", (err) => {
          socket.destroy();
          reject(err);
        });
      });

      socket.on("data", (data) => {
        response += data;
      });

      socket.on("end", () => {
        const result = this.parseResponse(response);
        resolve(result);
      });

      socket.on("timeout", () => {
        socket.destroy();
        reject(new Error("ClamAV socket timed out"));
      });

      socket.on("error", (err) => {
        reject(err);
      });
    });
  }

  private parseResponse(response: string): ScanResult {
    const trimmed = response.trim();
    const match = /stream: (.+) FOUND/.exec(trimmed);

    return {
      raw: trimmed,
      isInfected: Boolean(match),
      signature: match?.[1],
    };
  }
}
