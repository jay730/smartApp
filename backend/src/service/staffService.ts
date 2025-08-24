import { Staff } from "../model/staffInterface";
import { StaffRepository } from "../repository/staffRepository";

export class StaffService {
  static async createStaff(data: Omit<Staff, "id">): Promise<Staff> {
    if (!data.name || data.name.trim() === "") {
      throw new Error("Staff name is required");
    }
    return StaffRepository.createStaff(data);
  }

  static async getAllStaff(): Promise<Staff[]> {
    return StaffRepository.getAllStaff();
  }

  static async getStaffById(id: number): Promise<Staff | undefined> {
    return StaffRepository.getStaffById(id);
  }

  static async updateStaff(
    id: number,
    data: Partial<Omit<Staff, "id">>
  ): Promise<Staff | undefined> {
    if (data.name !== undefined && data.name.trim() === "") {
      throw new Error("Name cannot be empty");
    }
    return StaffRepository.updateStaff(id, data);
  }

  static async deleteStaff(id: number): Promise<void> {
    return StaffRepository.deleteStaff(id);
  }
}
