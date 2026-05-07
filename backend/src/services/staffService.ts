import { staff as initialStaff } from "../data/staff";
import { Staff, StaffRole } from "../types/staff";

export class StaffService {
  private staff: Staff[] = [...initialStaff];
  getAllStaff = (): Staff[] => {
    return this.staff;
  };

  getStaffById = (id: number): Staff | undefined => {
    for (const staffMember of this.staff) {
      if (staffMember.id === id) {
        return staffMember;
      }
    }
    return undefined;
  };

  createStaff = (newStaff: Staff): Staff | string => {
    for (const staffMember of this.staff) {
      if (staffMember.id === newStaff.id) {
        return "Staff with the same ID already exists";
      }
    }
    newStaff.role = newStaff.role ?? StaffRole.Caregiver;
    this.staff.push(newStaff);
    return newStaff;
  };

  updateStaff = (
    id: number,
    updateData: Partial<Omit<Staff, "id">>,
  ): Staff | undefined => {
    for (const staffMember of this.staff) {
      if (staffMember.id === id) {
        Object.assign(staffMember, updateData);
        return staffMember;
      }
    }
    return undefined;
  };

  deleteStaff = (id: number): boolean => {
    for (let i = 0; i < this.staff.length; i++) {
      if (this.staff[i]?.id === id) {
        this.staff.splice(i, 1);
        return true;
      }
    }
    return false;
  };

  getStaffByRole = (role: StaffRole, supervisorId?: number): Staff[] => {
    const selectedStaff = [];
    if (supervisorId) {
      for (const staffMember of this.staff) {
        if (
          staffMember.role == role &&
          staffMember.supervisorId == supervisorId
        ) {
          selectedStaff.push(staffMember);
        }
      }
      return selectedStaff;
    } else {
      for (const staffMember of this.staff) {
        if (staffMember.role == role) {
          selectedStaff.push(staffMember);
        }
      }
    }
    return selectedStaff;
  };
}

const service = new StaffService();

console.log(
  1,
  service.createStaff({ id: 1, name: "John", role: StaffRole.Nurse }),
);
console.log(2, service.getAllStaff());
console.log(3, service.getStaffById(1));
console.log(4, service.updateStaff(1, { name: "Jane" }));
console.log(5, service.deleteStaff(3));
console.log(
  6,
  service.createStaff({ id: 4, name: "John", role: StaffRole.Nurse }),
);
console.log(7, service.deleteStaff(99));
console.log(6, service.createStaff({ id: 3, name: "Jackie" }));
console.log(9, service.getAllStaff());
