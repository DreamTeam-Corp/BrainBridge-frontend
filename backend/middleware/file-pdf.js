const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Создаем директорию если она не существует
const dir = "backend/pdfs";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const MIME_TYPE_MAP = {
  "application/pdf": "pdf",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, dir);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

module.exports = multer({ storage: storage }).single("pdf");
