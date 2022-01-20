const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function getDate(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
   
 };

function date(timestamp, s=false){
  var date_time = getDate(timestamp);
  var date_time = date_time.split(" ");
  var date = date_time[0].split("-");
  var time = date_time[1].split(":");
  for(let i=0; i<3; i++) {
    if(date[i].length < 2) {
      date[i] = "0" + date[i]
    }
    if(time[i].length < 2) {
      time[i] = "0" + time[i];
    }
  }
  if(s) {
    return date[0] + "-" + date[1] + "-" + date[2] +" " + time[0] + ":" + time[1] + ":" + time[2];
  }else {
    return date[0] + "-" + date[1] + "-" + date[2] +" " + time[0] + ":" + time[1];
  }
}

module.exports = {
  formatTime,
  date,
  getDate
}
