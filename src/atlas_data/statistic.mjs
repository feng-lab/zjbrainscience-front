import BDF from "./BDf.mjs";

import PCF from "./PCf.mjs";

function statistic(data, parent="") {
  let result = [];
  for(let item of data) {
    let name = `${parent}${item.name}`;
    let tmpObj = {
      name,
      value: 1,
      label: item.name
    };
    if(item?.children?.length) {
      tmpObj.children = statistic(item.children, name + ".");
      tmpObj.value = null
    }
    result.push(tmpObj);
  }
  return result;
}

//console.log(JSON.stringify(statistic(BDF)));
console.log(JSON.stringify(statistic(PCF)));