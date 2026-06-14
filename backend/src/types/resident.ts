import { BaseEntity } from "./base";
export enum ResidentStatus {
  Active = "ACTIVE",
  Discharged = "DISCHARGED",
  OnLeave = "ON_LEAVE",
}

export interface Resident extends BaseEntity {
  facility_id: number;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  move_in_date?: string;
  move_out_date?: string;
  room_number?: string;
  status: ResidentStatus;
  active: boolean;
}

