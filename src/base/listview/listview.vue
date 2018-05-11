<template>
  <scroll class="listview"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="listenChangeScroll"
  >
    <ul>
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
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { attributeMethod } from 'common/js/dom'
export default {
  components: {
    Scroll
  },
  created () {
    this.touch = {}
  },
  mounted () {

  },
  updated () {
    this._computedHeight()
    this.letterHeight = this.$refs.letterList.firstChild.clientHeight
    this.scrollView = this.$refs.listview
  },
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      touchIndex: 0,
      listenScroll: true,
      probeType: 3
    }
  },
  computed: {
    shortcutList: function () {
      return this.data.map((group) => {
        return group.title.substring(0, 1)
      })
    }
  },
  methods: {
    onShortcutTouchStart (e) {
      this.touch.y1 = e.touches[0].pageY
      this.tempIndex = attributeMethod(e.target, 'index')
      // this.touchIndex = +this.tempIndex
      this.scrollTo(this.tempIndex)
    },
    onShortcutTouchMove (e) {
      this.touch.y2 = e.touches[0].pageY
      let movedHeight = this.touch.y2 - this.touch.y1
      let moveNumber = Math.ceil(movedHeight / this.letterHeight) + (+this.tempIndex)
      // this.touchIndex = moveNumber
      this.scrollTo(moveNumber)
    },
    scrollTo (index) {
      this.scrollView.scrollToElement(this.$refs.listGroup[index], 0)
    },
    listenChangeScroll (pos) {
      let scrollY = pos.y
      if (scrollY > 0) {
        this.touchIndex = 0
        return
      }
      for (let i = 0; i < this.letterHeightArray.length; i++) {

        if (-scrollY < this.letterHeightArray[i] && -scrollY > this.letterHeightArray[i - 1]) {
          this.touchIndex = i + 1
          break
        }
      }
    },
    _computedHeight () {
      let list = this.$refs.listGroup
      let arr = []
      let height = 0
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        arr.push(height)
      }
      this.letterHeightArray = arr
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
