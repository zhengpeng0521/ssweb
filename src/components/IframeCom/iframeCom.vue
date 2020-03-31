<template>
  <iframe ref="iframeBody" :src="url" allowfullscreen="true" class="body"/>
</template>
<script>
export default {
  props: {
    outUrl: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      url: ''
    }
  },
  watch: {
    outUrl(val) {
      if (val) {
        this.url = val
      }
    }
  },
  mounted() {
    // const token = this.$store.getters.token.slice(7)
    if (this.outUrl) {
      this.url = this.outUrl
    } else {
      // this.url = process.env.H5CREATER_BASE + `/saas.html?action=userInstList&token=` + token
      window.addEventListener('message', function(e) {
        e.source.postMessage('saveSucc', '*')
      }, false)
    }
    // const token = this.$store.getters.token.slice(7)
    // this.url = 'http://192.168.1.169:9528/saas.html?action=userInstList&token=' + token
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.body {
  height: 100%;
  width: 100%;
  border: 0;
}
</style>
