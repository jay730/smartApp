import { Resident } from "../types/resident";
import { residents as initialResidents } from "../data/residents";
import { BaseService } from "./baseService";

export class ResidentService extends BaseService<Resident> {
  constructor() {
    super();
    this.items = [...initialResidents];
  }

  updateResident = (
    id: number,
    updateData: Partial<Omit<Resident, "id">>,
  ): Resident | undefined => {
    for (const resident of this.items) {
      if (resident.id === id) {
        Object.assign(resident, updateData);
        return resident;
      }
    }
    return undefined;
  };
}

const service = new ResidentService();
console.log(service.create({ id: 1, name: "John", age: 30 }));
console.log(service.getAll());
console.log(service.getById(1));
console.log(service.updateResident(1, { name: "Jane" }));
console.log(service.delete(1));
console.log(service.getAll());
console.log(service.delete(99));
