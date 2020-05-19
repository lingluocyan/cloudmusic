// components/search/search.js
let keyWord = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '请输入关键字'
    }
  },
  externalClasses:[
    "iconfont",
    "icon-sousuo"
  ],
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event) {
      keyWord = event.detail.value
    },
    search() {
      // 把事件交给blog去执行
      this.triggerEvent("onSearch",{keyWord})
    }
  }
})
