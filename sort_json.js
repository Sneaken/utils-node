/**
 * 简易的json排序方法
 * @param {*} json
 * @returns
 */
function sortJSON(json) {
  if (typeof json !== "object" || Array.isArray(json)) return json;
  const res = {};
  Object.keys(json)
    .sort()
    .forEach((key) => {
      res[key] = sortJSON(json[key]);
    });

  return res;
}

module.exports = {
  sortJSON,
};
