// components/lyric/lyric.js
let setFlag = true
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false,
      scrollTop: 0, // scrollView也就是歌词列表滚动的距离
      currentItemHeight: 0
    },
    // 歌词
    lyric: String
  },
  observers: {
    lyric(lrc) {
      // console.log(lrc, '输出接受的参数')
      if (lrc !== '暂无歌词') {
        // 格式化参数
        this._parseLyric(lrc)
      } else {
        this.setData({
          lrcList: [{
            lrc,
            time: 0
          }],
          currentLyric: -1,
        })
      }
    }
  },
  lifetimes: {
    ready() {
      let Info = wx.getSystemInfoSync()
      console.log(Info, 'info')
      // 获取当前屏幕对应的rpx比例 (屏幕宽度/750)
      // 之后用这个比例乘上之前定义的rpx高度，可得对应的每一行歌词的px高度
      // 方便判断时间时改变scrollTop (scrollTop只接受px单位)
      let currentHeight = Info.windowWidth / 750 * 64
      this.setData({
        currentItemHeight: currentHeight
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    currentLyric: 0,
    // setFlag: true, // 状态位，判断是否赋值
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _parseLyric(sLyric) {
      // 通过换行符分割为数组
      let line = sLyric.split("\n")
      // 定义一个数组存储格式化后的歌曲信息
      let _lrcList = []
      line.forEach((item) => {
        // 获取前面的时间部分
        let time = item.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))]/g)
        if (time !== null) {
          // 获取时间后面的歌词部分
          let lrc = item.split(time)[1]
          // 获取小时，分钟，秒
          let timeReg = time[0].match(/(\d{2}):(\d{2})(?:\.(\d{2,3})?)/)
          let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) * 1 +
            parseInt(timeReg[3]) / 1000
          _lrcList.push({
            lrc,
            time: time2Seconds
          })
          // console.log(_lrcList, 'lrc')
        }
        // console.log(time, 'time')
      })
      this.setData({
        lrcList: _lrcList
      })
      // console.log(line, 'line')
    },
    // 定义方法接受传来的数据
    // 也是判断当前播放时间与歌词列表时间是否对应，以便高亮当前歌词的方法
    upDate(currentTime) {
      let lrclist = this.data.lrcList
      // 如果当前播放的部分没有对应歌词，那么会移动到最底部并不会高亮
      // 如果最后一项有时间，不为空
      if (setFlag && lrclist[lrclist.length - 1] && currentTime > lrclist[lrclist.length - 1].time) {
        console.log('进入1')
        this.setData({
          currentLyric: -1,
          scrollTop: this.data.currentItemHeight * lrclist.length,
        })
        setFlag = false
      }
      // 如果没有歌词
      if (lrclist.length < 1) return
      for (let i = 0; i < lrclist.length; i++) {
        if (currentTime <= lrclist[i].time) {
          this.setData({
            currentLyric: i - 1,
            scrollTop: this.data.currentItemHeight * (i - 1),
          })
          setFlag = true
          // 找到了则终止循环
          break
        }
      }
    }
  }
})