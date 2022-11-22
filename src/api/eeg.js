import request from "@/utils/request";

/**
 * 
 * @param {String} p1       - 文件名称
 * @param {String} c        - 文件类型
 * @param {Number} t        - 时间窗口大小
 * @param {Number} i        - 当前页数
 * @param {String} channel  - 通道
 * @returns 
 */
export function eegDisplayApi({ p1, t, i, c, channel }) {
  return request({
    url: "/api/data/displayEEG",
    method: "POST",
    data: {
      p1,
      t,
      i,
      c,
      channel
    }
  })
}