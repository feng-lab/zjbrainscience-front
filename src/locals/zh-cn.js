export default {
  colon: "：",
  label: {
    username: "用户名",
    password: "密码",
    remember: "记住我",
    startTime: "开始时间",
    endTime: "结束时间",
    channel: "通道选择",
    window: "时间窗口",
    yes: "是",
    no: "否",
    female: "女",
    male: "男",
    other: "其他",
    saveImg: "保存为图片",
    chartZoom: "区域数据放大",
    chartZoomBack: "还原",
    notice: "新通知",
    selected: "已选择",
    targetFile: "目标数据文件",
    nofile: "没有待搜索的文件，请先选择一个在线EEG文件或者上传本地文件！",
    currentPage: "当前页",
    operation: "操作",
    needLogin: "请您先登录！",
    clickToDetail: "点击查看详情！",
    loading: "加载中...",
    changeAccessLevel: "如果需要修改权限，请联系管理员！"
  },
  confirm: {
    resetform: "确定要重置表单吗？所有字段数据将会被清除！",
    delFile: "确定删除文件 {file} 吗?"
  },
  placeholder: {
    input: "{info}",
    search: "搜索{content}",
    select: "请选择{content}",
    userSearch: "请输入员工号搜索用户",
  },
  sessionExpire: "您的会话session已过期，请重新登录！",
  valid: {
    require: "请{action}{field}",
    checked: "请至少选择一个",
    newParadigm: "请至少上传一张实验相关图片或填写一条文字记录！",
    taskstep: "请至少添加一个任务执行流程",
  },
  action: {
    input: "填写",
    select: "选择"
  },
  button: {
    login: "登录",
    reset: "重置",
    submit: "提交",
    logout: "登出",
    sortByTime: "按时间排序",
    sortByType: "按类型排序",
    newEx: "新建实验",
    detail: "详情",
    newTask: "新建任务",
    back: "返回",
    newParadigm: "新增范式",
    all: "全部",
    view: "查看",
    newSubject: "新增被试",
    newDevice: "新增设备",
    download: "下载",
    upload: "上传文件",
    online: "在线文件",
    search: "开始检索",
    select: "点击选择",
    newFilter: "新增滤波步骤",
    newAnalysis: "新增分析步骤",
    more: "更多",
    delete: "删除",
    edit: "编辑",
    new: "新增",
    ok: "确定",
    cancel: "取消",
    checkall: "全选",
    load: "加载",
    prev: "前一页",
    next: "后一页",
    bulkUpload: "批量上传",
    channel: "选择通道",
    expand: "展开",
    collapse: "收起",
    clear: "清除",
    backHome: "返回首页",
    newUser: "新增用户",
    modify: "修改",
    loadMore: "加载更多",
    newAssistants: "新增助手",
    batchDelete: "批量删除",
    filter: "筛选",
    changePassword: "点击修改密码！"
  },
  elmessage: {
    uploadSuccess: "上传成功！",
    uploadFail: "上传失败！",
    deleteSuccess: "删除成功！",
    deleteFail: "删除失败！",
    submitSuccess: "提交成功！",
    submitFail: "提交失败！",
    handleSuccess: "操作成功！",
    handleFail: "操作失败！",
    updateSuccess: "更新成功！",
    updateFail: "更新失败！",
    newSuccess: "新增成功！",
    newFailed: "新增失败！",
    updatePasswordSuccess: "更新密码成功！请使用新密码重新登陆",
    updatePassword: "欢迎您首次登陆！当前密码为初始密码, 可先修改密码！",
    getUserInfoFail: "获取当前用户信息失败！"
    
  },
  menus: {
    management: "首页",
    experiments: "实验管理",
    task: "任务管理",
    search: "信号检索",
    user: "用户管理",
    password: "密码修改",
    notification: "通知消息",
    newExperiment: "新增实验",
    experimentList: "实验列表"
  },
  loginInfoStorage: {
    title: "数据存储",
    desc: "大容量的云存储，让您随时随地查看您的实验数据"
  },
  loginInfoManage: {
    title: "数据管理",
    desc: "一站式管理您的实验数据和研究项目，轻松开展科研活动"
  },
  loginInfoAnalysis: {
    title: "数据分析",
    desc: "快速便捷的脑电数据分析及可视化视图，帮助您快速了解实验数据的意义"
  },
  home: {
    statistic: {
      ex: "实验",
      file: "文件",
      subject: "被试",
      task: "任务"
    },
    charts: {
      dataType: "实验数据类型分布",
      subject: "被试特征分布",
      server: "计算服务器资源利用率",
      sick: "疾病种类",
      dataGrowth: "实验数据增长趋势图",
    }
  },
  experiments: {
    action: {
      new: "新增实验",
      edit: "编辑实验"
    },
    detail: {
      experiment_id: "实验编号",
      type: "实验类型",
      subject_type: "被试对象",
      subject_num: "被试数量",
      location: "实验地点",
      description: "实验描述",
      name: "实验名称",
      is_non_invasive: "是否无创",
      date: "实验日期",
      is_shared: "是否公开",
      main_operator: "主操作员",
      assistants: "实验助手",
      neuron_source: "细胞来源部位",
      stimulation_type: "刺激类型",
      session_num: "Session数量",
      trail_num: "Trail数量"
    },
    tab: {
      paradigm: "实验范式",
      equipment: "实验设备",
      assistant: "实验助手"
    },
    deleteConfirm: "确定删除实验 （ID： {id}） 吗？"
  },
  paradigm: {
    text: "实验范式",
    deleteConfirm: "确定删除实验范式 （ID： {id}）吗？",
    formlabel: {
      image: "实验图片",
      description: "文字描述"
    },
    creator: "创建人",
    createTime: "创建时间"
  },
  term: {
    file: "文件",
    subject: "被试",
    experiment: "实验",
    task: "任务",
    systemremind: "系统提示",
  },
  subject: {
    text: "人类被试",
    id: "编号",
    gender: "性别",
    type: "类型",
    birthdate: "出生日期",
    blood: "血型",
    birth: "出生日期",
    death: "死亡日期",
    education: "教育水平",
    occupation: "职业",
    phone: "电话",
    email: "邮箱",
    marriage: "是否婚配",
    lefthand: "是否左撇子",
    address: "地址",
    category: {
      human: "人类",
      macaque: "猕猴",
      dog: "犬",
      pig: "猪"
    },
    deleteConfirm: "确定从当前实验移除被试 （ID： {id}） 吗？"
  }, 
  device: {
    text: "设备",
    id: "编号",
    name: "设备名称",
    type: "设备类型",
    purpose: "实验用途",
    index: "序号",
    deleteConfirm: "确定从当前实验移除设备 （ID： {id}） 吗？"
  },
  assistants: {
    deleteConfirm: "确定删除所选实验助手？"
  },
  task: {
    deleteConfirm: "确定删除任务： {name}(ID: {id}) 吗？",
    searchField: {
      name: "任务名称"
    },
    selectField: {
      time: "任务开始时间",
      status: "任务状态",
      type: "任务类型"
    },
    status: {
      "0": "中止",
      "1": "进行中",
      "2": "已完成"
    },
    detail: {
      id: "任务编号",
      name: "任务名称",
      type: "任务类型",
      dataset: "目标数据",
      dataSize: "数据量",
      desc: "任务描述"
    },
    card : {
      step: "任务流程",
      result: "执行结果"
    },
    step: {
      filter: "滤波",
      analysis: "数据分析",
      fa: "滤波/数据分析"
    },
    type: {
      filter: "预处理",
      analysis: "数据分析",
      fa: "预处理/数据分析"
    },
    delTip: "删除当前步骤",
    stepResult: {
      "0": {
        title: "执行失败",
        subTitle: "当前任务执行失败!"
      },
      "1" : {
        title: "正在执行",
        subTitle: "当前任务正在执行，请稍等！"
      }
    },
  },
  search: {
    card: {
      signal: "待检索信号",
      result: "检索结果"
    },
  },
  datepicker: {
    week: "最近一周",
    month: "最近一个月",
    halfofyear: "最近六个月",
    year: "最近一年"
  },
  status: {
    success: "成功！",
    fail: "失败！"
  },
  file: {
    name: "文件名称",
    type: "文件类型",
    list: "文件列表",
    eeg: "EEG文件",
    video: "视频文件",
    experiment: "关联实验",
    deleteConfirm: "确定删除文件 {name}吗？"
  },
  httpErrorMsg: {
    expire: "会话已过期，请重新登录",
    paramsErr: "请求参数错误",
    relogin: "当前操作需要登录",
    "404": "该接口不存在",
    "502": "服务端异常",
    default: "网络异常"
  },
  user: {
    text: "用户",
    id: "用户ID",
    username: "用户名",
    staff_id: "员工号",
    accessLevel: "用户等级",
    lastLogin: "上次登录",
    deleteConfirm: "确定要删除用户 {user} 吗？",
    updateRole: "修改用户等级",
    currentAl: "当前用户等级",
    currentUser: "修改用户"
  },
  errorPage: {
    notFound: "抱歉，您当前访问的页面不存在！",
    noAuth: "抱歉，您没有当前页面的访问权限！"
  },
  auth: {
    "0": "访客",
    "10": "被试",
    "100": "研究员",
    "1000": "管理员"
  },
  password: {
    current: "当前密码",
    new: "新密码",
    confirm: "确认新密码",
    valid: {
      currentRequire: "请输入当前密码",
      newRequire: "请输入新密码",
      confirmRequire: "请再次输入新密码",
      confirmWrong: "两次新密码输入不一致"
    }
  },
  notify: {
    type: {
      text: "互动消息",
      task_step_status: "任务状态通知"
    }, 
    content: {
      task_step_status: "任务 {name}(ID: {id}) 的状态已更新为 {status}。",
    },
    list: {
      type: "通知类型",
      content: "通知内容",
      status: "已读/未读",
      gmt_create: "通知时间",
      creator_name: "发送者"
    },
    status: {
      read: "已读",
      unread: "未读"
    },
    action: {
      mark: "标记已读",
      batchMark: "批量标记已读",
      allMark: "全标已读"
    }
  }
}