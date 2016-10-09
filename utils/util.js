function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function randomId(len) {
  len = len || 32;
　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　var maxPos = $chars.length;
　var pwd = '';
　for (i = 0; i < len; i++) {
　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　}
　return pwd;
}

function dateFormat(d, format) {
  Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  return d.Format(format)
}

function timeInterval(t) {
  var r = ''
  var now = new Date().getTime()
  if(t >= now) {
    r = '刚刚'
  } else {
    var interval = now - t
    if(interval <= 3600000) {
      r = Math.floor(interval/60000) + '分钟前'
    } else if(interval <= 86400000) {
      r = Math.floor(interval/3600000) + '小时前'
    } else {
      var d = new Date()
      d.setTime(t)
      r = dateFormat(d, 'dd/MM')
    }
  }
  console.log(t + ' with ' + now + ' interval ' + interval + ' should show ' + r)
  return r
}

function writeObj(obj){ 
 var description = ""; 
 for(var i in obj){ 
  var property = obj[i];
  if (typeof property == 'object') {
    description += i + " = " + writeObj(property) + "\n"
  }else{
    description += i+" = "+property+"\n" 
  }
 } 
 return description; 
} 

module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  randomId: randomId,
  writeObj: writeObj,
  timeInterval: timeInterval,
  dateFormat: dateFormat
}
