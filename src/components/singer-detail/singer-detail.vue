<template>
  <transition name="slider">
    <music-list :bg-image="bgImage" :title="title" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetails } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import musicList from 'components/music-list/music-list'
export default {
  components: {
    musicList
  },
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getSingerDetail()
  },
  computed: {
    title: function () {
      return this.singer.name
    },
    bgImage: function () {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  methods: {
    _getSingerDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetails(this.singer.id)
        .then(res => {
          if (res.code === ERR_OK) {
            this.songs = this.normalizeSongs(res.data.list)
            // console.log(this.songs)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    normalizeSongs (list) {
      let ref = []
      list.forEach((item) => {
        let { musicData } = item
        if (musicData.songid && musicData.albummid) {
          ref.push(createSong(musicData))
        }
      })
      return ref
    }
  }
}

</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position: fixed
    z-index:100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
  .slider-enter-active, .slider-leave-active
    transition: all .3s
  .slider-enter, .slider-leave-to
    transform: translate3d(100%, 0, 0)
</style>
