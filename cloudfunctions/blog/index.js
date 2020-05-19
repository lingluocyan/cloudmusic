// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

const MAX_LIMIT = 100

cloud.init()

const blogCollection = cloud.database().collection('blog')
// 云函数入口函数
exports.main = async(event, context) => {
  const app = new TcbRouter({
    event
  })
  // 获取blog数据库数据的云函数
  app.router('list', async(ctx, next) => {
    let keyWord = event.keyWord
    // 声明一个查询条件对象
    let w = {}
    if (keyWord.trim() !== '') {
      w = {
        // 使用正则匹配关键字 db.RegExp是数据库的方法
        // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.RegExp.html
        content: cloud.database().RegExp({
          regexp: keyWord,
          // 大小写不敏感
          options: 'i'
        })
      }
      console.log(w, '输出w')
    }
    // 获取数据库数据,并按时间倒叙排列
    console.log(event, 'event')
    ctx.body = await blogCollection.where(w).skip(event.start).limit(event.count).orderBy('createTime', 'desc').get().then(res => {
      return res.data
    })
  })
  // 获取评论并插入数据库的云函数
  app.router("comment", async(ctx, next) => {
    console.log(event, '输入event')
    await cloud.database().collection('blog-comment').add({
      data: {
        openId: event.userInfo.openId,
        avatarUrl: event.avatarUrl,
        blogId: event.blogId,
        createTime: cloud.database().serverDate(),
        content: event.content,
        nickName: event.nickName
      }
    }).then(res => {
      console.log('插入成功!')
    })
    await next()
  })
  // 获取当前blogId对应的评论和图片内容信息
  app.router('detail', async(ctx, next) => {
    let blogId = event.blogId
    // 对应blogId的详情查询
    let detail = await cloud.database().collection('blog').where({
      _id: blogId
    }).get().then(res => {
      return res.data
    })
    // 评论查询
    const countResult = await cloud.database().collection('blog-comment').count()
    const total = countResult.total
    let commentList = {
      data: []
    }
    if (total > 0) {
      // 表示要查询的次数
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      const tasks = []
      for (let i = 0; i < batchTimes; i++) {
        let promise = await cloud.database().collection('blog-comment').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({
          blogId
        }).orderBy('createTime', 'desc').get()
        tasks.push(promise)
      }
      if (tasks.length > 0) {
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
    }

    ctx.body = {
      commentList,
      detail
    }
  })
  return app.serve()
}