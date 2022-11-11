import request from "@/utils/request";

export function eegDisplayApi({ p1, t, i, c }) {
  return request({
    url: "/api/data/displayEEG",
    method: "POST",
    data: {
      p1,
      t,
      i,
      c
    }
  })
}