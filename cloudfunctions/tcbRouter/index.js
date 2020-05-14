// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // 传入event参数，这样tab就会自动处理参数的转发
  const app = new TcbRouter({ event })

  app.use(async (ctx, next) => {
    ctx.data = {}
    ctx.data.openId = event.userInfo.openId
    ctx.data.event = event
    await next()
  })

  app.router('music', async (ctx, next) => {
    ctx.data.musicName = '义勇军进行曲'
    await next()
  }, async (ctx, next) => {
    ctx.data.musicType = '国歌'
    ctx.body = {
      data: ctx.data
    }
  })

  app.router('movie', async (ctx, next) => {
    ctx.data.movieName = "千与千寻"
    await next()
  }, async (ctx, next) => {
    ctx.data.movieType = "日漫"
    ctx.body = {
      data: ctx.data
    }
  })

  return app.serve()
}