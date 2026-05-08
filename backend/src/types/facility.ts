import { BaseEntity } from "./base";

export interface Facility extends BaseEntity {
  address?: string;
  phone?: string;
  capacity?: number;
  active?: boolean;
}
