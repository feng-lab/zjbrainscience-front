// 整数数值校验
export const numValid = (rule, value, callback) => {
  const reg = /^-?\d+$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的数字'))
  } else {
    callback()
  }
}

// 浮点数值校验
export const floatValid = (rule, value, callback) => {
  const reg = /^[\-+]?\d+(\.\d+)?([eE][\-+]?\d+)?$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的数值'))
  } else {
    callback()
  }
}

// 15或18位身份证校验
export const identityValid = (rule, value, callback) => {
  const reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的身份信息'))
  } else {
    callback()
  }
}

// 10-12位电话或手机号简单校验
export const phoneValid = (rule, value, callback) => {
  const reg = /^\d{10,12}$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的电话或手机号码'))
  } else {
    callback()
  }
}

// 汉字字符校验
export const cnValid = (rule, value, callback) => {
  const reg = /^[\u4e00-\u9fa5],{0,}$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的汉字字符'))
  } else {
    callback()
  }
}

// 26位字母校验
export const enValid = (rule, value, callback) => {
  const reg = /^[A-Za-z]+$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的英文字符'))
  } else {
    callback()
  }
}

