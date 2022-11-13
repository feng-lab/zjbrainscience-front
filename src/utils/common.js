export function getImgUrl(url) {
  return new URL(`../assets/img/${url}`, import.meta.url).href;
}

export const CHANNELS = ["Pz","PO5","PO3",  "POz","PO4" , "PO6", "O1" ,"Oz" ,"O2"];
