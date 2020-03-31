<template>
  <div class="wrapWall">
    <el-row v-show="dis">
      <el-col :span="24">
        <div class="leftWidrh">
          <!-- 左边部分 -->
          <img
            src="https://img.ishanshan.com/gimg/n/20190708/4ca28e7af64c6ef059d96514d37d2351"
            width="16px"
            height="16px"
            style="margin:0 .5% 3px 0"
          >
          <span style="line-height: 1.4;">
            <span style="font-size:16px">您的<span
              v-for="item of list"
              :key="item.id"
            >「{{ item.mealTitle }}」套餐<span v-if="item.expireDays === 0">于今</span><span v-else>还剩{{ item.expireDays }}</span>天过期。</span>为了不影响后续使用，请尽快续费。</span>
            <span
              class="now"
              @click="now"
            >立即续费</span>
          </span>
        </div>
        <div>
          <!-- 删除按钮 -->
          <div
            class="close"
            @click="close"
          >今日不再提醒</div>
        </div>
      </el-col>
    </el-row>

    <!-- 弹出框 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="套餐过期"
      width="340px"
      center
    >
      <div style="text-align:center">
        <div style="line-height:2;color:#666"><span>您的</span><span
          v-for="(item,index) of expireResults"
          :key="item.id"
        >「{{ item.mealTitle }}」<span v-if="index === expireResults.length-1 ? false : true">、</span></span>套餐已经过期。</div>
        <div style="line-height:2;margin-bottom:14px;color:#666">为了不影响后续使用，请联系客服续费。</div>
        <img
          src="https://img.ishanshan.com/gimg/n/20190711/dc58ce8b397a0b39f3349b16f6f4db3c"
          width="80%"
        >
        <div class="tel"><span>客服热线: 400-600-5733</span></div>
      </div>
    </el-dialog>
    <!-- 续费弹框 -->
    <el-dialog
      :visible.sync="centerDialogXu"
      title="套餐续费"
      width="340px"
      center
    >
      <div style="text-align:center">
        <div class="sameWord">请联系客服续费</div>
        <img
          src="https://img.ishanshan.com/gimg/n/20190711/dc58ce8b397a0b39f3349b16f6f4db3c"
          width="80%"
        >
        <div class="tel">客服热线: 400-600-5733</div>
      </div>
    </el-dialog>
    <div class="showWrap">
      <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="500px"
        @close="closeDialog"
      >
        <div :style="back">
          <!-- <img src="https://img.ishanshan.com/gimg/n/20190715/cd9c8d73a1a2e90fa8f20a866e0f2156" class="imgA"> -->
          <div
            class="Course"
            @click="Course"
          />
          <div
            class="experience"
            @click="wrapImg"
          />
          <img
            :src="img[hoverIndex]"
            alt=""
            class="wrapImg"
            @mouseover="hoverIndex = 1"
            @mouseout="hoverIndex = 0"
            @click="wrapImg"
          >
        </div>
      </el-dialog>
    </div>
    <!-- 运营后台弹框 -->
    <div
      v-for="(item,index) in Operate"
      :key="item.id"
    >
      <!-- 只弹一次 -->
      <div v-if="item.frequency == 0" ref="testDom" class="showWrap showWrapO">
        <el-dialog
          :modal="false"
          :visible.sync="OperateVisible"
          :close-on-click-modal="false"
          width="700px">
          <div>
            <a :href="item.link" target="_blank">
              <img :src="item.image" alt="" class="imgA" height="580px">
            </a>
            <img
              :src="img[hoverIndex]"
              alt=""
              class="wrapImg"
              @mouseover="hoverIndex = 1"
              @mouseout="hoverIndex = 0"
              @click="wrapImgOp(index,item.frequency,item)"
            >
          </div>
        </el-dialog>
      </div>
      <!-- 每日都弹 -->
      <div v-else ref="testDom" class="showWrap showWrapO">
        <el-dialog
          :modal="false"
          :visible.sync="OperateVisible"
          :close-on-click-modal="false"
          width="700px">
          <div>
            <a :href="item.link" target="_blank">
              <img :src="item.image" alt="" class="imgA" height="580px">
            </a>
            <img
              :src="img[hoverIndex]"
              alt=""
              class="wrapImg"
              @mouseover="hoverIndex = 1"
              @mouseout="hoverIndex = 0"
              @click="wrapImgOp(index,item.frequency,item)"
            >
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { getInfoList, getInfoImg } from '@/api/home/home'
import { store, time, times } from '@/utils/time.js'
export default {
  data() {
    return {
      // 点击运营后台弹框
      number: 0,
      // 弹框hover
      hoverIndex: 0,
      // 头部弹窗数据 每日弹一次
      list: [],
      // 弹窗过期弹窗数据 只弹一次，有新的数据弹新的
      expireResults: [],
      // 运营后台弹窗数据
      Operate: [],
      // 运营后台弹框状态
      OperateVisible: false,
      // 顶部弹窗状态
      dis: false,
      // 套餐过期状态
      centerDialogVisible: false,
      // 新版本弹窗
      dialogVisible: false,
      // 续费弹窗状态
      centerDialogXu: false,
      data: {
        isHome: 1
      },
      datas: {
        status: 1
      },
      back: {
        backgroundImage: "url('https://img.ishanshan.com/gimg/n/20190715/cd9c8d73a1a2e90fa8f20a866e0f2156')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        height: '450px',
        borderRadius: '10px'
      },
      img: ['https://img.ishanshan.com/gimg/n/20190715/d99ef9e1123bfa771b38b04d8c04e8b5', 'https://img.ishanshan.com/gimg/n/20190715/ce8246fa16e012dd13f82573e2677772']
    }
  },
  created() {
    // 初始化的时候判断套餐缓存到期没
    time()
    times()
  },
  mounted() {
    // 版本弹框只弹一次 2019年7.22-8.22
    const firstDay = (new Date()).valueOf()
    const middleDay = new Date('2019/07/21 23:59:59').getTime()
    const lastDay = new Date('2019/08/22 23:59:59').getTime()
    const hideeT = localStorage.getItem('hideeT')
    if (firstDay >= middleDay && firstDay <= lastDay) {
      // 这个是在时间期间内
      if (hideeT === null || hideeT === undefined) {
        this.dialogVisible = true
      } else {
        this.dialogVisible = false
        this.getInfoImg()
      }
    } else {
      this.getInfoImg()
    }
  },
  methods: {
    getInfoImg() {
      getInfoImg(this.datas).then(res => {
        const data = res.data
        if (data.errorMessage === '成功') {
          if (data.results.length > 0) {
            const testFre = JSON.parse(localStorage.getItem('testFre'))
            if (testFre === null || testFre === undefined) {
              this.Operate = data.results
              this.OperateVisible = true
              // 缓存第一次的数据
              localStorage.setItem('testFre', JSON.stringify(data.results))
            } else {
              //  如果有新增(添加 或者编辑改变弹类型都会弹)
              const newLostorg = new Set(testFre)
              const newTan = new Set(data.results)
              const arr = [...newTan].filter(x => [...newLostorg].every(y => y.id !== x.id || y.frequency !== x.frequency))
              // 在后台请求接口返回不变的情况下 分为0 只弹一次 1 每天弹一次====>只弹为1的套餐
              if (arr.length === 0) {
                const keys = localStorage.getItem('names')
                if (keys === null || keys === undefined) {
                  const numarrd = data.results.filter(item => item.frequency === 1)
                  this.Operate = numarrd
                  this.OperateVisible = true
                } else {
                  this.OperateVisible = false
                  this.getInfoList()
                }
              } else {
                this.OperateVisible = true
                this.Operate = arr
                localStorage.setItem('testFre', JSON.stringify(data.results))
              }
            }
          } else {
            this.getInfoList()
          }
        }
      })
    },
    getInfoList() {
      getInfoList(this.data).then(res => {
        const data = res.data
        if (data.errorMessage === '成功') {
          const resultsL = data.mealResults.length
          const expireResultsL = data.expireResults.length
          // 头部的提示
          const key = localStorage.getItem('name')
          if (key === null || key === undefined) {
            if (resultsL > 0) {
              this.list = data.mealResults
              this.dis = true
            } else {
              this.dis = false
            }
          } else {
            this.dis = false
          }
          // 弹窗
          if (expireResultsL > 0) {
            this.expireResults = data.expireResults
          } else {
            this.centerDialogVisible = false
            return
          }
          const onida = JSON.parse(localStorage.getItem('test'))
          // console.log(onida)
          if (onida === null || onida === undefined) {
            localStorage.setItem('test', JSON.stringify(data.expireResults))
            this.centerDialogVisible = true
          } else {
            // 判断两个数组的内容是不是一样，一样的去掉，取新的数
            const newLostorg = new Set(onida)
            const newTan = new Set(data.expireResults)
            const arr = [...newTan].filter(x =>
              [...newLostorg].every(y => y.mealId !== x.mealId || y.orgId !== x.orgId || y.uid !== x.uid))
            // 如果arr为空 不显示反之显示（缓存 弹框赋予新数组）
            // console.log(arr)
            if (arr.length === 0) {
              this.centerDialogVisible = false
            } else {
              localStorage.setItem('test', JSON.stringify(data.expireResults))
              this.expireResults = arr
              this.centerDialogVisible = true
            }
          }
        }
      })
    },
    close() {
      this.dis = false
      // 缓存一个name为hxj作为20小时
      store('name', 'hxj', 20)
    },
    closeDialog() {
      // 不在提醒
      localStorage.setItem('hideeT', '123')
      this.getInfoImg()
    },
    wrapImg() {
      this.dialogVisible = false
    },
    wrapImgOp(index, frequency, item) {
      this.$refs.testDom[index].style.display = 'none'
      this.number++
      if (this.number === this.Operate.length) {
        this.getInfoList()
        store('names', 'hxja', 20)
      }
    },
    now() {
      this.centerDialogXu = true
    },
    Course() {
      window.open('https://jpss-crm.oss-cn-hangzhou.aliyuncs.com/%E6%96%B0%E7%B3%BB%E7%BB%9F%E5%8D%87%E7%BA%A7.mp4')
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapWall /deep/ .el-col-24 {
  background: #f56c6c;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  color: #fff;
}
.wrapWall /deep/ .el-dialog__body {
  padding: 20px !important;
}
.leftWidrh {
  width: 80%;
  display: flex;
  align-items: center;
}
.wrapWall /deep/ .el-button--mini,
.el-button--mini.is-round {
  color: #f56c6c;
  font-size: 13px;
}
.connect_popover_img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
.close {
  cursor: pointer;
}
.showWrap /deep/ .el-dialog {
  border-radius: 10px;
}
.showWrap /deep/ .el-dialog__header {
  display: none;
}
.showWrap /deep/ .el-dialog__body {
  padding: 0 !important;
}
.now {
  color: #f56c6c;
  background: #fff;
  border-radius: 14px;
  height: 28px;
  line-height: 28px;
  padding: 0 16px;
  margin-left: 10px;
  display: inline-block;
  cursor: pointer;
}
.tel {
  display: inline-block;
  color: #1d9df2;
  font-size: 16px;
  margin-top: 14px;
}
.sameWord {
  font-size: 20px;
  color: #666;
  margin-bottom: 20px;
}
.Course {
  position: absolute;
  bottom: 66px;
  left: 40%;
  width: 102px;
  height: 32px;
  cursor: pointer;
}
.experience {
  position: absolute;
  bottom: 32px;
  left: 44%;
  width: 60px;
  height: 20px;
  cursor: pointer;
}
.wrapImg {
  position: absolute;
  right: 0;
  top: 0;
  border-top-right-radius: 10px;
  cursor: pointer
}
.imgA {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 10px;
  width: 100%;
}
.showWrapO /deep/ .el-dialog__wrapper{
  background: rgba(0,0,0,.3);
}
.showWrapO /deep/ .el-dialog{
  margin-top: 11vh!important
}
</style>

