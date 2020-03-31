<template>
  <div>
    <el-dialog
      :visible.sync="chooseliveCodeDialogShow"
      :close-on-click-modal="false"
      title="直播邀请码"
      width="400px"
      @close="cancelDialog()"
    >

      <el-form>
        <el-form-item
          label="直播邀请码:"
          prop="title"
        >
          <el-input
            v-model="code"
            style="width:140px;"
            placeholder="请输入邀请码"
            @blur="(e) => codeBlur(e)"
          />
          <div style="color:#999999;font-size:12px;margin-left:80px;">*仅支持数字，英文大小写，最少4位，最多8位 </div>
        </el-form-item>
        <div style="color:#F56C6C;font-size:12px;margin-bottom:20px;">注：更改邀请码后，原邀请码失效，已进入直播间的学员不受影响</div>

      </el-form>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog()"
        >取 消</el-button>

        <el-button
          type="primary"
          style="float:right"
          @click="save()"
        >保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryDetail } from '../../api/online/liveLesson'
import { mapState, mapActions } from 'vuex'
// import {
//   confChannelEditResult
// } from '@/api/crm/studentInfo/lantentStu'
// import {
//   // summaryQueryUsers,
//   createStu,
//   getStuMsg // 学员详情
// } from '@/api/crm/studentInfo/readingStu.js'
export default {
  components: {

  },
  // props: {
  //   loadThemeInstList: {
  //     type: Function,
  //     default: undefined
  //   }
  // },
  data() {
    return {
      chooseliveCodeDialogShow: false,
      id: '',
      code: '',
      isCorrect: true

    }
  },
  methods: {
    ...mapActions('liveLesson', [
      'updateLiveRoom'

    ]),
    /* 显示弹框 */
    showDialog(row) {
      // console.log('row', row)
      this.id = row.id
      this.chooseliveCodeDialogShow = true
      const params = {
        id: row.id
      }
      queryDetail(params).then(res => {
        this.code = res.data.inviteCode
      })
    },
    /* 关闭弹框 */
    cancelDialog() {
      this.chooseliveCodeDialogShow = false
    },
    // 验证码校验
    codeBlur(e) {
      var str = RegExp('^[0-9A-Za-z]{4,8}$').test(e.target.value)
      if (!str) {
        this.isCorrect = false
      } else {
        this.isCorrect = true
      }
    },
    save() {
      if (this.isCorrect) {
        this.chooseliveCodeDialogShow = false
        const params = {
          id: this.id,
          inviteCode: this.code,
          type: '2'
        }
        const text = {
          text: '编辑'
        }
        this.updateLiveRoom({ params, text })
        setTimeout(() => {
          this.$emit('loadThemeInstList')
        }, 500)
      } else {
        this.$message.error('仅支持数字，英文大小写，最少4位，最多8位')
      }
    }

  }
}
</script>

<style lang="scss" scoped>

</style>

