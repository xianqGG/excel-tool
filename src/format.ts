import { logger } from "./logger";

const rangeReg = /\-|至/;
const oddReg = /（单号）/;
const evenReg = /（双号）/;
const countReg = /（(\d+)个）/;
const numReg = /^\d+$/;
const separatorReg = /、|，/;
const specialSingle = /(\d+\-\d+)号/;

function isNun(v) {
  return numReg.test(v);
}

function format(input: string): Array<[string, string]> {
  if (typeof input !== "string" || !input) return [];
  input = input.trim();

  // 望月巷：5附1号-3号、11附1号-3号、65附1号-4号；
  // 沫东坝村：7组112附1号-48号、7组117附1号-72号；
  if (/附\d+号\-\d+号$/.test(input)) {
    const [field, value] = input.split("：");
    return value
      .split(separatorReg)
      .reduce<
        Array<{
          prefix: string;
          suffix: string;
        }>
      >((res, curr) => {
        const [head, range] = curr.split("附");
        let [fieldSuffix, numPrefix] = ["", ""];
        if (numReg.test(head)) {
          [fieldSuffix, numPrefix] = ["", head];
        } else {
          const t = head.split("组");
          [fieldSuffix, numPrefix] = [t[0] + "组", t[1]];
        }
        const [start, end] = range.split(rangeReg);
        const [startN, endN] = [start, end].map((it) => +it.replace("号", ""));
        const result = Array.from({ length: endN - startN + 1 }).map(
          (_, i) => ({
            prefix: fieldSuffix,
            suffix: `${numPrefix}-${i + startN}`,
          })
        );
        return [...res, ...result];
      }, [])
      .map((val) => [field + val.prefix, val.suffix]);
  }

  const [field, value] = input.split("：");

  if (!value) {
    logger.error(`格式不匹配跳过：【${input}】`);
    return [];
  }

  return value
    .split(separatorReg)
    .reduce((res, curr) => {
      return [...res, ...parseValue(curr)];
    }, [])
    .map((val) => [field, val]);
}

function parseValue(val = ""): string[] {
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

  // 特殊的，看着是范围，实际是单个
  if (specialSingle.test(val)) {
    return [val];
  }

  // 不是范围
  if (!rangeReg.test(val)) {
    return [val];
  }

  // 通用的范围处理
  const [start, end] = val.split(rangeReg);

  // 开头比结尾大也不是范围表示
  if (isNun(start) && isNun(end) && +start >= +end) {
    return [val];
  }

  const matchReg = new RegExp(end.replace(/\d+/, "(\\d+)"));
  const [startRes, endRes] = [matchReg.exec(start), matchReg.exec(end)];

  if (!startRes || !endRes) {
    logger.error("解析错误：", {
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
        return match.replace(num, index + "");
      })
    );
  }

  return res;
}

function numToChinese(num: number): string {
  var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
  var chnUnitChar = ["", "十", "百", "千"];

  function SectionToChinese(section) {
    var strIns = "",
      chnStr = "";
    var unitPos = 0;
    var zero = true;
    while (section > 0) {
      var v = section % 10;
      if (v === 0) {
        if (!zero) {
          zero = true;
          chnStr = chnNumChar[v] + chnStr;
        }
      } else {
        zero = false;
        strIns = chnNumChar[v];
        strIns += chnUnitChar[unitPos];
        chnStr = strIns + chnStr;
      }
      unitPos++;
      section = Math.floor(section / 10);
    }
    return chnStr;
  }

  var unitPos = 0;
  var strIns = "",
    chnStr = "";
  var needZero = false;

  if (num === 0) {
    return chnNumChar[0];
  }

  while (num > 0) {
    var section = num % 10000;
    if (needZero) {
      chnStr = chnNumChar[0] + chnStr;
    }
    strIns = SectionToChinese(section);
    strIns += section !== 0 ? chnUnitSection[unitPos] : chnUnitSection[0];
    chnStr = strIns + chnStr;
    needZero = section < 1000 && section > 0;
    num = Math.floor(num / 10000);
    unitPos++;
  }

  chnStr = chnStr.replace(/^一十/, "十");

  return chnStr;
}

/**
 * 后处理，修饰、美化、调整结果
 * @param field
 * @param value
 * @returns
 */
function postHandle(field: string, value: string): [string, string] {
  const regex = /(\d+)号/;

  if (specialSingle.test(value)) {
    [field, value] = [
      field + value.replace(specialSingle, ""),
      specialSingle.exec(value)[1],
    ];
  } else if (regex.test(value)) {
    [field, value] = [field + value.replace(regex, ""), regex.exec(value)[1]];
  }

  field = field.replace(/(\d+)组/, (match, n) =>
    match.replace(n, numToChinese(+n))
  );

  return [field, value];
}

function formatWithPostHandle(input: string) {
  return format(input).map(([field, value]) => postHandle(field, value));
}

export { formatWithPostHandle, format, parseValue, numToChinese };
