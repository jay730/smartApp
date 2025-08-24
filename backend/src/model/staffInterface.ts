// src/model/staffInterface.ts
export interface Staff {
  id: number;
  name: string;
  role: "caregiver" | "nurse" | "admin"; // can extend with other roles
  assignedResidents: number[]; // list of resident IDs
  fileRefs?: string[] | string; // credential files, certificates, etc.
  createdAt?: string;
  updatedAt?: string;
}
//client server model - stateless server model - web development is based on client server model.
//what does it mean that web requests are stateless.
//export type StaffCreateDTO = Omit<Staff, "id" | "createdAt" | "updatedAt">;
