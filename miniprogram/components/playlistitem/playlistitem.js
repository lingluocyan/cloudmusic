// components/playlistitem/playlistitem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object,
      value: {}
    }
  },
  observers: {
    ["playlist.playCount"](val) {
      // return this._tranNumber(val, 3)
      this.setData({
        _count: this._tranNumber(val, 2)
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _count: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 根据传入的数值把数字转为带单位
    _tranNumber(num, point = 2) {
      // 去掉小数点后的数字
      let newNum = num.toString().split('.')[0]
      let length = newNum.length
      if (length < 6) {
        return newNum
      }
      // 如果小于一亿
      else if (length >= 6 && length <= 8) {
        // 把万后面的数字切出来
        let decimal = newNum.substring(length - 4, length - 4 + point)
        // parseInt获取万的数量，拼接上刚才切出的一万以下数字，最后parseInt以下去掉后面的0
        return parseFloat((parseInt(newNum / 10000) + '.' + decimal)) + '万'
      } else if (length > 8) {
        let decimal = newNum.substring(length - 8, length - 8 + point)
        return parseFloat(parseInt(newNum / 100000000)+'.' + decimal) + '亿'
      }
    },
    goToMusiclist() {
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?playlistId=${this.data.playlist.id}`
      })
    }
  }
})