import request from "@/utils/request"

export function statisticApi() {
  return request({
    url: "/api/getStatistic",
    method: "GET"
  })
}

export function dataTypeApi() {
  return request({
    url: "/api/getStatisticWithDataType",
    method: "GET"
  })
}

export function subjectApi() {
  return request({
    url: "/api/getStatisticWithSubject",
    method: "GET"
  })
}

export function serverIdleApi() {
  return request({
    url: "/api/getStatisticWithServer",
    method: "GET"
  })
}

export function sickInfoApi() {
  return request({
    url: "/api/getStatisticWithSick",
    method: "GET"
  })
}

export function dataGrowthApi(start, end) {
  return request({
    url: "/api/getStatisticWithData",
    method: "GET",
    params: {
      start,
      end
    }
  })
}