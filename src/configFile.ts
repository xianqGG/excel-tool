import md5 from "crypto-js/md5";
import encHex from "crypto-js/enc-hex";
import { IItem } from "./types";

const KEY = "my_uid";

export function getUID() {
  try {
    return (localStorage.getItem(KEY) || "").trim();
  } catch (error) {
    return "";
  }
}

export function saveUID(uid: string) {
  localStorage.setItem(KEY, uid);
}

export function clearUID() {
  return saveUID("");
}

export function getMD5(input: string) {
  return md5(input).toString(encHex);
}

// @ts-ignore
window.___md5 = getMD5;

export const ids: IItem[] = [
  {
    uid: "202cb962ac59075b964b07152d234b70",
    // 2021-07-03 12:07:31
    expire: 1625285251000,
    tip: "",
    remark: "",
  },
  {
    uid: "d8bc0ddac4713bfd423cca828f5c3513",
  },
  {
    uid: "770fec8b9998ea12c59971a750d80516",
    // 2021-07-10 00:00:00
    expire: 1625846400000,
  },
];

export function findItemById(id: string) {
  id = getMD5(id);
  const t = ids.find((it) => it.uid === id);
  if (!t) return null;
  if (t.expire && t.expire < Date.now()) return null;
  return t;
}
