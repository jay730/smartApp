import { Facility } from "../types/facility";

export function isFacility(value: unknown): value is Facility {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    typeof (value as any).id === "number" &&
    typeof (value as any).name === "string"
  );
}

export function parseFacility(raw: string): Facility | null {
  try {
    const parsed = JSON.parse(raw);
    if (isFacility(parsed)) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

console.log(parseFacility('{"id": 101,"name": "Sunrise Care Facility","address": "123 Maple Street, San Antonio, TX 78201","phone": "(210) 555-1234","capacity": 45,"active": true}'))
console.log(parseFacility('{"address": "123 Maple Street, San Antonio, TX 78201","phone": "(210) 555-1234","capacity": 45,"active": true}'))
