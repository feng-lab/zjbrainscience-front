import { defineStore } from "pinia";
import { ref } from "vue";
import moment from "moment";

const useTask = defineStore("task", () => {
  const taskList = ref([]);
  const taskStepList = ref([]);
  const newTask = ref();
  const operationid = ref(0);

  const addTask = (task) => {
    return new Promise((resolve, reject) => {
      const starttime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      task.tasktype = Array.from(task.tasktype);
      if(task.tasktype.length === 2) {
        task.tasktype = "Filter/Analysis";
      } else {
        task.tasktype = task.tasktype[0];
      }
      const tempTask = {
        taskid: taskList.value.length + 1,
        starttime,
        status: 1,
        ...task
      }
      taskList.value.push(tempTask);
      newTask.value = tempTask;
      const tempTaskSteps = {
        master: { 
          ...tempTask,
          filename: tempTask.checkedfile.map( f => `${f.filename}.${f.filetype}`),
        },
        stepList: []
      }
      console.log('task', task)
      for(let step of task.taskSteps) {
        const { type, ...parameters } = step;
        const temp = {};
        temp.operationid = operationid.value++;
        temp.parameters =  parameters;
        if(type === "filter") {
          temp.status = 1;
          temp.operationtype = "Filter";
        } else {
          temp.status = 2;
          temp.operationtype = "Analysis";
        }
        temp.taskid = task.taskid;
        tempTaskSteps.stepList.push(temp);
      }
      taskStepList.value.push(tempTaskSteps);
      resolve(true);
    })
  }

  const deleteTask = (taskid) => {
    const index = Number(taskid) - 1;
    console.log('index', index);
    taskList.value[index].status = -1;
  }
  return {
    taskList,
    taskStepList,
    newTask,
    addTask, 
    deleteTask
  }
})

export default useTask;