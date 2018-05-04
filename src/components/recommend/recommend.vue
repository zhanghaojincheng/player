<template>
  <div id="box">
    推荐页面
  </div>
</template>

<script>
import jsonp from 'common/js/jsonp'
export default {
  data () {
    return {

    }
  },
  mounted: function() {
    const url =  'https://y.qq.com/download/download.js?jsonpCallback=MusicJsonCallback&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0'
    jsonp(url, 'MusicJsonCallback').then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }
}

</script>

<style scoped lang="stylus">

</style>
