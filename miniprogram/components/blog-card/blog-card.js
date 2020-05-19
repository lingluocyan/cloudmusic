// components/blog-card/blog-card.js
const formatTime = require("../../utils/formatTime.js")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: {
      type: Object,
      value: {}
    }
  },
  observers: {
    ['blog.createTime'](val) {
      // 格式化时间
      let fmtTime = formatTime(new Date(val))
      this.setData({
        _createTime: fmtTime
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _createTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    priviewImg(event) {
      let dataset = event.currentTarget.dataset
      wx.previewImage({
        current: dataset.imgUrl, // 当前显示图片的http链接
        urls: dataset.imglist // 需要预览的图片http链接列表
      })
    }
  }
})