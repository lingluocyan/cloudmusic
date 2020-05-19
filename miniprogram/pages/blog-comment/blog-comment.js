// pages/blog-comment/blog-comment.js
const formatTime = require("../../utils/formatTime.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog: {},
    commentList: {},
    blogId: ''
  },
  _getBlogDetail(blogId) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'detail',
        blogId
      }
    }).then(res => {
      console.log(res, 'comment')
      res.result.commentList.data.forEach(item => {
        item.createTime = formatTime(new Date(item.createTime))
      })
      this.setData({
        blog: res.result.detail[0],
        commentList: res.result.commentList.data
      }, () => {
        wx.hideLoading()
      })
    })
  },
  refreshCommentList() {
    this._getBlogDetail(this.data.blogId)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      blogId: options.blogId
    })
    this._getBlogDetail(options.blogId)
    console.log(options, 'comment页面')
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
    const blog = this.data.blog
    return {
      title: blog.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blog._id}`
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(event) {
    console.log(event, 'coment')
  }
})