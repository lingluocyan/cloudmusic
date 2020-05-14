// pages/playlist/playlist.js
const MAX_LIMIT = 15
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    playlist: [

    ],
    swiperImgUrls: [{
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ]
  },
  _getPlayList() {
    wx.showLoading({
      title: '玩命加载中~',
    })
    // 获取音乐列表,start动态根据数组的长度变化
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url:'music',
        start: this.data.playlist.length,
        count: MAX_LIMIT 
      }
    }).then(res => { 
      this.setData({
        playlist: this.data.playlist.concat(res.result.data) 
      })
      // 请求完成隐藏下拉小点
      wx.stopPullDownRefresh()
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      console.log(err, 'err')
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    wx.cloud.callFunction({
      name: 'login',
    }).then((res) => {
      this.setData({
        openid: res.result.openid
      })
    })
    // 获取音乐列表
    this._getPlayList()
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
    this.setData({
      playlist: []
    })
    this._getPlayList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 请求最新的数据
    this._getPlayList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})