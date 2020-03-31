<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    title="添加学员"
    width="430px"
    append-to-body>
    <div class="form">
      <el-form ref="ruleForm" :model="ruleForm" label-width="100px" label-suffix=":">
        <el-form-item
          label="添加方式"
          prop="type"
        >
          <el-radio-group v-model="ruleForm.type">
            <el-radio label="1">按学员添加</el-radio>
            <el-radio label="2">按班级添加 </el-radio>
          </el-radio-group>

        </el-form-item>
        <el-form-item
          :label="ruleForm.type==='1' ? '学员信息':'选择班级'"
          prop="type"
        >
          <template v-if="ruleForm.type==='1'">
            <StuSelect
              v-model="ruleForm.stuId"
              :type ="'readAndWangStu'"
              :disabled="isDisabled"
              :edit-info="editInfo"
              :multiple="multiple"
              placeholder="请选择学员"
              show-type
              width="170px"
              no-month
              @select="stuChange"
            />
          </template>
          <template v-if="ruleForm.type==='2'">
            <el-select
              v-model="ruleForm.classId"
              placeholder="请选择"
              style="width:170px"
              clearable
              filterable
              @change="chooseClass"
            >
              <el-option
                v-for="(item, index) of classStu"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <span style="color:#999999;font-size:14px">已选择{{ num || 0 }}位学员</span>
          </template>
        </el-form-item>
        <div class="selectDate">
          <el-form-item
            label="观看有效期至"
            prop="type"
          >
            <el-radio-group v-model="ruleForm.Datetype">
              <el-radio label="1">无限期 <span style="color:#F56C6C;font-size:12px;margin-left:20px;">*默认为2099-12-31</span></el-radio>
              <el-radio label="2">指定日期
                <el-date-picker
                  v-model="ruleForm.specialTime"
                  :clearable="true"
                  :picker-options="pickerOptions"
                  placeholder="请选择日期"
                  value-format="yyyy-MM-dd"
                  style="width:150px;margin-left:10px;"
                />
              </el-radio>
            </el-radio-group>

          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="editLoading" @click="dialogVisible = false">取 消</el-button>
      <el-button :loading="editLoading" type="primary" @click="save()">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import { clsList, clsStuList } from '@/api/teachManage/onlineLesson'
import StuSelect from '@/components/StuSelect'
// import { coursewareStuQuery } from '@/api/teachManage/onlineLesson'
export default {
  components: {
    StuSelect
  },
  props: {
    getTable: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      multiple: true,
      ruleForm: {
        type: '1',
        Datetype: '1',
        classId: '',
        stuId: '',
        specialTime: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time && ((time.valueOf() < Date.now() - 24 * 60 * 60 * 1000))
        }
      },
      classStu: [],
      num: '', // 班级人数
      selStuId: [], // 已选学员的id
      editInfo: {},
      isDisabled: false

    }
  },

  computed: {
    ...mapState('recorded', [
      'editLoading',
      'currentItem',
      'courseId'
    ])
  },
  watch: {
    'ruleForm.type'(val) {
      if (val === '2') {
        this.num = ''
        this.ruleForm.classId = ''
        this.getClsList()
        this.selStuId = []
      }
      if (val === '1') {
        this.num = ''
        this.ruleForm.classId = ''
        this.selStuId = []
      }
    }
  },
  // mounted() {
  //   this.getClsList()
  // },
  methods: {
    ...mapActions('recorded', [
      'stuAdd'
    ]),

    /** 显示 */
    show(row) {
      this.dialogVisible = true
      this.row = row
    },
    stuChange(val) {
      // console.log('0000000', val)
      if (val) {
        this.selStuId = val
      } else {
        // this.addFollowData.parentId = ''
      }
    },
    // 加载班级列表
    getClsList() {
      clsList().then(res => {
        if (res.data.errorCode === 0) {
          this.classStu = res.data.clsList
        }
      })
    },

    // 选择班级val
    chooseClass(val) {
      clsStuList({ clsId: val }).then(res => {
        this.num = 0
        if (res.data.errorCode === 0) {
          if (res.data.stuList && res.data.stuList.length > 0) {
            this.selStuId = res.data.stuList
            this.num = res.data.stuList.length
          }
        }
      })
    },
    // 回调
    refresh() {
      this.ruleForm = {
        type: '1',
        Datetype: '1',
        classId: '',
        stuId: '',
        specialTime: ''
      }
      this.$refs.ruleForm.resetFields()
      this.dialogVisible = false
      this.getTable({ pageIndex: 0 })
    },
    /* 获取信息 */
    getMsg() {

    },
    /** 保存 */
    save() {
      let validTime
      if (this.ruleForm.Datetype === '1') {
        validTime = '2099-12-31'
      } else {
        validTime = this.ruleForm.specialTime
      }
      if (validTime === '' || validTime === null) {
        this.$message.error('请选择有效期')
      }
      const arr = []
      if (this.ruleForm.type === '1') {
        this.selStuId.forEach(item => {
          console.log('item', item)
          arr.push({
            stuId: item,
            validTime: validTime
          })
        })
      } else if (this.ruleForm.type === '2') {
        console.log('this.selStuId', this.selStuId)
        this.selStuId.forEach(item => {
          console.log('item', item)
          arr.push({
            stuId: item.stuId,
            validTime: validTime
          })
        })
      }
      if (this.selStuId.length <= 0) {
        this.$message.error('请选择学员')
      } else {
        const params = {
          cwId: this.courseId,
          stuJson: JSON.stringify(arr)
        }
        // console.log('params', params)
        this.stuAdd({ params, refresh: this.refresh })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// .form /deep/{
//      .el-select{
//   width: 170px !important;
// }

// }
.selectDate{
 .el-radio-group{
     margin-top:10px;
 }
 .el-radio+.el-radio{
        margin-left: 0px;
        margin-top: 10px;
 }

}
</style>
