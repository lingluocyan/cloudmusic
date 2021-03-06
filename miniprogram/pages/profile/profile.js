// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 点击生成小程序码
  onTapQrCode() {
    wx.showLoading({
      title: '生成中~',
    })
    wx.cloud.callFunction({
      name: 'getQrCode'
    }).then(res => {
      console.log(res, '云结果')
      wx.previewImage({
        urls: [res.result],
        current: res.result
      })
      wx.hideLoading()
    })
  },
  getOpenid() {
    wx.cloud.callFunction({
      name:'login'
    }).then(res=> {
      console.log(res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOpenid()
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