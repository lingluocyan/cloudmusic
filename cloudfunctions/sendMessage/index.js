// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  // 获取用户openId
  const {
    OPENID
  } = cloud.getWXContext()
  console.log(OPENID, 'OPENID')
  console.log(event, 'event')
  // 跳转到评论页面，并携带blogId

  // subscribeMessage.send
  const result = await cloud.openapi.subscribeMessage.send({
    touser: OPENID,
    lang: 'zh_CN',
    page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
    data: {
      date4: {
        value: '2020-1-1 14:00'
      },
      thing3: {
        value: '评价完成'
      }
    },
    templateId: 'nKqNdwy50PHoBP1sBSH4w2nnfsSbMVtRXizdC_mXrKA',
    miniprogramState: 'developer'
    // formId: event.formId
  })
  return result
}