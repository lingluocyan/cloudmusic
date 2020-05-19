// pages/profile-playhistory/profile-playhistory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicHistoryList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getPlayHistory()
  },
  _getPlayHistory() {
    let openId = getApp().globalData.openid
    let historyList = wx.getStorageSync(openId)
    if (historyList.length == 0) {
      wx.showModal({
        title: '播放记录为空哦~',
      })
      return
    }
    this.setData({
      musicHistoryList: historyList
    })
    // 把本地歌单替换为历史记录，以便在历史记录里可以播放下一首
    wx.setStorage({
      key: 'musiclist',
      data: historyList,
    })
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