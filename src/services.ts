import av from "leancloud-storage";
import { getMD5 } from "./configFile";
import { IItem } from "./types";

const query = new av.Query("access_ids");

export async function getUidInfo(uid: string): Promise<IItem | null> {
  uid = getMD5(uid);
  const item = await query.equalTo("hashId", uid).first();
  if (!item) return null;
  const numberExpire = +new Date(item.get("expire"));
  if (numberExpire && numberExpire < Date.now()) return null;
  return {
    uid: item.get("hashId"),
    expire: numberExpire,
  };
}
