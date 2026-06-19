import { BaseEntity } from "./base";
export enum UserRole {
  Admin = "admin",
  Staff = "staff",
  Nurse = "nurse",
  Manager = "manager",
}

export interface User extends BaseEntity {
  facility_id: number | null;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  phone?: string;
  active: boolean;
}