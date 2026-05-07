import { BaseEntity } from "./base";
export enum ResidentStatus {
  Active = "ACTIVE",
  Discharged = "DISCHARGED",
  OnLeave = "ON_LEAVE",
}

export interface Resident extends BaseEntity {
  age: number;
  roomNumber?: number;
  status?: ResidentStatus;
  admissionDate?: string;
  dischargeDate?: string;
}
