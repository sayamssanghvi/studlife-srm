const multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(undefined, '');
    },
    filename: function (req, file, cb) {        
        cb(undefined, file.originalname);
    }
});

var upload = multer({
    storage,
    limits: {
    fileSize: 4000000,
    },
    fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.pdf/)) {
      return cb(new Error("Please upload a pdf file"));
    }
    cb(undefined, true);
  }
});

var uploadImages = multer({
    storage,
    limits: {
    fileSize: 4000000,
    },
    fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.jpeg|\.jpg|\.png/)) {
      return cb(new Error("Please upload a jpg,jpeg,png file"));
    }
    cb(undefined, true);
  }
});

module.exports = {
    upload,
    uploadImages
}
