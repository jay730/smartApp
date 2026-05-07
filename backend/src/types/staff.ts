import { BaseEntity } from "./base";
export enum StaffRole {
  Nurse = "NURSE",
  Caregiver = "CAREGIVER",
  Doctor = "DOCTOR",
  Admin = "ADMIN",
}
export interface Staff extends BaseEntity {
  role?: StaffRole;
  email?: string;
  supervisorId?: number;
}
