// pages/blog-edit/blog-edit.js
// 最大输入长度
// const MAX_WORDS_NUM = 140 
const MAX_IMAGE_NUM = 9
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
    images.splice(event.currentTarget.dataset.index,1)
    this.setData({
      images: images,
      selectphoto:this.data.images.length >= 9 ? true : false,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, 'blog-edit接受数据')
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