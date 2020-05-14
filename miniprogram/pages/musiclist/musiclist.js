// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playlistId: '',
    musiclist: [],
    listInfo: {}
  },
  _getMusicList() {
    wx.cloud.callFunction({
      name: 'music',
      data: {
        playlistId: this.data.playlistId,
        $url: 'musiclist'
      }
    }).then(res => {
      const pl = res.result.playlist
      this.setData({
        musiclist: pl.tracks,
        listInfo: {
          coverImgUrl: pl.coverImgUrl,
          name: pl.name
        }
      })
      this._setMusicList()
      wx.hideLoading()
      console.log(res, '输出结果')
    }).catch(err => {
      wx.hideLoading()
      console.log(err, '错误输出')
    })
  },
  _setMusicList() {
    // 同步的把歌曲列表数据存入本地
    wx.setStorageSync('musiclist', this.data.musiclist)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '玩命加载中~',
    })
    this.setData({
      playlistId: options.playlistId
    })
    this._getMusicList()
    console.log(options.playlistId, '输出参数')
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