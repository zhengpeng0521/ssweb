<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    title="修改有效期"
    width="400px"
    append-to-body>
    <div class="form">
      <el-form ref="ruleForm" :model="ruleForm" label-width="100px" label-suffix=":">

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
import StuSelect from '@/components/StuSelect'
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
      ruleForm: {
        Datetype: '1',
        specialTime: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time && ((time.valueOf() < Date.now() - 24 * 60 * 60 * 1000) || (time.valueOf() > Date.now() + 365 * 24 * 60 * 60 * 1000))
        }
      }

    }
  },

  computed: {
    ...mapState('recorded', [
      'editLoading',
      'currentItem'
    ])
  },

  watch: {
    'ruleForm.Datetype'(val) {
      // console.log('val', val)
      // if (val === '1') {
      //   this.ruleForm.specialTime = '2099-12-31'
      // } else {
      //   this.ruleForm.specialTime = ''
      // }
    }
  },
  methods: {
    ...mapActions('recorded', [
      'updateStuTime'
    ]),

    /** 显示 */
    show(row) {
      this.dialogVisible = true
      this.row = row
      if (this.row instanceof Array) {
        // console.log('row', row)
        this.ruleForm.Datetype = '1'
        this.ruleForm.specialTime = ''
      } else if (row instanceof Object) {
        if (row.validTime !== '2099-12-31') {
          this.ruleForm.Datetype = '2'
          this.ruleForm.specialTime = row.validTime
        } else {
          this.ruleForm.Datetype = '1'
          this.ruleForm.specialTime = ''
        }
      }
    //   this.form.name = row.name
    //   this.form.desc = row.desc
    },
    // 回调
    refresh() {
      this.ruleForm = {
        Datetype: '1',
        specialTime: ''
      }
      this.$refs.ruleForm.resetFields()
      this.dialogVisible = false
      this.getTable({ pageIndex: 0 })
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
      let params
      if (this.row instanceof Array) {
        const stuArr = []
        let stuIds = ''
        this.row.map(item => {
          stuArr.push(item.id)
        })
        stuIds = stuArr && stuArr.join(',')
        params = {
          id: stuIds,
          validTime: validTime
        }
      } else if (this.row instanceof Object) {
        params = {
          id: this.row.id,
          validTime: validTime
        }
      }

      this.updateStuTime({ params, refresh: this.refresh })
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
