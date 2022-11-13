export default {
  colon: ":",
  label: {
    account: "Account",
    password: "Password",
    remember: "Remember Me",
    startTime: "Start Time",
    endTime: "End Time",
    channel: "Channel:",
    window: "Window:",
    yes: "Yes",
    no: "No",
    female: "Female",
    male: "Male",
    other: "Other",
    saveImg: "Save as Image",
    chartZoom: "Zoom in on Area Data",
    chartZoomBack: "Reset zoom",
    notice: "New Notification",
    selected: "Selected",
    targetFile: "Target Data Files"
  },
  confirm: {
    resetform: "Are you sure to reset the form? All fields will be cleared!",
    delFile: "Are you sure to delete the file {file} ?"
  },
  msgTitle: "Task - {id}",
  msg: "{name}'s status has changed to {status}. Click for details!",
  placeholder: {
    input: "{info}",
    search: "Search {content}",
    select: "Select {content}"
  },
  sessionExpire: "Your session has expired, please log in again!",
  valid: {
    require: "{field} is required",
    newParadigm: "The image or the description is needed!"
  },
  button: {
    login: "Login",
    reset: "Reset",
    submit: "Submit",
    logout: "Logout",
    sortByTime: "Sort By Time",
    sortByType: "Sort By Type",
    newEx: "New Experiment",
    detail: "Detail",
    newTask: "New Task",
    back: "Back",
    newParadigm: "New Paradigm",
    all: "ALL",
    view: "View",
    newSubject: "New Subject",
    newDevice: "New Device",
    download: "Download",
    upload: "Upload",
    online: "Online Choose",
    search: "Go Search",
    select: "Click To Select",
    newFilter: "New Filter Step",
    newAnalysis: "New Analysis Step",
    more: "More",
    read: "Mark all as Read",
    delete: "Delete",
    edit: "Edit",
    new: "New",
    ok: "OK",
    cancel: "Cancel",
    checkall: "Check all",
    load: "Load"
  },
  menus: {
    management: "Home",
    experiments: "Experiments",
    task: "TaskList",
    search: "SignalSearch"
  },
  loginInfoStorage: {
    title: "Data Storage",
    desc: "Large-capacity cloud storage, view your research data anytime, anywhere"
  },
  loginInfoManage: {
    title: "Data Management",
    desc: "One-stop management of your research data and projects, easy to carry out scientific research activities"
  },
  loginInfoAnalysis: {
    title: "Data Analysis",
    desc: "Fast and convenient EEG data analysis and display interface, explaining the meaning of the data in seconds"
  },
  home: {
    charts: {
      dataType: "Type Of Experiments Data",
      subject: "Subject Feature",
      server: "Usage Of Server",
      sick: "Kind Of Disease",
      dataGrowth: "Growth Trend Of Experiments Data" 
    }
  },
  experiments: {
    searchField: {
      name: "Experiment Name"
    },
    detail: {
      exId: "ID",
      exType: "Type",
      subjectType: "Subject Type",
      subjectCnt: "Subject Count",
      exLocal: "Location",
      exDesc: "Description",
      exName: "Name:",
      noninvasive: "Non-invasive:",
      date: "Date:",
      isopen: "Public:",
    },
    tab: {
      paradigm: "Paradigm",
      device: "Device",
    },
    deleteConfirm: "Are you sure to delete {target}-{id} from the experiment?"
  },
  paradigm: {
    text: "Paradigm",
    deleteConfirm: "Are you sure to delete this paradigm?",
    formlabel: {
      image: "Images",
      description: "Description"
    }
  },
  term: {
    file: "Files",
    subject: "Subjects",
    experiment: "Experiments",
    task: "Tasks",
    operation: "Operations",
    systemremind: "Syetem Remind",
  },
  subject: {
    text: "Human Subject",
    id: "ID",
    gender: "Gender",
    type: "Type",
    birthdate: "BirthDate",
    blood: "ABO Blood",
    birth: "Date Of Birth",
    death: "Date Of Death",
    education: "Education",
    occupation: "Occupation",
    phone: "Phone",
    email: "Email",
    marriage: "Married",
    lefthand: "Left-Handed",
    address: "Address",
    category: {
      human: "Human",
      macaque: "Macaque",
      dog: "Puppy",
      pig: "Swine"
    },
  },
  device: {
    text: "Equipment",
    id: "ID",
    name: "Name",
    type: "Type",
    purpose: "Purpose",
    index: "Index"
  },
  task: {
    deleteConfirm: "Are you sure to delete task: {name}(ID:{id})",
    searchField: {
      name: "Task Name"
    },
    selectField: {
      time: "Task Start Time",
      status: "Task Status",
      type: "Task Type"
    },
    status: {
      "0": "Abort",
      "1": "Processing",
      "2": "Completed"
    },
    detail: {
      id: "Task ID",
      name: "Task Name",
      type: "Task Type",
      dataset: "Target Data",
      dataSize: "DataSet Size",
      desc: "Description"
    },
    card : {
      step: "Steps",
      result: "Result"
    },
    step: {
      filter: "Filter",
      analysis: "Analysis",
      fa: "Filter/Analysis"
    },
    type: {
      filter: "Filter",
      analysis: "Analysis",
      fa: "Filter/Analysis"
    },
    delTip: "Delete the current step"
  },
  search: {
    card: {
      signal: "Search Signal",
      result: "Result"
    }
  },
  netErrMsg: {
    "404": "Not Found",
    "502": "The server has something wrong",
    default: "Network Error"
  },
  datepicker: {
    week: "Last Week",
    month: "Last Month",
    halfofyear: "Last 6 Months",
    year: "Last Year"
  },
  status: {
    success: "Success!",
    fail: "Fail!"
  },
  file: {
    name: "File Name",
    type: "File Type",
    experiment: "Association Experiment"
  }
}