const fs = require("fs");
const path = require("path");
const os = require("os");
const { sortJSON } = require("./sort_json");

const HOME_PATH = os.homedir();

const filePath = path.join(HOME_PATH, `Library/Application Support/Code/User/settings.json`);

const vscodeConfig = fs.readFileSync(filePath, { encoding: "utf-8" });

fs.writeFileSync(filePath, JSON.stringify(sortJSON(JSON.parse(vscodeConfig)), null, 2));
