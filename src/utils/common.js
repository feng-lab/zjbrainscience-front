export function getImgUrl(url) {
  return new URL(`../assets/img/${url}`, import.meta.url).href;
}

export function getPreviewUrl(id) {
  return `/api/downloadFile/${id}`;
}

export const CHANNELS = ["Pz","PO5","PO3",  "POz","PO4" , "PO6", "O1" ,"Oz" ,"O2"];

export const ACCESS_LEVEL = [0, 10, 100, 1000];

export const STEP_INFO = {
  "0": {status: "error", color: "var(--el-color-danger)", icon: "CircleClose"},
  "1": {status: "success", color: "var(--el-color-primary)", icon: "CircleCheck"},
  "2": {status: "process", color: "var(--el-color-blue)", icon: "Loading"}
}
