// src/middleware/uploadMiddleware.ts
import multer from "multer";

// Use memory storage to keep files in RAM
const storage = multer.memoryStorage();

// Optional: set file size limits or file filters
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per file
  },
  fileFilter: (req, file, cb) => {
    // Accept images and text files for testing virus scanner
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("text/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and text files are allowed"));
    }
  },
});

export default upload;
