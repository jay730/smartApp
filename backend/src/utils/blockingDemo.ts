import fs from "fs";

const data = fs.readFileSync("C:/Users/Jay/Desktop/codebase/smartApp/backend/src/data/facility.json", "utf-8");
console.log(data);
console.log("done reading");

fs.readFile("C:/Users/Jay/Desktop/codebase/smartApp/backend/src/data/facility.json", "utf-8", (err, data)=>{
    console.log(data);
});
console.log("moving on");


