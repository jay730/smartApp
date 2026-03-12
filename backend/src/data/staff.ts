import { StaffMember, StaffRole } from "../types/staff";

export const staff: StaffMember[] = [
  {
    id: 1,
    name: "Dr. Sarah Patel",
    role: StaffRole.Doctor,
    email: "sarah.patel@facility.com",
  },
  {
    id: 2,
    name: "Michael Torres",
    role: StaffRole.Nurse,
    email: "michael.torres@facility.com",
    supervisorId: 1,
  },
  {
    id: 3,
    name: "Dr. Emily Carter",
    role: StaffRole.Doctor,
    email: "emily.carter@facility.com",
  },
];
