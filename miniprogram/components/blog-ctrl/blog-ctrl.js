// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: {
      type: String,
      value: ''
    },
    blog: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showLogin: false, // 登录组件是否显示
    showBottomModal: false, // 评论组件是否显示
    placeholder: '发表你的评论~',
    content: '', //文本域内容
  },
  // 组建内部使用全局样式iconfont
  externalClasses: [
    "iconfont",
    "icon-pinglun",
    "icon-fenxiang"
  ],
  /**
   * 组件的方法列表
   */
  methods: {
    // 点击评论的回调
    onComment() {
      wx.requestSubscribeMessage({
        tmplIds: ['nKqNdwy50PHoBP1sBSH4w2nnfsSbMVtRXizdC_mXrKA'],
        success: () => {
          wx.getSetting({
            success: (res) => {
              console.log(res)
              // 说明登录了
              if (res.authSetting['scope.userInfo']) {
                wx.getUserInfo({
                  success: (res) => {
                    userInfo = res.userInfo
                    // 显示评论弹出层
                    this.setData({
                      showBottomModal: true
                    })
                  }
                })
              } else {
                this.setData({
                  showLogin: true
                })
              }
            }
          })
        },
        fail: (res) => {
          console.log(res, '输出失败')
          wx.showModal({
            title: '授权后才能继续~'
          })
        }
      })
    },
    onShare() {
      // this.
    },
    // 点击发布评论的回调
    publishComment(event) {
      let formId = event.detail.formId
      let content = event.detail.value.content
      wx.showLoading({
        title: '发布中~',
      })
      wx.cloud.callFunction({
        name: 'blog',
        data: {
          $url: 'comment',
          nickName: userInfo.nickName,
          blogId: this.properties.blogId,
          content: content,
          avatarUrl: userInfo.avatarUrl
        }
      }).then(res => {
        wx.showModal({
          title: '评论成功!',
        })
        this.triggerEvent("refreshCommentList")
        this.setData({
          showBottomModal: false,
          content: ''
        })
        // 调用推送模板的云函数
        wx.cloud.callFunction({
          name: 'sendMessage',
          data: {
            formId,
            content,
            blogId: this.properties.blogId
          }
        }).then(res => {
          console.log(res, '模板推送')
        }).catch(er => {
          console.log(err, 'err')
        })
        wx.hideLoading()
      }).catch(err => {
        console.log(err, 'err')
        wx.hideLoading()
      })
    },
    // 用户授权
    onLoginSuccess(event) {
      // 当用户授权成功把用户信息存储起来
      userInfo = event.detail
      console.log(event, '成功授权')
      this.setData({
        showLogin: false
      }, () => {
        this.setData({
          showBottomModal: true
        })
      })
    },
    // 用户不授权
    onLoginFail() {
      wx.showModal({
        title: '授权用户才能发布',
        content: '',
      })
    },
    // 文本域获取焦点事件，可获取输入栏的高度,注意只在真机有效
    onFocus(event) {
      // console.log(event, '聚焦')
      // this.setData({
      //   footerBottom: event.detail.height
      // })
    },
    // 文本域失去焦点事件
    onBlur() {
      // this.setData({
      //   footerBottom: 0
      // })
    },
    // onLoginFail() {
    //   console.log('未授权false')
    //   wx.showModal({
    //     title: '授权后才能评论~'
    //   })
    // }
  }
})