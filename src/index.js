const xlsx = require("node-xlsx").default;
const fs = require("fs");
const path = require("path");
const { formatWithPostHandle } = require("./format");

const CWD = process.cwd();
const join = (...p) => path.resolve(CWD, ...p);

const excelExtensions = ["xls", "xlsx", "xlsm"];

function wait(n = 1000) {
  return new Promise((r) => setTimeout(r, n));
}

async function keepActive() {
  while (true) {
    await wait();
  }
}

keepActive();

function handleExcel(excelPath) {
  const workSheetsFromFile = xlsx.parse(excelPath);
  const sheet1 = workSheetsFromFile[0];
  const inputStr = sheet1.data[1][1] || "";

  const data = inputStr.split("；").reduce(
    (res, curr) => {
      res.push(
        ...formatWithPostHandle(curr).map((it) => ["", "", "", "", ...it])
      );
      return res;
    },
    [
      ["填入类型", "填入需要被分解的内容", "序号", "类型", "名称", "号码"],
      ["", inputStr],
    ]
  );

  const buffer = xlsx.build([
    {
      name: "Sheet1",
      data,
    },
  ]);

  return buffer;
}

(async () => {
  try {
    const RESULT_PATH = join("excels");
    const result = (await fs.promises.readdir(CWD)).filter((it) =>
      excelExtensions.some((ext) => it.endsWith(ext))
    );

    if (!result.length) {
      console.log("当前目录未扫描到 Excel 文件...");
    } else {
      for (let index = 0; index < result.length; index++) {
        const filename = result[index];
        try {
          console.log(`\n开始处理：${filename}`);
          const buff = handleExcel(join(filename));
          try {
            await fs.promises.mkdir(RESULT_PATH);
          } catch (error) {}
          await fs.promises.writeFile(
            path.resolve(RESULT_PATH, filename),
            buff
          );
        } catch (error) {
          console.log(`\n文件【${filename}】处理失败：`, error);
        }
      }

      console.log(`\n全部处理完成，结果在「${RESULT_PATH}」中查看。`);
    }
  } catch (error) {
    console.log("程序执行错误：", error);
  }

  console.log(`\n\n        Ctrl + C 退出程序`);
})();
