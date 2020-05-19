//app.js
App({
  onLaunch: function(options) {
    console.log(options,'app')
    this.checkUpdate()
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'zy-cloud-rczke',
        // 是否记录每个访问小程序的用户，并且以倒叙的形式显示
        traceUser: true,
      })
    }
    this.getOpenid()

    this.globalData = {
      // 设定全局的musicId,也就是正在播放的id
      playingMusicId: -1,
      openid: -1
    }
  },
  // 可检测小程序切前台
  onShow: function() {},
  // 设定全局id的方法
  setPlayMusicId(musicId) {
    this.globalData.playingMusicId = musicId
  },
  // 获取全局id的方法
  getPlayMusicId() {
    return this.globalData.playingMusicId
  },
  // 获取当前用户openId的方法
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      console.log(res, 'res')
      // 把openid存储在全局
      const openid = res.result.event.userInfo.openId
      this.globalData.openid = openid
      // 如果本地没有记录则设置一个，有则无操作
      if (wx.getStorageSync(openid) == '') {
        wx.setStorageSync(openid, [])
      }
    })
  },
  // 获取全局唯一的版本管理器
  checkUpdate() {
    const updateManager = wx.getUpdateManager()
    // 检测版本更新
    updateManager.onCheckForUpdate((res) => {
      console.log(res, '检查新版本')
      if (res.hasUpdate)
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用',
            success: (res) => {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
    })
  }
})