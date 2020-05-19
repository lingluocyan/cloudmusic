// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /** 
   * 组件的方法列表
   */
  methods: {
    handleGetUserInfo(event) {
      // 说明允许授权
      if (event.detail.userInfo) {
        this.setData({
          showModal: false
        })
        console.log(event.detail.userInfo,'event.detail.userInfo')
        this.triggerEvent("onLoginSuccess", event.detail.userInfo)
      } else {
        console.log('fail')
        this.triggerEvent("onLoginFail")
      }
    }
  }
})
