import { createResidentController, getResidentByIdController } from "../src/controller/resident/residentController";
import { ResidentRepository } from "../src/repository/residentRepository";

function mockRes() {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
    
}

//create
describe("createResidentController",()=>{
    it("returns 400 when required fields are missing", async()=>{
        const req:any = {body:{name:"", dateOfBirth:"", roomNumber:""}};
        const res = mockRes();
        const createSpy = jest
        .spyOn(ResidentRepository, "createResident")
        .mockResolvedValue({id:1,name:"Test",dateOfBirth:"03/04/2020", roomNumber:"32"} as any);

        await createResidentController(req,res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Name, DOB, and room number are required",
        })
        expect(createSpy).not.toHaveBeenCalled(); 
    })
})

//get single resident
describe("getResidentByIdController",()=>{
    it("returns 400 when Invalid ID", async()=>{
        const req:any = {params:{id:"abc"}};
        const res = mockRes();
        const getResidentById  = jest
        .spyOn(ResidentRepository, "getResidentById")
        .mockResolvedValue({id:1,name:"Test",dateOfBirth:"03/04/2020", roomNumber:"32"} as any);

        await getResidentByIdController(req,res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid ID. Must be a number.",
        })
        expect(getResidentById).not.toHaveBeenCalled(); 

    })
})