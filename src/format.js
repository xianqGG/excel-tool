const rangeReg = /\-|至/;
const oddReg = /（单号）/;
const evenReg = /（双号）/;
const countReg = /（(\d+)个）/;
const numReg = /^\d+$/;
const separatorReg = /、|，/;

function isNun(v) {
  return numReg.test(v);
}

function format(input) {
  if (typeof input !== "string" || !input) return [];
  const [field, value] = input.split("：");

  if (!value) {
    console.log(`格式不匹配跳过：【${input}】`);
    return [];
  }

  return value
    .split(separatorReg)
    .reduce((res, curr) => {
      return [...res, ...parseValue(curr)];
    }, [])
    .map((val) => [field, val]);
}

function parseValue(val = "") {
  // 不是范围
  if (!rangeReg.test(val)) {
    return [val];
  }

  // ------- 处理 val 中的控制符
  // 0 无，1 单数，2 偶数
  const step =
    [oddReg, evenReg].findIndex((it) => {
      const res = it.test(val);
      val = val.replace(it, "");
      return res;
    }) + 1;

  let count = 0;
  try {
    count = +val.match(countReg)[1];
    val = val.replace(countReg, "");
  } catch (error) {
    count = 0;
  }

  // 重复
  if (count) {
    return Array(count).fill(val);
  }

  const [start, end] = val.split(rangeReg);

  // 开头比结尾大也不是范围表示
  if (isNun(start) && isNun(end) && +start >= +end) {
    return [val];
  }

  const matchReg = new RegExp(end.replace(/\d+/, "(\\d+)"));
  const [startRes, endRes] = [matchReg.exec(start), matchReg.exec(end)];

  if (!startRes || !endRes) {
    console.log("解析错误：", {
      start,
      end,
      val,
      matchReg,
    });
    return [];
  }

  const [numStart, numEnd] = [+startRes[1], +endRes[1]];

  const res = [];
  for (let index = numStart; index <= numEnd; index++) {
    if (step && index % 2 !== step % 2) {
      continue;
    }

    res.push(
      start.replace(matchReg, (match, num) => {
        return match.replace(num, index);
      })
    );
  }

  return res;
}

function postHandle(field, value) {
  const regex = /(\d+)号/;
  if (regex.test(value)) {
    return [field + value.replace(regex, ""), regex.exec(value)[1]];
  }
  return [field, value];
}

function formatWithPostHandle(input) {
  return format(input).map(([field, value]) => postHandle(field, value));
}

module.exports.formatWithPostHandle = formatWithPostHandle;
module.exports.format = format;
module.exports.parseValue = parseValue;
