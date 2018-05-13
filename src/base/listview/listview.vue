<template>
  <scroll class="listview"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="listenChangeScroll"
  >
    <ul class="ul-listview">
      <li class="list-group" v-for="group in data" :key="group.title" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="item in group.items" :key="item.id">
            <img v-lazy="item.avatar" class="avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.prevent.stop="onShortcutTouchStart" @touchmove="onShortcutTouchMove">
      <ul ref="letterList">
        <li class="item" :class="{current : index === touchIndex}" v-for="(item, index) in shortcutList" :data-index="index" :key="index">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { attributeMethod } from 'common/js/dom'

const TITLE_HEIGHT = 30
export default {
  components: {
    Scroll
  },
  created () {
    this.touch = {}
  },
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      scrollY: -1,
      touchIndex: 0,
      listenScroll: true,
      probeType: 3,
      letterHeightArray: [],
      diff: -1
    }
  },
  computed: {
    shortcutList: function () {
      return this.data.map((group) => {
        return group.title.substring(0, 1)
      })
    },
    fixedTitle: function () {
      // console.log(this.scrollY)
      if (this.scrollY > 0) {
        return
      }
      return this.data[this.touchIndex] ? this.data[this.touchIndex].title : ''
    }
  },
  methods: {
    onShortcutTouchStart (e) {
      this.touch.y1 = e.touches[0].pageY
      this.tempIndex = attributeMethod(e.target, 'index')
      this.scrollTo(this.tempIndex)
    },
    onShortcutTouchMove (e) {
      this.touch.y2 = e.touches[0].pageY
      let movedHeight = this.touch.y2 - this.touch.y1
      let moveNumber = Math.round(movedHeight / this.letterHeight) + (+this.tempIndex)
      this.scrollTo(moveNumber)
    },
    scrollTo (index) {
      if (index === null || (index < 0) || (index > this.shortcutList.length - 1)) {
        return
      }
      this.touchIndex = Number(index)
      this.scrollView.scrollToElement(this.$refs.listGroup[index], 0)
    },
    listenChangeScroll (pos) {
      this.scrollY = pos.y
    },
    _computedHeight () {
      let list = this.$refs.listGroup
      let arr = []
      let height = 0
      arr.push(height)
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        arr.push(height)
      }
      this.letterHeightArray = arr
      console.log(arr)
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._computedHeight()
        this.letterHeight = this.$refs.letterList.firstChild.clientHeight
        this.scrollView = this.$refs.listview
      }, 0)
    },
    scrollY (newY) {
      if (newY > 0) {
        this.touchIndex = 0
        return
      }
      for (let i = 0; i < this.letterHeightArray.length; i++) {
        let height1 = this.letterHeightArray[i]
        let height2 = this.letterHeightArray[i - 1]
        if (-newY <= height1 && -newY > height2) {
          this.diff = height1 + newY
          this.touchIndex = i - 1
          break
        }
      }
    },
    diff(newY) {
      let fixedTop = newY < TITLE_HEIGHT ? newY - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .ul-listview
      /*padding-top:30px*/
      .list-group
        padding-bottom: 30px
        .list-group-title
          height: 30px
          line-height: 30px
          padding-left: 20px
          font-size: $font-size-small
          color: $color-text-l
          background: $color-highlight-background
        .list-group-item
          display: flex
          align-items: center
          padding: 20px 0 0 30px
          .avatar
            width: 50px
            height: 50px
            border-radius: 50%
          .name
            margin-left: 20px
            color: $color-text-l
            font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
