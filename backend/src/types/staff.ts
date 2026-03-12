export enum StaffRole {
  Nurse = "NURSE",
  Caregiver = "CAREGIVER",
  Doctor = "DOCTOR",
  Admin = "ADMIN",
}
export interface StaffMember {
  id: number;
  name: string;
  role: StaffRole;
  email: string;
  supervisorId?: number;
}
