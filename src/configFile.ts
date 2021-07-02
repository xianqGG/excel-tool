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
