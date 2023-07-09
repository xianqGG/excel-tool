// https://www.npmjs.com/package/xlsx
import * as xlsx from "xlsx";

export const fileToWorkbook = async (excelFile: File) => {
  // 通过FileReader对象读取文件
  const fileReader = new FileReader();
  const p = new Promise<xlsx.WorkBook>((a, r) => {
    fileReader.onload = (fe) => {
      try {
        const workbook = xlsx.read(fe.target.result, { type: "binary" });
        a(workbook);
      } catch (error) {
        r(error);
      }
    };
    fileReader.onerror = r;
  });
  // 以二进制方式打开文件
  fileReader.readAsBinaryString(excelFile);
  return p;
};

export const exportExcel = (data: any, filename = "排序完成.xlsx") => {
  // 导出
  const fi = xlsx.utils.json_to_sheet(data, {});
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, fi);
  xlsx.writeFile(wb, filename);
};

export const sum = (...counts: number[]) =>
  counts.reduce((res, c) => res + c, 0);
