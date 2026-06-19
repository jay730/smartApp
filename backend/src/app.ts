import express from "express";
import { errorHandler } from "./middleware/errorhandler";
import facilityRoutes from "./routes/facilityRoutes";
import residentRoutes from "./routes/residentRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/facilities", facilityRoutes);
app.use("/api/facilities/:facility_id/residents", residentRoutes);
app.use("/api/facilities/:facility_id/users", userRoutes);


app.use(errorHandler);

export default app;
