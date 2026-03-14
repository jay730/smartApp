export enum StaffRole {
  Nurse = "NURSE",
  Caregiver = "CAREGIVER",
  Doctor = "DOCTOR",
  Admin = "ADMIN",
}
export interface Staff {
  id: number;
  name: string;
  role: StaffRole;
  email: string;
  supervisorId?: number;
}
