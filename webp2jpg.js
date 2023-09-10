// convert all webp images in a folder to jpg
const fs = require("fs");
const sharp = require("sharp");
const directoryPath = "./_resources"; // 替换为目标目录的路径
//read all file in directory
fs.readdir(directoryPath, (err, files) => {
  files.forEach((file) => {
    //convert webp to jpg and delete the file end with webp
    if (file.endsWith(".webp")) {
      const filePath = directoryPath + "/" + file;
      sharp(filePath)
        .toFormat("jpeg")
        .toFile(filePath.replace(".webp", ".jpg"))
        .then(() => {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        });
    }
  });
});
