// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: ['张三','李四','王五','赵六']
  },
  async foo() {
    return '奥利给'
    console.log('嘻嘻')
  },
 timeout() {
    return new Promise( (resolve,reject)=> {
      setTimeout(()=> {
        resolve("哦了")
      },1100)
    })
  },

  getUser(event) {
    console.log(event)
    wx.getUserInfo({
      success:(res)=> {
        console.log(res)
      }
    })
  },

  change() {
    for (let i = 0;i<this.data.arr.length;i++) {
      let length = this.data.arr.length
      let a = Math.floor(Math.random() * length)
      let b = Math.floor(Math.random() * length)
      let temp = this.data.arr[a]
      this.data.arr[a] = this.data.arr[b]
      this.data.arr[b] = temp
    }
    this.setData({
      arr:this.data.arr
    })
  },

  getMusicInfo() {
    console.log('xx')
    wx.cloud.callFunction({ 
      name: 'tcbRouter',
      data: {
        $url: 'music'
      },
    }).then(res=> { 
      console.log(res,'res')
    })
  },
  getMovieInfo() {
    wx.cloud.callFunction({
      name: 'tcbRouter',
      data: {
        $url: 'movie'
      }
    }).then(res => {
      console.log(res, 'res')
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let res = await this.timeout()
    console.log(res)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})