import { Resident } from "../model/residentInterface";
import { ResidentRepository } from "../repository/residentRepository";
import { VirusScanner, ScanResult } from "../service/virusScanner";
import fs from "fs";
import path from "path";

export class ResidentService {
  private static virusScanner = new VirusScanner("localhost", 3310);

  static async createResident(
    data: Omit<Resident, "id"> & { files?: Express.Multer.File[] }
  ): Promise<Resident> {
    if (!data.name || data.name.trim() === "") {
      throw new Error("Resident name is required");
    }

    const fileRefs: string[] = [];

    if (data.files && data.files.length > 0) {
      for (const file of data.files) {
        // Scan the file
        const result: ScanResult = await this.virusScanner.scanStream(
          fs.createReadStream(file.path)
        );

        if (result.isInfected) {
          // Delete infected file immediately
          fs.unlinkSync(file.path);
          throw new Error(
            `File ${file.originalname} is infected with ${result.signature}`
          );
        }

        // If clean, save filename to array
        fileRefs.push(file.filename);
      }
    }

    // Prepare data for DB
    const residentData: Omit<Resident, "id"> & { fileRefs?: string[] } = {
      ...data,
      fileRefs,
    };

    return ResidentRepository.createResident(residentData);
  }

  static async getAllResidents(): Promise<Resident[]> {
    return ResidentRepository.getAllResidents();
  }

  static async getResidentById(id: number): Promise<Resident | undefined> {
    return ResidentRepository.getResidentById(id);
  }

  static async updateResident(
    id: number,
    data: Partial<Omit<Resident, "id"> & { files?: Express.Multer.File[] }>
  ): Promise<Resident | undefined> {
    if (data.name !== undefined && data.name.trim() === "") {
      throw new Error("Name cannot be empty");
    }

    // Remove the files property before sending to repository
    const { files, ...dataForUpdate } = data;

    return ResidentRepository.updateResident(id, dataForUpdate);
  }

  static async deleteResident(id: number): Promise<void> {
    return ResidentRepository.deleteResident(id);
  }
}
