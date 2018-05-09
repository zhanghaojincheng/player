<template>
  <div class="singer">
   <listview></listview>
  </div>
</template>

<script>
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import { Listview } from 'base/listview/listview'
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  components: {
    Listview
  },
  data () {
    return {
      singers: []
    }
  },
  created: function () {
    this._getSingerList()
  },
  methods: {
    _getSingerList () {
      getSingerList()
        .then(res => {
          if (res.code === ERR_OK) {
            this.singers = res.data.list
            this._normalLizeSinger(this.singers)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    _normalLizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((val, idx) => {
        if (idx < HOT_SINGER_LEN) {
          map.hot.items[idx] = val
        }
      })
      console.log(map)
    }
  }
}
</script>

<style scoped lang="stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
