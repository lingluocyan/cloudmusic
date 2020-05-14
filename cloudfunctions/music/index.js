// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const TcbRouter = require('tcb-router')
const rp = require("request-promise")
const BASE_URL = 'http://musicapi.xiecheng.live'

// 云函数入口函数
exports.main = async(event, context) => {
  const app = new TcbRouter({
    event
  })
  // 全局中间件
  app.use(async(ctx, next) => {
    await next()
  })
  // 获取音乐数据
  app.router('music', async(ctx, next) => {
    ctx.body = await cloud.database().collection('playlist').skip(event.start).limit(event.count).orderBy('createTime', 'desc').get().then(res => {
      return res
    })
    await next()
  })
  // 根据id获取音乐详情信息
  app.router('musiclist', async(ctx, next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId)).then(res => {
      return JSON.parse(res)
    })
    await next()
  })

  // 获取音乐数据
  // return await cloud.database().collection('playlist').skip(event.start).limit(event.count).orderBy('createTime', 'desc').get().then(res => {
  //   return res
  // })
  return app.serve()
}