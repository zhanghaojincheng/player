<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" width="100%" alt="" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
        @touchstart.prevent="middleTouchStart"
        @touchmove.prevent="middleTouchMove"
        @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img :src="currentSong.image" class="image" alt="">
              </div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyriclist" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricline" class="text"
                   :class="{current: currentLineNum === idx}"
                   v-for="(line, idx) in currentLyric.lines" :key="line.time">
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active: currentShow === 'cd'}"></span>
            <span class="dot" :class="{active: currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeIconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :src="currentSong.image" :class="cdCls" width="40" height="40" alt="">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i :class="miniIcon" class="icon-mini" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio"
           :src="currentSong.url"
           @canplay="ready"
           @error="error"
           @timeupdate="updateTime"
           @ended="end"
    ></audio>
  </div>
</template>

<script>
import animations from 'create-keyframe-animation'
import {mapGetters, mapMutations} from 'vuex'
import {prefixStyle} from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
// 获取歌词接口

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  },
  data() {
    return {
      currentTime: 0,
      songReady: true,
      currentLyric: null,
      currentLineNum: 0,
      // 当前显示是歌词还是cd
      currentShow: 'cd'
    }
  },

  created() {
    this.touch = {}
  },
  mounted() {

  },
  computed: {
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'singer',
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  watch: {
    currentSong(newsong, oldsong) {
      if (newsong.id === oldsong.id) {
        return
      }
      this.$nextTick(() => {
        this.$refs.audio.play()
        this.getLyric()
        // this.currentSong.getLyric()
        // 拿到了歌词的数据 引入了parser模块 下一步，do the lyric position
        // console.log(this.currentSong)
      })
    },
    playing(newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    },
    currentIndex(newVal) {
      this.setCurrentIndex(newVal)
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setCurrentMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    // 播放按钮
    togglePlaying() {
      this.setPlayingState(!this.playing)
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    // 当单曲循环的时候,歌曲结束后
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
    },
    // 上一首
    prev() {
      if (this.songReady) {
        this.songReady = false
        this.setCurrentIndex(this.currentIndex === 0 ? this.playlist.length - 1 : this.currentIndex - 1)
        if (!this.playing) {
          this.setPlayingState(true)
        }
      }
    },
    // 下一首
    next() {
      if (this.songReady) {
        this.songReady = false
        this.setCurrentIndex(this.currentIndex === this.playlist.length - 1 ? 0 : this.currentIndex + 1)
        if (!this.playing) {
          this.setPlayingState(true)
        }
      }
    },
    ready () {
      this.songReady = true
    },
    error () {
      this.songReady = true
    },
    // audio标签播放触发的事件
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    format (val) {
      let interval = val | 0
      let min = this._pad(interval / 60 | 0)
      let second = this._pad(interval % 60 | 0)
      return `${min}:${second}`
    },
    getLyric() {
      this.currentSong.getLyric().then(lyric => {
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        console.log(this.currentLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      })
    },
    // 歌词被移动的时候 触发的回掉函数
    handleLyric(lyricInfo) {
      let lineNum = lyricInfo.lineNum
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricline[lineNum - 5]
        this.$refs.lyriclist.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyriclist.scrollToElement(this.$refs.lyricline[0], 1000)
      }
    },
    _pad (val, n = 2) {
      let len = val.toString().length
      while (len < n) {
        val = '0' + val
        len++
      }
      return val
    },
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1, 1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        prosets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all .4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      // animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    // cd动画
    _getPosAndScale() {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2) - paddingLeft
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    // 歌词页面的左右滑动 显示cd还是歌词
    middleTouchStart(e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) return
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      // 因爲是兩頁，所以最大限制往左滑動一個屏幕的距離，最小是0
      this.$refs.lyriclist.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      // 滑動比例
      this.touch.percent = Math.abs(offsetWidth) / window.innerWidth
      this.$refs.middleL.style.opacity = `${1 - this.touch.percent}`
      // 移动的时候不要过渡效果
      this.$refs.middleL.style[transitionDuration] = `0s`
      this.$refs.lyriclist.$el.style[transitionDuration] = `0s`
    },
    middleTouchEnd() {
      let offsetWidth = 0
      let opacityVal = 1
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          this.currentShow = 'lyric'
          opacityVal = 0
        }
      } else {
        if (this.touch.percent < 0.9) {
          this.currentShow = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacityVal = 0
        }
      }
      this.$refs.middleL.style[transitionDuration] = `.5s`
      this.$refs.middleL.style.opacity = opacityVal
      this.$refs.lyriclist.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyriclist.$el.style[transitionDuration] = `.5s`
    },
    onProgressBarChange (percent) {
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    // 切换播放模式
    changeIconMode () {
      const mode = (this.mode + 1) % 3
      this.setCurrentMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    // 切换播放模式的时候，当前歌曲不改变
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
