<template>
  <div class="page_box">
    <!-- 标题 -->
    <div class="page_title">
      <a @click="confirmBack"><i class="el-icon-arrow-left"/>返回</a>
      <span class="title_line">|</span>
      <span>新增课件</span>
    </div>

    <!-- 内容 -->
    <el-steps :active="currentStep" class="content_steps" align-center>
      <el-step title="基本信息"/>
      <el-step title="上传章节视频"/>
      <el-step title="选择学员"/>
    </el-steps>

    <!-- 基本信息 -->
    <BaseInfo v-if="currentStep === 0" />
    <!-- 视频上传 -->
    <CourseVideo v-else-if="currentStep === 1" />
    <!-- 选择学员 -->
    <ChooseStu v-else-if="currentStep === 2" />
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="提示"
      width="500px">
      <div>您已录入的信息将不保存，是否返回？</div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="goBack">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
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
      dialogVisible: false
    }
  },

  computed: {
    ...mapState('recorded', [
      'currentStep'
    ])
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
      this.UPDATE_STATE({ courseId: '', currentStep: 0 })
      this.$router.push({ name: 'recorded' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page_box /deep/{
  position: relative;
   .el-step__line{
      //  background-color: #46B6EE;
    }
  .page_title {
    line-height: 49px;
    border-bottom: 1px solid #eee;
    padding-left: 20px;

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

.content_steps{
  padding: 20px 0;
}

</style>
