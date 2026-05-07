import { staff as initialStaff } from "../data/staff";
import { Staff, StaffRole } from "../types/staff";
import { BaseService } from "./baseService";

export class StaffService extends BaseService<Staff> {
 constructor() {
     super();
     this.items = [...initialStaff];
   }

  updateStaff = (
    id: number,
    updateData: Partial<Omit<Staff, "id">>,
  ): Staff | undefined => {
    for (const staffMember of this.items) {
      if (staffMember.id === id) {
        Object.assign(staffMember, updateData);
        return staffMember;
      }
    }
    return undefined;
  };

  getStaffByRole = (role: StaffRole, supervisorId?: number): Staff[] => {
    const selectedStaff = [];
    if (supervisorId) {
      for (const staffMember of this.items) {
        if (
          staffMember.role == role &&
          staffMember.supervisorId == supervisorId
        ) { 
          selectedStaff.push(staffMember);
        }
      }
      return selectedStaff;
    } else {
      for (const staffMember of this.items) {
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
  service.create({ id: 1, name: "John", role: StaffRole.Nurse }),
);
console.log(2, service.getAll());
console.log(3, service.getById(1));
console.log(4, service.updateStaff(1, { name: "Jane" }));
console.log(5, service.delete(3));
console.log(
  6,
  service.create({ id: 4, name: "John", role: StaffRole.Nurse }),
);
console.log(7, service.delete(99));
console.log(6, service.create({ id: 3, name: "Jackie" }));
console.log(9, service.getAll());
