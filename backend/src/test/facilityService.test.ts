import { Facility } from "../types/facility";
import initialFacilities from "../data/facility.json";
import { BaseService } from "../services/baseService";
import { FacilityService } from "../services/facilityService";

const service = new FacilityService();

describe("FacilityService", () => {
  it("getAll() returns an array", () => {
    const result = service.getAll()
    expect(result).toBeInstanceOf(Array);
  });

  it("getById(101) return Id 101", () => {
    const result = service.getById(101)
    expect(result?.name).toBe("Sunrise Care Facility");
  });

  it("getById(999) return Id 101", () => {
    const result = service.getById(999)
    expect(result).toBeUndefined()
  });

});
