// pages/blog/blog.js
let keyWord = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    blogList: []
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
  //  获取云数据库中博客的数据
  _loadBlogList(start = 0, keyWord = '') {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        start,
        count: 10,
        keyWord,
        $url: 'list'
      }
    }).then(res => {
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      if (res.result.length == 0) {
        wx.showToast({
          title: '没有更多了~',
          icon: 'none'
        })
      }
      wx.hideLoading()
      wx.stopPullDownRefresh()
      console.log(res, '获取云函数')
    }).catch(err => {
      wx.stopPullDownRefresh()
      wx.hideLoading()
      console.err(err)
    })
  },
  // 点击卡片跳转到详情页
  goComment(event) {
    console.log(event, 'event')
    wx.navigateTo({
      url: `../blog-comment/blog-comment?blogId=${event.currentTarget.dataset.id}`,
    })
  },
  // 搜索框搜索事件，内容右搜索组件传来
  onSearch(event) {
    // keyWord
    keyWord = event.detail.keyWord
    this.setData({
      blogList: []
    })
    // 调用获取数据的方法，第一个参数是从第几条开始查，第二个参数是关键字
    this._loadBlogList(0, keyWord)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('onload')
    this.setData({
      blogList: []
    })
    this._loadBlogList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    console.log(options, 'onSHowoptions')
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
    // 下拉刷新则清空原有数据并重新请求数据
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 上拉触底，则请求新的数据
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(event) {
    let dataset = event.target.dataset
    let realUrl = ''
    wx.cloud.getTempFileURL({
      fileList: [{
        fileID: dataset.blog.img[0],
        maxAge: 60 * 60, // one hour
      }]
    }).then(res => {
      // get temp file URL
      console.log(res.fileList)
      let realUrl = res.fileList[0].tempFileURL
    }).catch(error => {
      // handle error
    })
    console.log(realUrl, 'realUrl')

    return {
      title: dataset.blog.content,
      path: `/pages/blog-comment/blog-comment?blogId=${dataset.blogid}`,
      imageUrl: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1963028709,2899678926&fm=26&gp=0.jpg"
    }
  }
})