// components/musiclist/musiclist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentId: 0,
    index:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event) {
      let dataset = event.currentTarget.dataset
      console.log(dataset,'dataset')
      this.setData({
        currentId: dataset.musicid,
        index: dataset.index
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${this.data.currentId}&index=${this.data.index}`,
      })
      console.log(event)
    },
  }
})