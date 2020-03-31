<template>
  <div ref="superModal" class="wrapIMall" @click="hidshow">
    <el-carousel :autoplay="false" :height="list.heights" :initial-index="list.index" arrow="always">
      <el-carousel-item v-for="(item,index) in list.arr" :key="index">
        <video v-if="item.indexOf('mp4') !== -1" :src="item" controls width="35%" />
        <img v-else :src="item" width="50%">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>

export default {
  props: {
    list: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      // dialogVisible: false
    }
  },
  mounted() {
    const side = this.$refs.superModal
    document.body.appendChild(side)
  },
  methods: {
    hidshow() {
      this.$emit('message', false)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.wrapIMall{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background: rgba(0,0,0,.5)
}
.wrapIMall /deep/ .el-carousel{
  text-align: center
}
// 隐藏底部的图标的
.wrapIMall /deep/ .el-carousel__indicators--outside{
  display: none
}
.wrapIMall /deep/ .el-carousel__item.is-animating{
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
