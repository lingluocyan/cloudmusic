// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await cloud.openapi.wxacode.getUnlimited({
    // scene:可见字符长度
    scene: wxContext.OPENID,
    // 修改小程序码周围发散图标夯实
    // lineColor: {
    //   'r':211,
    //   'g':60,
    //   'b':57
    // },
    // 是否需要透明底色
    // isHyaline: true
  })
  // 返回的结果包含一个buffer ,也就是小程序码的二进制格式
  console.log(result, 'result')
  // 把图片上传到云端并返回一个fileId
  const upload = await cloud.uploadFile({
    cloudPath: 'qrcode/' + Date.now() + '-' + Math.random() + '.png',
    // result.buffer表示二进制图片
    fileContent: result.buffer
  })
  console.log(upload,'upload')
  return upload.fileID
}