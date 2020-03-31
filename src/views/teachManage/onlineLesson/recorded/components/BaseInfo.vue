<template>
  <div>
    <div :style="{height: `calc(100vh - ${boxHeight})`}" class="base_box">
      <BlockTitle>基本信息</BlockTitle>

      <el-form ref="baseForm" :model="ruleForm" label-width="100px" label-suffix=":">
        <el-form-item
          :rules="[
            { required: true, message: '课件名称不能为空'},
            { max: 30, message: '最多不超30字'}
          ]"
          label="课件名称"
          prop="name"
        >
          <el-input v-model="ruleForm.name" class="base_input" placeholder="最多不超过30个字"/>
        </el-form-item>

        <el-form-item
          :rules="[
            { max: 100, message: '最多不超100字'}
          ]"
          label="课件描述"
          prop="desc"
        >
          <el-input v-model="ruleForm.desc" :rows="4" type="textarea" class="base_textarea" placeholder="最多不超过100个字"/>
        </el-form-item>

        <el-form-item
          :rules="[
            { required: true, message: '封面不能为空', trigger: 'change' }
          ]"
          label="课件封面"
          prop="homePageUrl"
        >
          <el-upload
            ref="baseCover"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-preview="picPreview"
            :on-remove="picRemove"
            :file-list="fileList"
            :limit="1"
            class="base_cover"
            action="https://img.ishanshan.com/gimg/user/upload"
            list-type="picture-card"
          >
            <div>
              <i class="el-icon-plus" />
              <span>上传</span>
            </div>

            <div slot="tip" class="base_upload_tip">
              <p>建议尺寸16:9，支持上传图片格式：JPG、PNG</p>
              <p>上传图片大小不超过2M</p>
            </div>
          </el-upload>
          <el-dialog
            :visible.sync="preVisible"
            append-to-body
            custom-class="preview_img"
          >
            <div style="width:100%;height:100%;text-align:center">
              <img
                :src="previewImg"
                style="width:500px;"
                alt="预览"
              >
            </div>
          </el-dialog>
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '课件类型不能为空' }
          ]"
          style="margin-right:700px"
          label="课件类型"
          prop="type"
        >
          <el-radio-group v-model="ruleForm.type">
            <el-radio label="1">公开课

              <el-tooltip class="item" effect="dark" content="所有学员可查看课程" placement="right-start">
                <svg-icon
                  icon-class="yiwen"
                  style="color:#666666;width:15px;height:15px;"
                />
              </el-tooltip>
            </el-radio>
            <el-radio label="2">会员课
              <el-tooltip class="item" effect="dark" content="仅添加的学员可查看课程" placement="right-start">
                <svg-icon
                  icon-class="yiwen"
                  style="color:#666666;width:15px;height:15px;"
                />
              </el-tooltip>
            </el-radio>
          </el-radio-group>

        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '上架状态不能为空' }
          ]"
          label="上架状态"
          prop="status"
        >
          <el-radio-group v-model="ruleForm.status">
            <el-radio label="1">上架</el-radio>
            <el-radio label="2">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>

    <div class="base_btns" >
      <el-button :loading="loading" @click="goBack">取消</el-button>
      <el-button v-if="type === 'add'" :loading="loading" type="primary" @click="() => onSave('next')">保存并继续</el-button>
      <el-button v-if="type === 'add'" :loading="loading" type="primary" @click="() => onSave('back')">保存并退出</el-button>

      <el-button v-if="type === 'edit'" :loading="loading" type="primary" @click="editSave">保存</el-button>
    </div>

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import BlockTitle from '@/components/MiniCommon/BlockTitle'

