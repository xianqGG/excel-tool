// https://www.npmjs.com/package/xlsx
import {
  IFormBag,
  toast,
  Dialog,
  Form,
  Button,
  Input,
  Switch,
} from "@muya-ui/core";
import { fileOpen } from "browser-fs-access";
import React, { useRef } from "react";
import * as xlsx from "xlsx";
import { exportExcel, fileToWorkbook, sum } from "./utils";

export const SortButton: React.FC<{
  v: number;
}> = ({ v }) => {
  type IForm = {
    groupCount: number;
    // true 升序
    order: boolean;
  };
  const isLoading = useRef(false);
  const formRef = useRef<IFormBag<IForm>>();

  const selectFile = async () => {
    const file = await fileOpen({
      extensions: [".xlsx", ".xls"],
    });

    const workbook = await fileToWorkbook(file);
    const data: Item[] = []; // 存储获取到的数据
    // 遍历每张工作表进行读取（这里默认只读取第一张表）
    for (const sheet in workbook.Sheets) {
      // 利用 sheet_to_json 方法将 excel 转成 json 数据
      data.push(
        ...xlsx.utils.sheet_to_json<any>(workbook.Sheets[sheet], {
          header: "A",
        })
      );
      break; // read first
    }

    // group
    const grouped = data.reduce<Record<string, Item[]>>((acc, cur) => {
      const roadName = cur.A.split(/\d/)[0];
      acc[roadName] = acc[roadName] || [];
      acc[roadName].push(cur);
      return acc;
    }, {});

    let groupedEntries = Object.entries(grouped);
    groupedEntries = groupedEntries.map(([roadName, arr]) => {
      return [
        roadName,
        arr.sort((a, b) => {
          const parse = (str: string) =>
            String(str || "")
              .split(/(\d+)/)
              .filter((it) => /^\d+$/.test(it))
              .map((it) => +it);

          const aNums = parse(a.C);
          const bNums = parse(b.C);
          const minL = Math.min(aNums.length, bNums.length);
          const delta = aNums.length - bNums.length;
          if (delta !== 0) return delta;
          for (let i = 0; i < minL; i++) {
            const [ia, ib] = [aNums[i], bNums[i]];
            if (ia > ib) return 1;
            if (ib > ia) return -1;
          }
        }),
      ];
    });
    groupedEntries.sort((a, b) => b[1].length - a[1].length);
    return groupedEntries;
  };

  const v1 = async () => {
    Dialog.info({
      title: "请输入分组数量，默认是 4",
      text: (
        <div>
          <Form formBagRef={formRef}>
            <Form.Item label="分组数量" name="groupCount">
              <Input />
            </Form.Item>
            <Form.Item label="排序" name="order" valuePropName="checked">
              <Switch checkedChildren="升序" unCheckedChildren="降序" />
            </Form.Item>
          </Form>
        </div>
      ),
      onConfirm: async () => {
        try {
          const vals = formRef.current.values!;
          const groupCount = +vals.groupCount || 4;
          const sorttype = vals.order;
          const groupedEntries = await selectFile();
          const finalData = await sort(groupedEntries, groupCount, sorttype);
          exportExcel(finalData);
        } catch (error) {
          console.error(error);
          alert("出错了：" + error);
          return true;
        }
      },
    });
  };

  const v2 = async () => {
    try {
      const groupedEntries = await selectFile();
      const finalData = await sort2(groupedEntries);
      exportExcel(finalData);
    } catch (error) {
      console.error(error);
      alert("出错了：" + error);
      return true;
    }
  };

  return (
    <Button type="primary" autoLoading onClick={v === 2 ? v2 : v1}>
      UV二维码夜光门牌排序v{v}
    </Button>
  );
};

type Item = {
  A: string;
  B: string;
  C: string;
  D: string;
  E: string;
};

// ABCD 组完后  继续组  BCDD  再 CDCD   最后   DDDD  或者是  CCCC....
const sort2 = async (entries: Array<[string, Item[]]>) => {
  const resultArr: Item[] = [];
  const groupCount = 4;
  for (
    let groupI = 0;
    groupI < entries.length && groupCount;
    groupI += groupCount
  ) {
    const gs = entries.slice(groupI, groupI + groupCount).reverse();
    const lens = gs.map((it) => it[1].length);
    const min = Math.min(...lens);
    const max = Math.max(...lens);

    const total = sum(...gs.map((it) => it[1].length));

    const idxs = new Array(gs.length).fill(0);
  }

  return resultArr;
};

const sort = async (
  entries: Array<[string, Item[]]>,
  groupCount: number,
  sorttype: boolean
) => {
  const resultArr: Item[] = [];

  for (
    let groupI = 0;
    groupI < entries.length && groupCount;
    groupI += groupCount
  ) {
    let gs = entries.slice(groupI, groupI + groupCount);
    if (sorttype) {
      gs = gs.reverse();
    }
    const lens = gs.map((it) => it[1].length);
    const min = Math.min(...lens);
    const max = Math.max(...lens);

    for (let i = 0; i < min; i++) {
      for (let j = 0; j < groupCount; j++) {
        const group = gs[j];
        if (group) {
          const el = group[1][i];
          resultArr.push({ ...el });
        }
      }
    }

    for (let j = 0; j < groupCount; j++) {
      for (let i = min; i < max; i++) {
        const group = gs[j];
        const el = group?.[1]?.[i];
        el && resultArr.push({ ...el });
      }
    }

    resultArr.push({} as any);
  }

  const finalData = [...resultArr];

  return finalData;
};
