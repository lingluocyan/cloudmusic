// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false
  },
  // 发布功能，打开发布弹层
  onPublish() {
    // 判断用户是否授权
    wx.getSetting({
      success: (res) => {
        // 说明授权了
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              // 说明用户授权并且获取到了用户信息
              // console.log(res, '获取用户信息')
              this.onLoginSuccess(res.userInfo)
            }
          })
        }
        //用户未授权
        else {
          this.setData({
            showModal: true
          })
        }
      } 
    })
  },
  // 登录弹窗返回的成功事件
  onLoginSuccess(userInfo) {
    let detail = {}
    if (userInfo.type) {
      detail = userInfo.detail
    } else {
      detail = userInfo
    }
    // 如果登录成功就跳转到发布页面
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  },
  // 关闭发布弹层
  changeModal() {
    this.setData({
      showModal: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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