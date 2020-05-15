// components/progress-bar/progress-bar.js
// 把获取到的move部分宽度存储起来
let movableAreaWidth = 0
let movableViewWidth = 0
let currSec = 0
let duration = 0
// 判断当前是否正在移动
let isMoving = false
const getBackgroundAudioManager = wx.getBackgroundAudioManager()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00',
      // movable-view x移动的距离
      movableDis: 0,
      progress: 0, // 进度条移动距离
    }
  },
  lifetimes: {
    ready() {
      this._getMovableDis()
      this._bindBGMEvent()
    },
  },
  /**
   * 组件的方法列表 
   */
  methods: {
    // 监听拖动movable-view的事件
    onChange(event) {
      // 当鼠标拖动时 source为 touch，正常播放是setData操作，source为空串
      if (event.detail.source == 'touch') {
        // 设置x的距离，但不会影响页面
        this.data.movableDis = event.detail.x
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
        isMoving = true
      }
    },
    // 监听鼠标抬起的事件
    toucheEnd() {
      // 获取总时间，然后根据进度条的百分比算出当前时间
      let pencentTime = this.data.progress / 100 * getBackgroundAudioManager.duration
      // 格式化时间
      let nowTime = this._dateFormat(pencentTime)
      // 只有当鼠标抬起才真正的改变页面
      this.setData({
        movableDis: this.data.movableDis,
        progress: this.data.progress,
        ['showTime.currentTime']: `${nowTime.min}:${nowTime.sec}`
      })
      // 调用api把音乐播放进度调整到计算出的当前时间
      getBackgroundAudioManager.seek(pencentTime)
    },
    // 获取可移动区域的宽度
    _getMovableDis() {
      // wx.createSelectorQuery()
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect) => {
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
        console.log(rect, 'rect')
      })
    },
    // 操作进度条的事件
    _bindBGMEvent() {
      //监听背景音频播放事件
      getBackgroundAudioManager.onPlay(() => {
        isMoving = false
        console.log('onPlay ')
      })
      // 监听背景音频停止事件
      getBackgroundAudioManager.onStop(() => {
        console.log('onStop ')
      })
      // 监听背景音频暂停事件
      getBackgroundAudioManager.onPause(() => {
        console.log('onPause ')
      })
      //监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
      getBackgroundAudioManager.onWaiting(() => {
        console.log('onWaiting ')
      })
      // 监听背景音频进入可播放状态事件。 但不保证后面可以流畅播放
      getBackgroundAudioManager.onCanplay(() => {
        console.log(getBackgroundAudioManager.duration, 'onCanplay ')
        if (typeof getBackgroundAudioManager.duration !== 'undefined') {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })
      // 监听背景音频播放进度更新事件，只有小程序在前台时会回调
      getBackgroundAudioManager.onTimeUpdate(() => {
        // 只有没在移动的时候才可以设置值，不然在移动的时候会冲突造成圆点跳动
        if (!isMoving) {
          const currentTime = getBackgroundAudioManager.currentTime
          const duration = getBackgroundAudioManager.duration
          // 格式化时间
          let formatTime = this._dateFormat(currentTime)
          // 判断如果是同一秒内执行多次则取消执行，以便提高性能
          if (currentTime.toString().split('.')[0] !== currSec) {
            this.setData({
              ['showTime.currentTime']: `${formatTime.min}:${formatTime.sec}`,
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100

            })
            currSec = currentTime.toString().split('.')[0]
            // console.log(currentTime,'onTimeUpdate')
          }
        }

      })
      // 监听背景音频自然播放结束事件


      getBackgroundAudioManager.onEnded(() => {
        this.triggerEvent('musicEnd')
        console.log('onEnded ')
      })
      // 监听背景音频播放错误事件
      getBackgroundAudioManager.onError((res) => {
        console.err(res.errMsg)
        console.log(res.errCode, 'onError')
        wx.showToast({
          title: '错误:' + res.errCode,
        })
      })
    },
    // 获取duration(当前音频的长度)
    _setTime() {
      duration = getBackgroundAudioManager.duration
      const formatTime = this._dateFormat(duration)
      this.setData({
        ['showTime.totalTime']: `${formatTime.min}:${formatTime.sec}`
      })
      console.log(formatTime, 'settime')
    },
    // 格式化时间
    _dateFormat(time) {
      // 获取分钟
      const min = Math.floor(time / 60)
      // 获取秒
      const sec = Math.floor(time % 60)
      return {
        'min': this._parse0(min),
        'sec': this._parse0(sec)
      }
    },
    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec
    }
  }
})