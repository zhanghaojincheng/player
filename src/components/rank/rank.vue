<template>
  <div>
    排行页面
    <div ref="div">
      {{ msg }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  data () {
    return {
      div: 789,
      msg: 789
    }
  },
  mounted () {
    this.msg = 'new message'
    Vue.nextTick(() => {
      console.log(this.$refs.div.textContent)
    })
    console.log(this.$refs.div.textContent)
  }
}
</script>

<style scoped lang="stylus">

</style>
