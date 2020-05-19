// pages/blog-edit/blog-edit.js
// 最大输入长度
// const MAX_WORDS_NUM = 140 
const MAX_IMAGE_NUM = 9
// 初始化云数据库
const db = wx.cloud.database()
// 输入的内容
let content = ''
// onload接受的用户信息
let userInfo = {}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 输入的文字个数
    wordsNum: 0,
    maxNum: 140,
    // footer距离底部的巨鹿
    footerBottom: 0,
    // 存放图片的数组
    images: [],
    selectphoto: false, // 是否显示选择图片的元素
    imgUrls: [] // 预览的图片列表
  },
  setWordsLen(event) {
    if (event.detail.value) {
      content = event.detail.value
      let wordsLen = event.detail.value.length
      this.setData({
        wordsNum: wordsLen
      })
    }
  },
  onInput(event) {
    this.setWordsLen(event)
  },
  // 删除图片的回调
  onDelImage(event) {
    let images = this.data.images
    images.splice(event.currentTarget.dataset.index, 1)
    this.setData({
      images: images,
      selectphoto: this.data.images.length >= 9 ? true : false,
    })
  },
  // 预览图片
  previewImg(event) {
    let src = this.data.images[event.currentTarget.dataset.index]
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },
  // 选择图片的函数
  chooseImg() {
    wx.chooseImage({
      count: MAX_IMAGE_NUM - this.data.images.length, //最多可选择几张
      sourceType: ['album', 'camera'], // 图片来源
      sizeType: ['original', 'compressed'], // 所选的图片的尺寸
      success: (res) => {
        // if (res.tempFilePaths.length + this.data.images >= 9) selectphoto
        this.setData({
          selectphoto: res.tempFilePaths.length + this.data.images.length >= 9 ? true : false,
          images: this.data.images.concat(res.tempFilePaths),
        })
      },
    })
  },
  // 文本域获取焦点事件，可获取输入栏的高度,注意只在真机有效
  onFocus(event) {
    this.setData({
      footerBottom: event.detail.height
    })
  },
  // 文本域失去焦点事件
  onBlur() {
    this.setData({
      footerBottom: 0
    })
  },
  // 上传图片至云存储的函数
  send() {
    if (content.trim() === '') {
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return
    }
    wx.showLoading({
      // 蒙版效果
      mask: true,
      title: '正在发布~',
    })
    // 定义一个存放promise的数组
    let promiseArr = []
    // 存放fileId的数组 
    let fileIds = []
    for (let i = 0; i < this.data.images.length; i++) {
      let item = this.data.images[i]
      // 正则匹配拓展名
      let suffix = /[^\.]\w*$/.exec(item)[0]
      let p = new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          // 上传至云端的路径
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() + 1000000 + '.' + suffix,
          filePath: item,
          success: (res) => {
            console.log(res, '成功')
            fileIds = fileIds.concat(res.fileID)
            resolve(res.fileID)
          },
          fail: (err) => {
            console.log(err, '失败')
            reject()
          }
        })
      })
      promiseArr.push(p)
    }
    // 利用promise.all 当执行回调说明所有图片都成功上传
    Promise.all(promiseArr).then(res => {
      console.log(res, 'all')
      db.collection('blog').add({
        data: {
          content,
          img: fileIds,
          createTime: db.serverDate(), // 应该以服务端时间为准
          ...userInfo
        }
      }).then(res => {
        wx.showToast({
          title: '发布成功!',
          duration: 1000,
          success: () => {
            setTimeout(() => {
              let page = getCurrentPages()
              let prevPage = page[page.length - 2]
              prevPage.onPullDownRefresh()
              wx.navigateBack()
            }, 1000)
            console.log(page, 'pae')
          }
        })
        wx.hideLoading()
      }).catch(err => {
        console.log(err)
        wx.hideLoading()
      })
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '发布失败,请稍后再试',
        icon: 'none'
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    userInfo = options
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})