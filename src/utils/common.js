import i18n from "@/locals";

/**  Function  */

export function getImgUrl(url) {
  return new URL(`../assets/img/${url}`, import.meta.url).href;
}

export function getPreviewUrl(id) {
  return `/api/downloadFile/${id}`;
}

export function objectToOptions(obj) {
  return Object.entries(obj).map(([value, label]) => ({
    value,
    label
  }))
}

/** CONSTANTS */
export const CHANNELS = ["Pz","PO5","PO3",  "POz","PO4" , "PO6", "O1" ,"Oz" ,"O2"];

export const ACCESS_LEVEL = [0, 10, 100, 1000];

export const ABO_BLOOD_TYPE = ["A", "B", "O", "AB"];

export const STEP_INFO = {
  "0": {status: "error", color: "var(--el-color-danger)", icon: "CircleClose"},
  "1": {status: "success", color: "var(--el-color-primary)", icon: "CircleCheck"},
  "2": {status: "process", color: "var(--el-color-blue)", icon: "Loading"}
}

export const EXPERIMENT_TYPE = {
  "SSVEP": "SSVEP",
  "MI": "MI",
  "neuron": "Neuron Spike"
}

export const SUBJECT_TYPE = [ "human", "macaque", "dog", "pig", "other" ];
