const fs = require('fs');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');

function wrapErrorCallback(cb) {
  return function (fileName, errorMessage) {
    console.log();
    if (errorMessage === undefined) {
      errorMessage = fileName;
      fileName = undefined;
    }

    if (errorMessage) {
      // 检查句末有没有句号
      if (errorMessage[errorMessage.length - 1] !== '.') {
        errorMessage += '.';
      }
      console.log(chalk.red('Maybe something is error: ' + errorMessage));
      console.log();
      if (cb) cb(fileName, errorMessage);
    }
  };
}

async function getCorrectChangelogLog(fileName) {
  const fileStream = fs.createReadStream(fileName);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const changeLog = [];

  let lastVersionLog = [];

  for await (const line of rl) {
    if (line.startsWith('## ')) {
      if (!line.startsWith('## 当前版本')) {
        changeLog.push(lastVersionLog);
        lastVersionLog = [];
      }
    }
    lastVersionLog.push(line);
  }
  // 推送最新的版本日志
  // 保证有个空行
  lastVersionLog.push('');
  changeLog.push(lastVersionLog);

  const currentVersionLog = changeLog.shift();
  return [
    currentVersionLog.join('\n'),
    changeLog
      .map((i) => i.join('\n'))
      .reverse()
      .join('\n'),
  ];
}

// 将 changelog.md 改为 倒叙
async function changeChangeLog(file) {
  const onErrorCallback = wrapErrorCallback();
  if (!file) {
    onErrorCallback('we need a md');
    return;
  }

  // 程序运行的当前路径
  const srcRoot = process.env.PWD;

  const fileName = path.resolve(srcRoot, file);

  if (!fs.existsSync(fileName)) {
    onErrorCallback(fileName + ' not found');
    return;
  }

  const result = await getCorrectChangelogLog(fileName);

  try {
    fs.writeFileSync(fileName, result.join('\n'));
  } catch (e) {
    onErrorCallback(e);
  }
}

changeChangeLog(process.argv[2]);
