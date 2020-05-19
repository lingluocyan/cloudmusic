// pages/profile-bloghistory/profile-bloghistory.js
const MAX_LIMIT = 10
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList: []
  },
  // 云函数获取我的数据。根据当前用户的openId
  _getBlogHistoryList() {
    wx.showLoading({
      title: '加载中~',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'getListbyOpenId',
        start: this.data.blogList.length,
        count: MAX_LIMIT
      }
    }).then(res => {
      wx.hideLoading()
      if (res.result.length == 0) {
        wx.showToast({
          title: '我也是有底线的~',
          icon: 'none',
        })
        return
      }
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      console.log(res, '输出结果')
    })
  },
  // 小程序端获取我的数据
  _getListByMiniprogram() {
    wx.showLoading({
      title: '加载中',
    })
    db.collection('blog').skip(this.data.blogList.length)
      .limit(MAX_LIMIT).orderBy('createTime', 'desc').get().then((res) => {
        console.log(res)
        let _bloglist = res.data
        for (let i = 0, len = _bloglist.length; i < len; i++) {
          _bloglist[i].createTime = _bloglist[i].createTime.toString()
        }
        this.setData({
          blogList: this.data.blogList.concat(_bloglist)
        })

        wx.hideLoading()
      })

  },
  // 点击列表跳转到详情页
  goComment(event) { 
    console.log(event)
    let blogId = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `../blog-comment/blog-comment?blogId=${blogId}`,
    })
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this._getBlogHistoryList()
    this._getListByMiniprogram()
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
    this._getListByMiniprogram()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(event) {
    console.log(event,'分享')
    let dataset = event.target.dataset
    return {
      title: dataset.blog.content,
      path: `/pages/blog-comment/blog-comment?blogId=${dataset.blogid}`,
      imageUrl: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1963028709,2899678926&fm=26&gp=0.jpg"
    }
  }
})