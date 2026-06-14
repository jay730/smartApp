import express from "express";
import { errorHandler } from "./middleware/errorhandler";
import facilityRoutes from "./routes/facilityRoutes";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/facilities", facilityRoutes);

app.use(errorHandler);

export default app;
