import express from "express";
import cors from "cors";
import residentRoutes from "./routes/residentRoutes";
import staffRoutes from "./routes/staffRoutes";
// import taskRoutes from "./routes/taskRoutes";

const app = express();

app.use(express.json());

// Allow CORS and body parsing
app.use(cors());
app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true })); // parse form-data

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Health check
app.get("/", (_req, res) => {
  res.send("API is running");
});

// Register routes
app.use("/residents", residentRoutes);
app.use("/staff", staffRoutes);
app.use("/tasks", taskRoutes);

// Start server
app.listen(5000, () => {
  console.log(`Server running at http://localhost:5000`);
});
