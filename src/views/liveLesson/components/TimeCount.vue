<template>
  <div class="time_count">{{ str }}</div>
</template>

<script>
export default {
  data() {
    return {
      h: 0, // 定义时，分，秒，毫秒并初始化为0；
      m: 0,
      s: 0,
      time: null,
      str: '',
      mytime: ''

    }
  },

  mounted() {
    const str = localStorage.getItem('ssTimeCount')
    this.str = str
  },

  beforeDestroy() {
    if (this.time) {
      clearInterval(this.time)
    }
  },

  methods: {

    timer() { // 定义计时函数
      this.s = this.s + 1 // 秒
      if (this.s >= 60) {
        this.s = 0
        this.m = this.m + 1 // 分钟
      }
      if (this.m >= 60) {
        this.m = 0
        this.h = this.h + 1 // 小时
      }
      this.str = this.toDub(this.h) + ':' + this.toDub(this.m) + ':' + this.toDub(this.s)
    },

    reset() { // 重置
      clearInterval(this.time)
      this.h = 0
      this.m = 0
      this.s = 0
      this.str = '00:00:00'
    },

    start() { // 开始
      this.str = '00:00:00'
      localStorage.removeItem('ssTimeCount')
      this.time = setInterval(this.timer, 1000)
    },

    stop() { // 暂停
      clearInterval(this.time)
      localStorage.setItem('ssTimeCount', this.str)
    },

    toDub(n) { // 补0操作
      if (n < 10) {
        return '0' + n
      } else {
        return '' + n
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.time_count{
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
