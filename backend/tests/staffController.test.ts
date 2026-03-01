import { createStaffController, getStaffByIdController } from "../src/controller/staff/staffController";
import { StaffRepository } from "../src/repository/staffRepository";

function mockRes() {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

//create
describe("createStaffController", ()=>{
    it("returns 500 when repository throws", async()=>{
        const req:any = {body:{name: "", role: ""}};
        const res = mockRes();
        const createSpy = jest
        .spyOn(StaffRepository, "createStaff")
        .mockRejectedValue(new Error("DB failure"));

        await createStaffController(req,res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Failed to create staff",
            details: "DB failure",
        })
        expect(createSpy).toHaveBeenCalled()
    })
})