export default {
  components: {
    BlockTitle
  },

  props: {
    type: {
      type: String,
      default: 'add'
    }
  },

  data() {
    return {
      // 表单
      ruleForm: {
        name: '',
        desc: '',
        homePageUrl: '',
        status: '1',
        type: '1'

      },

      fileList: [], // 上传列表
      preVisible: false, // 预览显示
      previewImg: '' // 当前预览图
    }
  },

  computed: {
    ...mapState('recorded', [
      'loading',
      'courseId'
    ]),

    boxHeight() {
      if (this.type === 'edit') {
        return '246px'
      } else {
        return '270px'
      }
    }
  },

  watch: {
    fileList(newProp) {
      this.$nextTick(() => {
        const uploadBox = document.querySelector('.base_cover .el-upload--picture-card')
        if (newProp && newProp.length > 0) {
          uploadBox.style.display = 'none'
        } else {
          uploadBox.style.display = 'inline-block'
        }
      })
    },

    // 修复上传组件不能重置表单检验问题
    'ruleForm.homePageUrl'(newProp) {
      if (newProp && newProp !== '') {
        this.$refs.baseForm.clearValidate(['homePageUrl'])
      }
    }
  },

  mounted() {
    if (this.type === 'edit') {
      this.getDetail()
    }
  },

  methods: {
    ...mapMutations('recorded', [
      'UPDATE_STATE'
    ]),
    ...mapActions('recorded', [
      'saveBaseInfo',
      'getCourseInfo',
      'updateCourseWare'
    ]),

    /** 编辑获取信息 */
    getDetail() {
      if (this.courseId) {
        const params = {
          id: this.courseId
        }
        this.getCourseInfo({ params, mapForm: this.mapForm })
      } else {
        this.$router.push({ name: 'recorded' })
      }
    },

    /** 编辑时信息注入 */
    mapForm(info) {
      this.ruleForm = {
        name: info.name,
        desc: info.desc,
        homePageUrl: info.homePageUrl,
        status: info.status,
        type: String(info.type)
      }
      this.fileList = [{ name: 'edit.jpg', url: info.homePageUrl }]
    },

    /** 上传文件之前的钩子 */
    beforeUpload(file) {
      const isAccept = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isAccept) {
        this.$message.error('请上传JPG或PNG格式图片!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isAccept && isLt2M
    },

    /** 上传成功 */
    uploadSuccess(response, file, fileList) {
      this.fileList = [...fileList]
      this.ruleForm.homePageUrl = response.url
    },

    /** 预览 */
    picPreview(file) {
      this.preVisible = true
      this.previewImg = file.url
    },

    /** 删除图片 */
    picRemove() {
      this.previewImg = ''
      this.fileList = []
      this.ruleForm.homePageUrl = ''
    },

    /** 取消 */
    goBack() {
      this.$router.push({ name: 'recorded' })
    },

    /** 继续 */
    goNext() {
      this.UPDATE_STATE({ currentStep: 1 })
    },

    /** 保存 */
    onSave(type) {
      this.$refs.baseForm.validate((valid) => {
        if (valid) {
          let callback = this.goBack
          if (type === 'next') {
            callback = this.goNext
          }
          console.log('this.ruleForm', this.ruleForm)
          this.saveBaseInfo({ values: this.ruleForm, callback })
        } else {
          return false
        }
      })
    },

    /** 编辑保存 */
    editSave() {
      this.$refs.baseForm.validate((valid) => {
        if (valid) {
          const params = {
            name: this.ruleForm.name,
            desc: this.ruleForm.desc,
            url: this.ruleForm.homePageUrl,
            status: this.ruleForm.status,
            type: this.ruleForm.type,
            id: this.courseId
          }
          this.updateCourseWare({ params, refresh: this.getDetail, isEdit: true })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.base_box {
  background: #F0F2F5;
  padding: 20px;
  margin: 0 20px;
  overflow: auto;
}

.base_input {
  width: 230px;
}
.base_textarea {
  width: 420px;
}

.base_upload_tip {
  p {
    line-height: 20px;
    font-size: 12px;
    color: #999;
  }
}

.base_btns {
  height: 49px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style lang="scss">
.preview_img {
  .el-dialog__header{
    height: 56px;
  }
  .el-dialog__body{
    padding: 0 !important;
  }
}
</style>
