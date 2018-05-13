<template>
  <div class="singer">
   <list-view @singerdetail="_getSingerDetail" :data="singers"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import ListView from 'base/listview/listview'
import Singer from 'common/js/singer'
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  components: {
    ListView
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
            this.singers = this._normalLizeSinger(res.data.list)
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
          map.hot.items.push(new Singer({
            id: val.Fsinger_mid,
            name: val.Fsinger_name
          }))
        }
        let key = val.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: val.Fsinger_mid,
          name: val.Fsinger_name
        }))
      })
      // console.log(map)
      let hot = []
      let ret = []
      for (let i in map) {
        let val = map[i]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (i === 'hot') {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    _getSingerDetail (val) {
      this.$router.push({ path: `/singer/${val.id}` })
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
