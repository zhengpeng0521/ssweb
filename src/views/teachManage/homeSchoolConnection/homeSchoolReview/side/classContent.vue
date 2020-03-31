<template>
  <div class="classContent">
    <el-button
      v-if="hasBtn('508000002')"
      type="primary"
      style="margin-bottom:10px"
      @click="edit"
    >编辑</el-button>
    <div class="render_item">
      <div>课堂内容：</div>
      <div>{{ classData.content || '--' }}</div>
    </div>
    <div class="render_item">
      <!-- <div>课后作业：</div>
      <div>{{ classData.homework || '--' }}</div> -->
    </div>
    <div>
      <div class="render_item">
        <div>课堂展示：</div>
        <div>共{{ picNum }}张</div>
      </div>
      <div style="margin-left:62px">
        <div
          v-for="(item,index) of picArr"
          :key="index"
          class="render_img"
        >
          <div
            class="uploadExample"
            @click="hirshow(index)"
          >
            <video v-if="item.indexOf('mp4') !== -1" :src="item" style="object-fit: fill" width="78px" height="78px" />
            <div v-else :style="{backgroundImage: `url(${item})`, height: '78px', width: '78px',backgroundSize:'cover',backgroundPosition:'center center'}"/>
            <span v-if="item.indexOf('mp4') !== -1" class="wraps"><img src="http://img.ishanshan.com/gimg/n/20190729/57a0a9e3929437e627aed14e68828f6d" alt="" class="IMGa"></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 查看图片轮播详情 -->
    <Imgpreview v-if="dialogVisible" :list="listALL" @message="hiDcloe"/>
  </div>
</template>
<script>
import Imgpreview from '@/components/ImgPreview/imgpre'
export default {
  components: {
    Imgpreview
  },
  data() {
    return {
      dialogVisible: false,
      listALL: {},
      windowH: '',
      picNum: 0, // 图片张数
      picArr: [], // 图片列表
      classData: {} // 上课数据
    }
  },
  mounted() {
    this.windowH = document.body.clientHeight + 'px'
  },
  methods: {
    hiDcloe(val) {
      this.dialogVisible = val
    },
    hirshow(index) {
      this.dialogVisible = true
      this.listALL = {
        arr: this.picArr,
        index: index,
        heights: this.windowH
      }
    },
    getList(val) {
      this.classData = val
      if (val.picList && val.picList.length > 0) {
        this.picNum = val.picList.length
        this.picArr = val.picList
      } else {
        this.picNum = 0
        this.picArr = []
      }
    },
    /* 编辑课堂内容 */
    edit() {
      this.$emit('toClassContentEdit', this.classData)
    }
  }
}
</script>
>
<style lang="scss" scoped>
.render_item {
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 10px;
  color: rgba(0, 0, 0, 0.65);
  div:first-child {
    width: 8.5%;
  }
  div:last-child {
    width: 91.5%;
  }
}
.render_img {
  float: left;
  margin-left: 10px;
  .uploadExample {
    cursor: pointer;
    position: relative;
    display: inline-block;
    height: 96px;
    padding: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    vertical-align: top;
    margin-right: 10px;
    img {
      width: 78px;
      height: 78px;
    }
    .wrap {
      position: absolute;
      bottom: 8px;
      left: 8px;
      width: 78px;
      height: 18px;
      color: #fff;
      line-height: 20px;
      text-align: center;
      font-size: 12px;
      background: #000;
      opacity: 0.5;
    }
    .wraps{
      position: absolute;
      width: 78px;
      height: 78px;
      left: 8px;
      top: 8px;
      background:rgba(0,0,0,.5);
        .IMGa{
        position: absolute;
        width: 30px;
        height: 30px;
        bottom: 24px;
        left: 24px;
      }
    }
  }
}
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
