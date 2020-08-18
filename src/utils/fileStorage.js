var admin = require("firebase-admin");
var serviceAccount = require("../../serviceAccountKey.json");
var fs = require('fs');

async function renameFile(oldFilename, index){
  if (oldFilename.match(/\.jpg/)) {
    let filename =  index + ".jpg";
    fs.renameSync(oldFilename, filename);
    return Promise.resolve(filename);
  } else if (oldFilename.match(/\.jpeg/)) {
    let filename = index + ".jpeg";
    fs.renameSync(oldFilename, filename);
    return Promise.resolve(filename);
  }else if(oldFilename.match(/\.png/)) {
    let filename = index + ".png";
    fs.renameSync(oldFilename, filename);
    return Promise.resolve( filename);
  }
}

const storeFile = async (activity,bucketName,files,eventName) => {
    var bucket = admin.storage().bucket(bucketName);
    var images = [];

    for (let i = 0; i < files.length; i++) {

      let newFilename = await renameFile(files[i].originalname, i);

      let file = bucket.file(activity+"/"+eventName + "/" + newFilename);

      fs.createReadStream(newFilename)
        .pipe(file.createWriteStream({ gzip: true }))
        .on("error", function (err) {
        return res.status(500).send({ status: "File not uploaded" });
        });

      let url = "https://firebasestorage.googleapis.com/v0/b/" + admin.storage().bucket().name + "/o/"
        + activity + "%2F" + encodeURIComponent(eventName) + "%2F" + newFilename + "?alt=media";

      images.push(url);

      fs.unlinkSync(newFilename); 
    }
    return images;
}

module.exports = {
    storeFile
}