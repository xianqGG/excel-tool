import md5 from "crypto-js/md5";
import encHex from "crypto-js/enc-hex";

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
