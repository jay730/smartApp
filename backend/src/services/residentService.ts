import { Resident } from "../types/resident";
import { residents as initialResidents } from "../data/residents";

export class ResidentService {
  private residents: Resident[] = [...initialResidents];

  getAllResidents = (): Resident[] => {
    return this.residents;
  };

  getResidentById = (id: number): Resident | undefined => {
    for (const resident of this.residents) {
      if (resident.id === id) {
        return resident;
      }
    }
    return undefined;
  };

  createResident = (newResident: Resident): Resident | string => {
    for (const resident of this.residents) {
      if (resident.id === newResident.id) {
        return "Resident with the same ID already exists";
      }
    }
    this.residents.push(newResident);
    return newResident;
  };

  updateResident = (
    id: number,
    updateData: Partial<Omit<Resident, "id">>,
  ): Resident | undefined => {
    for (const resident of this.residents) {
      if (resident.id === id) {
        Object.assign(resident, updateData);
        return resident;
      }
    }
    return undefined;
  };

  deleteResident = (id: number): boolean => {
    for (let i = 0; i < this.residents.length; i++) {
      if (this.residents[i]?.id === id) {
        this.residents.splice(i, 1);
        return true;
      }
    }
    return false;
  };
}

const service = new ResidentService();
console.log(service.createResident({ id: 1, name: "John", age: 30 }));
console.log(service.getAllResidents());
console.log(service.getResidentById(1));
console.log(service.updateResident(1, { name: "Jane" }));
console.log(service.deleteResident(1));
console.log(service.getAllResidents());
console.log(service.deleteResident(99));
