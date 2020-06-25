const multer = require("multer");

var filename;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(undefined, 'tempUploads/');
    },
    filename: function (req, file, cb) {
        filename = 'tempUploads/' + file.originalname;
        
        cb(undefined, file.originalname);
    }
});

const Filename =() => {
    return filename;
}


var upload = multer({
    storage,
    limits: {
    fileSize: 2000000,
    },
    fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.pdf/)) {
      return cb(new Error("Please upload a pdf file"));
    }
    cb(undefined, true);
  }
});

module.exports = {
    upload,
    Filename
}
