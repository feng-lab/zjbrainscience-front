import request from "@/utils/request";

/**
 * 解析EEG文件
 * @param {Number} file_id          - 文件ID
 * @param {Number} window           - 时间窗口大小
 * @param {Number} page_index       - 当前页数，从0开始
 * @param {Array<String>} channels  - 通道列表
 * @returns 
 */
export function eegDisplayApi({ file_id, window, page_index, channels }) {
  return request({
    url: "/api/displayEEG",
    method: "POST",
    data: {
      file_id,
      window,
      page_index,
      channels
    }
  })
}