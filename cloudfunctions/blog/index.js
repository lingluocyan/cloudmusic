// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')


cloud.init()

const blogCollection = cloud.database().collection('blog')
// 云函数入口函数
exports.main = async(event, context) => {
  const app = new TcbRouter({
    event
  })
  // 获取blog数据库数据的云函数
  app.router('list', async(ctx, next) => {
    // 获取数据库数据,并按时间倒叙排列
    console.log(event, 'event')
    ctx.body = await blogCollection.skip(event.start).limit(event.count).orderBy('createTime', 'desc').get().then(res => {
      return res.data
    })
  })
  return app.serve()
}