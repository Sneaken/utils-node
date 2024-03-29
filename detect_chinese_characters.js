const fs = require('fs');
const path = require('path');

// 递归检测指定目录下的文件
let count = 0;
function scanDirectoryForChineseCharacters(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      // 如果是子目录，递归检测子目录
      if (containsChineseCharacters(filePath)) {
        count++;
        console.log(`目录包含中文字符: ${filePath}`);
      }
      scanDirectoryForChineseCharacters(filePath);
    } else {
      // 如果是文件，检查文件名是否包含中文字符
      if (containsChineseCharacters(filePath)) {
        console.log(`文件包含中文字符: ${filePath}`);
        count++;
      }
    }
  });
}

// 检查文本是否包含中文字符的函数
function containsChineseCharacters(text) {
  const chineseRegex = /[\u4e00-\u9fa5]/;
  return chineseRegex.test(text);
}

try {
  const targetDirectory = process.argv[2] || '.'; // 替换为你要检测的目录路径 默认当前文件夹
  scanDirectoryForChineseCharacters(targetDirectory);
  if (count === 0) {
    console.log("不存在中文")
  }
} catch (e) {
  console.error("异常", e)
}
