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

export const graphLinks = [
  {
    source: '-1000,0',
    target: '-1000,100',
  },
  {
    source: '-1000,100',
    target: '-1000,200',
  },
  {
    source: '-1000,200',
    target: '-1000,300',
  },
  {
    source: '-1000,300',
    target: '-1000,400',
  },
  {
    source: '-1000,400',
    target: '-1000,500',
  },
  {
    source: '-1000,500',
    target: '-1000,600',
  },
  {
    source: '-1000,600',
    target: '-1000,700',
  },
  {
    source: '-1000,700',
    target: '-1000,800',
  },
  {
    source: '-1000,800',
    target: '-1000,900',
  },
  {
    source: '-1000,900',
    target: '-1000,1000',
  },
  {
    source: '-1000,1000',
    target: '-1000,1100',
  },
  {
    source: '-1000,1100',
    target: '-1000,1200',
  },
  {
    source: '-1000,1200',
    target: '-1000,1300',
  },
  {
    source: '-1000,1300',
    target: '-1000,1400',
  },
  {
    source: '-1000,1400',
    target: '-900,1400',
  },
  {
    source: '-900,1400',
    target: '-800,1400',
  },
  {
    source: '-800,1400',
    target: '-700,1400',
  },
  {
    source: '-700,1400',
    target: '-600,1400',
  },
  {
    source: '-600,1400',
    target: '-500,1400',
  },
  {
    source: '-500,1400',
    target: '-400,1400',
  },
  {
    source: '-400,1400',
    target: '-300,1400',
  },
  {
    source: '-300,1400',
    target: '-200,1400',
  },
  {
    source: '-200,1400',
    target: '-100,1400',
  },
  {
    source: '-100,1400',
    target: '0,1400',
  },
  {
    source: '0,1400',
    target: '100,1400',
  },
  {
    source: '100,1400',
    target: '200,1400',
  },
  {
    source: '200,1400',
    target: '300,1400',
  },
  {
    source: '300,1400',
    target: '400,1400',
  },
  {
    source: '400,1400',
    target: '500,1400',
  },
  {
    source: '500,1400',
    target: '600,1400',
  },
  {
    source: '600,1400',
    target: '700,1400',
  },
  {
    source: '700,1400',
    target: '800,1400',
  },
  {
    source: '800,1400',
    target: '900,1400',
  },
  {
    source: '900,1400',
    target: '1000,1400',
  },
]

export const graphData = [
  {
    name: '-1000,0',
    value: [-1000, 0],
  },
  {
    name: '-1000,100',
    value: [-1000, 100],
  },
  {
    name: '-1000,200',
    value: [-1000, 200],
  },
  {
    name: '-1000,300',
    value: [-1000, 300],
  },
  {
    name: '-1000,400',
    value: [-1000, 400],
  },
  {
    name: '-1000,500',
    value: [-1000, 500],
  },
  {
    name: '-1000,600',
    value: [-1000, 600],
  },
  {
    name: '-1000,700',
    value: [-1000, 700],
  },
  {
    name: '-1000,800',
    value: [-1000, 800],
  },
  {
    name: '-1000,900',
    value: [-1000, 900],
  },
  {
    name: '-1000,1000',
    value: [-1000, 1000],
  },
  {
    name: '-1000,1100',
    value: [-1000, 1100],
  },
  {
    name: '-1000,1200',
    value: [-1000, 1200],
  },
  {
    name: '-1000,1300',
    value: [-1000, 1300],
  },
  {
    name: '-1000,1400',
    value: [-1000, 1400],
  },
  {
    name: '-900,1400',
    value: [-900, 1400],
  },
  {
    name: '-800,1400',
    value: [-800, 1400],
  },
  {
    name: '-700,1400',
    value: [-700, 1400],
  },
  {
    name: '-600,1400',
    value: [-600, 1400],
  },
  {
    name: '-500,1400',
    value: [-500, 1400],
  },
  {
    name: '-400,1400',
    value: [-400, 1400],
  },
  {
    name: '-300,1400',
    value: [-300, 1400],
  },
  {
    name: '-200,1400',
    value: [-200, 1400],
  },
  {
    name: '-100,1400',
    value: [-100, 1400],
  },
  {
    name: '0,1400',
    value: [0, 1400],
  },
  {
    name: '100,1400',
    value: [100, 1400],
  },
  {
    name: '200,1400',
    value: [200, 1400],
  },
  {
    name: '300,1400',
    value: [300, 1400],
  },
  {
    name: '400,1400',
    value: [400, 1400],
  },
  {
    name: '500,1400',
    value: [500, 1400],
  },
  {
    name: '600,1400',
    value: [600, 1400],
  },
  {
    name: '700,1400',
    value: [700, 1400],
  },
  {
    name: '800,1400',
    value: [800, 1400],
  },
  {
    name: '900,1400',
    value: [900, 1400],
  },
  {
    name: '1000,1400',
    value: [1000, 1400],
    label: {
      show: true,
    },
  },
]
