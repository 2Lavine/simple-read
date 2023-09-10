// read a html file replace _resources/_resources/ to _resources/
const fs = require("fs");
const path = require("path");
// dont change name
// file path is fixed
//get file absoulte path from cli
// const filePath = path.join(__dirname, "./output/2021-10-10 10-10-10.html");
const filePath = process.argv[2];
const fileContent = fs.readFileSync(filePath, "utf8");
const newFileContent = fileContent.replace(
  /_resources\/_resources\//g,
  "_resources/"
);
fs.writeFileSync(filePath, newFileContent);
