<template>
  <div class="progress-bar" ref="progressBar" @click.prevent.stop="progressBarClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
           ref="progressBtn"
           @touchstart.prevent.stop="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from 'common/js/dom'
const transform = prefixStyle('transform')
const progressBtnWidth = 16
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      msg: 1
    }
  },
  created() {
    this.touch = {}
  },
  watch: {
    percent (newVal) {
      if (this.touch.initiated) return
      const progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const offsetWidth = progressBarWidth * newVal
      this._offsetWidth(offsetWidth)
    }
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) return
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offsetWidth(offsetWidth)
    },
    progressTouchEnd (e) {
      this.touch.initiated = false
      this._triggerPercent()
      this.$emit('percentEvent', this.$refs.progress.clientWidth, this.$refs.progressBar.clientWidth - progressBtnWidth)
    },
    // 点击播放条，也可以切换播放位置
    progressBarClick (e) {
      this._offsetWidth(e.offsetX)
      this._triggerPercent()
    },
    // 封装的点击播放进度按钮公共的方法
    _offsetWidth (width) {
      this.$refs.progress.style.width = `${width}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${width}px, 0, 0)`
    },
    _triggerPercent () {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
