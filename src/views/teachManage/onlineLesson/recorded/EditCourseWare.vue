<template>
  <div class="page_box">
    <!-- 标题 -->
    <div class="page_title">
      <a @click="confirmBack"><i class="el-icon-arrow-left"/>返回</a>
      <span class="title_line">|</span>
      <span>编辑课件</span>
    </div>

    <!-- 内容 -->
    <el-tabs v-model="activeName" type="card" @tab-click="changeTab">
      <el-tab-pane label="基本信息" name="base">
        <BaseInfo v-if="activeName === 'base'" type="edit" />
      </el-tab-pane>
      <el-tab-pane label="上传章节视频" name="upload">
        <CourseVideo v-if="activeName === 'upload'" type="edit" />
      </el-tab-pane>
      <el-tab-pane v-if="editItem.type === 2" label="选择学员" name="chooseStu">
        <ChooseStu v-if="activeName === 'chooseStu'" type="edit" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="提示"
      width="500px">
      <div>您未保存的信息将不保存，是否返回？</div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="goBack">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import BaseInfo from './components/BaseInfo'
import CourseVideo from './components/CourseVideo'
import ChooseStu from './components/ChooseStu'
export default {
  components: {
    BaseInfo,
    CourseVideo,
    ChooseStu
  },

  data() {
    return {
      dialogVisible: false,
      activeName: 'base'
    }
  },

  computed: {
    ...mapState('recorded', [
      'editItem'
    ])
  },
  mounted() {
    // console.log('editItem', this.editItem)
  },

  methods: {
    ...mapMutations('recorded', [
      'UPDATE_STATE'
    ]),

    /** 点击返回 */
    confirmBack() {
      this.dialogVisible = true
    },

    /** 确认返回 */
    goBack() {
      this.dialogVisible = false
      this.UPDATE_STATE({ currentKey: 0 })
      this.$router.push({ name: 'recorded' })
    },

    /** tab切换 */
    changeTab(tab) {
      console.log(tab)
    }
  }
}
</script>

<style lang="scss" scoped>
.page_box /deep/{
  position: relative;
   .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2), .el-tabs--bottom .el-tabs__item.is-top:nth-child(2), .el-tabs--top .el-tabs__item.is-bottom:nth-child(2), .el-tabs--top .el-tabs__item.is-top:nth-child(2){
      padding-left: 15px;
    padding-right: 15px;
   }
   .el-tabs--bottom .el-tabs__item.is-bottom:last-child, .el-tabs--bottom .el-tabs__item.is-top:last-child, .el-tabs--top .el-tabs__item.is-bottom:last-child, .el-tabs--top .el-tabs__item.is-top:last-child{
     padding-right: 25px;
    padding-left: 25px;
   }
  .page_title {
    line-height: 49px;
    border-bottom: 1px solid #eee;
    padding-left: 20px;
    margin-bottom: 20px;

    a:hover {
      color: #46B6EE;
    }

    .title_line {
      font-size: 16px;
      color: #ddd;
      margin: 0 10px;
    }
  }
}

.page_box /deep/{
  .el-tabs__nav-scroll{
    padding-left: 20px;
  }
  .el-tabs__content{
    padding: 0;
  }
  .el-tabs__item{
    background: #F7F7F7;
    color: #666;
  }
  .el-tabs__item.is-active{
    background: #fff;
  }
}

</style>
