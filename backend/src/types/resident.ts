export enum ResidentStatus {
  Active = "ACTIVE",
  Discharged = "DISCHARGED",
  OnLeave = "ON_LEAVE",
}

export interface Resident {
  id: number;
  name: string;
  age: number;
  roomNumber?: number;
  status?: ResidentStatus;
  admissionDate?: string;
  dischargeDate?: string;
}
