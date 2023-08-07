const multer = require("multer");

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "uploads/");
  // },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (
      file.fieldname=null
    ) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
}).array("images");

module.exports = upload;