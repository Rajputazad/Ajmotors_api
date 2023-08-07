const multer = require("multer");
// const mime = require('mime');
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
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif','image/jpg','image/heic'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
}).array("images");

module.exports = upload;