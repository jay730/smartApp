import { staff } from "../data/staff";
import { Staff, StaffRole } from "../types/staff";

export function getAllResidents(): Staff[] {
  return staff;
}

export function getStaffById(id: number): Staff | undefined {
  for (const staffMember of staff) {
    if (staffMember.id === id) {
      return staffMember;
    }
  }
  return undefined;
}

export function createStaff(newStaff: Staff): Staff | string {
  for (const staffMember of staff) {
    if (staffMember.id === newStaff.id) {
      return "Staff with the same ID already exists";
    }
  }
  newStaff.role = newStaff.role ?? StaffRole.Caregiver;
  staff.push(newStaff);
  return newStaff;
}

export function updateStaff(
  id: number,
  updateData: Partial<Omit<Staff, "id">>,
): Staff | undefined {
  for (const staffMember of staff) {
    if (staffMember.id === id) {
      Object.assign(staffMember, updateData);
      return staffMember;
    }
  }
  return undefined;
}

export function deleteStaff(id: number): boolean {
  for (let i = 0; i < staff.length; i++) {
    if (staff[i]?.id === id) {
      staff.splice(i, 1);
      return true;
    }
  }
  return false;
}

export function getStaffByRole(
  role: StaffRole,
  supervisorId?: number,
): Staff[] {
  const selectedStaff = [];
  if (supervisorId) {
    for (const staffMember of staff) {
      if (
        staffMember.role == role &&
        staffMember.supervisorId == supervisorId
      ) {
        selectedStaff.push(staffMember);
      }
    }
    return selectedStaff;
  } else {
    for (const staffMember of staff) {
      if (staffMember.role == role) {
        selectedStaff.push(staffMember);
      }
    }
  }
  return selectedStaff;
}

console.log(1, createStaff({ id: 1, name: "John", role: StaffRole.Nurse }));
console.log(2, staff);
console.log(3, getStaffById(1));
console.log(4, updateStaff(1, { name: "Jane" }));
console.log(5, deleteStaff(3));
console.log(6, createStaff({ id: 4, name: "John", role: StaffRole.Nurse }));
console.log(7, deleteStaff(99));
console.log(6, createStaff({ id: 3, name: "Jackie" }));
console.log(9, staff);
