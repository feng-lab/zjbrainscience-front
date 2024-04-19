import i18n from "@/locals";
import axios from "axios";

/**  Function  */

export function getImgUrl (url) {
  return new URL(`../assets/img/${url}`, import.meta.url).href;
}

export function getPreviewUrl (id) {
  return `/api/downloadFile/${id}`;
}

export function objectToOptions (obj) {
  return Object.entries(obj).map(([value, label]) => ({
    value,
    label
  }))
}

export function getFileData (file_id) {
  let file_url = getPreviewUrl(file_id);
  console.log('file_url', file_url)
  return new Promise((resolve, reject) => {
    axios({ withCredentials: true, url: file_url, })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      })
  });
}

/** CONSTANTS */
export const CHANNELS = ["Pz", "PO5", "PO3", "POz", "PO4", "PO6", "O1", "Oz", "O2"];

export const ACCESS_LEVEL = [0, 10, 100, 1000];

export const ABO_BLOOD_TYPE = ["A", "B", "O", "AB"];

export const STEP_INFO = {
  "0": { status: "error", color: "var(--el-color-danger)", icon: "CircleClose" },
  "1": { status: "success", color: "var(--el-color-primary)", icon: "CircleCheck" },
  "2": { status: "process", color: "var(--el-color-blue)", icon: "Loading" }
}

export const EXPERIMENT_TYPE = {
  "SSVEP": "SSVEP",
  "MI": "MI",
  "neuron": "Neuron Spike",
  "other": "Other"
}

export const SUBJECT_TYPE = ["human", "macaque", "dog", "pig", "other"];

let graphData = []
let graphLinks = []
for (let i = 0; i <= 14; i++) {
  let item = i * 100
  graphData.push({ name: '-1000,' + item, value: [-1000, item] })
  graphData.push({ name: '1000,' + item, value: [1000, item] })
  graphLinks.push({ source: '-1000,' + item, target: '1000,' + item })
}
for (let i = 0; i <= 20; i++) {
  let item = (i - 10) * 100
  graphData.push({ name: item + ',1400', value: [item, 1400] })
  graphData.push({ name: item + ',0', value: [item, 0] })
  graphLinks.push({ source: item + ',0', target: item + ',1400' })
}
graphData = [...new Set(graphData.map(one => JSON.stringify(one)))].map(one => JSON.parse(one))

export { graphData, graphLinks }
