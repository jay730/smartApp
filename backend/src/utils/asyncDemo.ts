import * as fs from "fs";

async function readFacilityFile(): Promise<any[]> {
  try {
    const raw = await fs.promises.readFile("C:/Users/Jay/Desktop/codebase/smartApp/backend/src/data/facility.json", "utf-8");
    return JSON.parse(raw.toString());
  } catch (err) {
    console.log(err);
    return [];
  }
}

readFacilityFile().then(data => console.log(data));