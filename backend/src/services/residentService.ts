import { residents } from "../data/residents";
import { Resident } from "../types/resident";

export function getAllResidents(): Resident[] {
  return residents;
}

export function getResidentById(id: number): Resident | undefined {
  for (const resident of residents) {
    if (resident.id === id) {
      return resident;
    }
  }
  return undefined;
}

export function createResident(newResident: Resident): Resident | string {
  for (const resident of residents) {
    if (resident.id === newResident.id) {
      return "Resident with the same ID already exists";
    }
  }
  residents.push(newResident);
  return newResident;
}

export function updateResident(
  id: number,
  updateData: Partial<Omit<Resident, "id">>,
): Resident | undefined {
  for (const resident of residents) {
    if (resident.id === id) {
      Object.assign(resident, updateData);
      return resident;
    }
  }
  return undefined;
}

export function deleteResident(id: number): boolean {
  for (let i = 0; i < residents.length; i++) {
    if (residents[i]?.id === id) {
      residents.splice(i, 1);
      return true;
    }
  }
  return false;
}

console.log(createResident({ id: 1, name: "John", age: 30 }));
console.log(residents);
console.log(getResidentById(1));
console.log(updateResident(1, { name: "Jane" }));
console.log(deleteResident(1));
console.log(residents)
console.log(deleteResident(99));
