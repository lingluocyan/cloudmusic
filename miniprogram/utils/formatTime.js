module.exports = (date) => {
  let fmt = 'yyyy-MM-dd hh:mm:ss'
  const o = {
    'M+':date.getMonth() + 1, // 获取月份，注意只能获取0-11 因此加1对应正确月份
    'd+':date.getDate(), // 日
    'h+':date.getHours(), // 小时
    'm+':date.getMinutes(), // 分钟
    's+':date.getSeconds() // 秒
  }
  // 正则匹配，如果匹配到年份就替换 yyyy为年份
  // $1代表匹配到的第一项
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1,date.getFullYear())
  }

  for(let k in o) {
    // 循环o对象，如果匹配到了规则，例如M+
    if (new RegExp('('+k+')').test(fmt)) {
      // 匹配到则替换，并判断例如 date.getDate()的长度是否为1
      // fmt = fmt.replace(RegExp.$1,o[k].toString().length == 1 ? '0' + o[k] : o[k])
      fmt = fmt.replace(RegExp.$1,o[k].toString().length == 1 ? '0' + o[k] : o[k])
    }
  }
  // console.log(fmt)
  return fmt
}