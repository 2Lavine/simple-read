const fs = require("fs");
const path = require("path");
const directoryPath = "./done"; // 替换为目标目录的路径
const acheievePath = "./achieve";
const now = new Date()
  .toLocaleString("zh-CN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
  .replace(/[/,:]/g, "-");
const outputFilePath = "./output/" + now + ".html"; // 替换为输出文件的路径
const md = require("markdown-it")();

const output = []; // 用于存储所有的 main-content 元素内容

function readDirectory(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        // 如果是目录，则递归读取
        readDirectory(filePath);
      } else if (path.extname(file) !== "html") {
        // 如果是 md 文件，则转换为html
        const fileContent = fs.readFileSync(filePath, "utf8");
        const content =
          "<h1>" +
          path.basename(file, path.extname(file)) +
          "</h1>" +
          md.render(fileContent);
        fs.rename(filePath, path.join(acheievePath, file), (err) => {
          console.error(err);
        });
        output.push(content);
      }
    });

    if (directoryPath === directoryPath) {
      // 如果是最外层的目录，则将所有 main-content 元素内容写入输出文件中
      fs.writeFileSync(outputFilePath, output.join("\n"));
    }
  });
}

readDirectory(directoryPath);
