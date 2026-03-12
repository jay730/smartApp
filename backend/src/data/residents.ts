import { Resident, ResidentStatus } from "../types/resident";

export const residents: Resident[] = [
  {
    id: 1,
    name: "Mary Johnson",
    age: 78,
    roomNumber: 101,
    status: ResidentStatus.Active,
    admissionDate: "2026-01-15",
  },
  {
    id: 2,
    name: "George Smith",
    age: 85,
    roomNumber: 102,
    status: ResidentStatus.Discharged,
    admissionDate: "2025-08-10",
    dischargeDate: "2026-02-28",
  },
  {
    id: 3,
    name: "Evelyn Davis",
    age: 90,
    roomNumber: 103,
    status: ResidentStatus.OnLeave,
    admissionDate: "2025-12-01",
  },
];
