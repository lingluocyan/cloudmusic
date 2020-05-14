// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const rp = require("request-promise")

const URL = 'http://musicapi.xiecheng.live/personalized'

const getDb = db.collection("playlist")


const MAX_LIMIT = 10
// 云函数入口函数
exports.main = async(event, context) => {
  // 获取数据库中的已有数据
  let countResult = await getDb.count()
  // 拿到数据总数
  let total = countResult.total
  console.log(total,'total')
  // 获取的次数
  let batchTimes = Math.ceil(total/10)
  let tasks = []
  for (let i=0;i<batchTimes;i++) {
    // 这里不加await因为promise.all需要 promise对象
    let promise = getDb.skip(i*MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  console.log(tasks, '输出tasks')
  // 说明数据库不为空
  if (tasks.length > 0) {
    // await获取Promise.all的结果
    list = (await Promise.all(tasks)).reduce((acc,cur)=> {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }
  console.log(list,'输出list')
  // let list = await getDb.get()
  // 定义一个数组用于插入数据
  let newArr = []
  // 接口获取的新数据
  let playlist = await rp(URL).then(res => {
    return JSON.parse(res).result
  })
  for (let i = 0; i < playlist.length; i++) {
    let flag = true
    for (let j = 0; j < list.data.length; j++) {
      if (playlist[i].id === list.data[i].id) {
        flag = false
      }
    }
    if (flag) {
      newArr.push(playlist[i])
    }
  }

  for (let i = 0; i < newArr.length; i++) {
    await getDb.add({
      data: {
        ...newArr[i],
        createTime: db.serverDate()
      }
    }).then(res => {
      console.log('插入成功')
    }).catch(err => {
      console.log(err, 'err')
    })
  }


  return
}