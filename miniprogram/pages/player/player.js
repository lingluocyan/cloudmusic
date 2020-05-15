// pages/player/player.js
// 当数据不用于展示时最好不定义在data中
let musiclist = []
// 当前正在播放歌曲的index
let nowPlayingIndex = 0
// 获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,
    isLyricShow: false, // 是否显示歌词
    lyric: '暂无歌词', // 歌词信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, '@@')
    nowPlayingIndex = options.index
    // 获取本地存储的数据
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
  },
  // 切换播放与暂停状态
  togglePlaying() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  // 切换显示歌词
  toggleLyric() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  // 上一首
  onPrev() {
    nowPlayingIndex--
    // 说明是第一首
    if (nowPlayingIndex < 0) {
      // 那么跳到最后一首
      nowPlayingIndex = musiclist.length - 1
      this._loadMusicDetail(musiclist[nowPlayingIndex].id)
    } else {
      this._loadMusicDetail(musiclist[nowPlayingIndex].id)
    }
  },
  // 下一首
  onNext() {
    nowPlayingIndex++
    let musicListLen = musiclist.length
    // 因为nowPlayingIndex是从0开始，加1后才会和长度匹配
    if (nowPlayingIndex === musicListLen) {
      nowPlayingIndex = 0
      this._loadMusicDetail(musiclist[nowPlayingIndex].id)
    } else {
      this._loadMusicDetail(musiclist[nowPlayingIndex].id)
    }
  },
  // 加载歌曲的回调
  _loadMusicDetail(musicId) {
    // 加载下一首之前先停止上一首
    backgroundAudioManager.stop()
    wx.showLoading({
      title: '歌曲加载中~',
    })
    let music = musiclist[nowPlayingIndex]
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl
    })

    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musicUrl',
        musicId
      }
    }).then(res => {
      console.log(res, '歌曲信息')
      let result = res.result.data[0]
      // 底部歌曲工具栏展示的信息
      backgroundAudioManager.src = result.url
      backgroundAudioManager.title = music.name
      backgroundAudioManager.coverImgUrl = music.al.picUrl
      backgroundAudioManager.singer = music.ar[0].name
      backgroundAudioManager.epname = music.al.name
      // 设置播放状态为true
      this.setData({
        isPlaying: true
      })
      // 获取当前歌曲的歌词
      wx.cloud.callFunction({
        name: 'music',
        data: {
          $url: 'lyric',
          musicId
        }
      }).then(res => {
        let lyr = JSON.parse(res.result).lrc
        if (lyr.lyric) {
          // 获取歌词并赋值
          this.setData({
            lyric: lyr
          })
        }
      })
      wx.hideLoading()
    }).catch(err => {
      console.log(err, 'err')
    })

    console.log(music, '???')
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