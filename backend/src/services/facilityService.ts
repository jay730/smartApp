import { Facility } from "../types/facility";
import initialFacilities from "../data/facility.json";
import { BaseService } from "./baseService";

export class FacilityService extends BaseService<Facility> {
  constructor() {
    super();
    this.items = [...initialFacilities];
  }

  updateFacility = (
    id: number,
    updateData: Partial<Omit<Facility, "id">>,
  ): Facility | undefined => {
    for (const facility of this.items) {
      if (facility.id === id) {
        Object.assign(facility, updateData);
        return facility;
      }
    }
    return undefined;
  };
}

const service = new FacilityService();

