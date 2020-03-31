<template>
  <div class="role_content">
    <div class="biz-param_left">

      <div>
        <div class="role_title">
          <span style="margin-left: 5px;">业务名称</span>
        </div>

        <ul class="biz-param_items">

          <li
            v-for="(i,index) in leftItems"
            :key="i.typeName"
          >

            <div
              v-if="!i.editLi"
              class="no_edit edit_name"
            >

              <span
                class="text_block"
                @click="getItemDetail(i,index)"
              >
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover"
                >
                  <p> {{ i.annotation }}</p>
                  <!-- <i
                    slot="reference"
                    class="el-icon-info"
                  /> -->
                  <i
                    slot="reference"
                    class="iconfont icon_ym_ts"
                  />
                </el-popover>
                <span
                  :style="{ cursor: 'pointer' }"
                  :class="{active:i.isClick}"
                >
                  {{ i.typeName }}
                </span>
              </span>

              <span
                v-if="isShowLock(i,index)"
                class="fr"
                style="font-size: 14px;"
                @click="openLock(i,index)"
              >
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                >
                  <div>
                    <p>打开锁定，{{ i.typeName }} 可修改，</p>
                    <p> 关闭来源，{{ i.typeName }}无法修改</p>
                  </div>

                  <svg-icon
                    v-if="i.isLock=='2'"
                    slot="reference"
                    icon-class="icon_gb_lock"
                  />
                  <svg-icon
                    v-else
                    slot="reference"
                    icon-class="icon_gb_unlock"
                  />

                </el-popover>

              </span>
            </div>

          </li>
        </ul>
      </div>
    </div>

    <div class="biz-param_right">
      <div class="role">
        <p class="role_title1">业务参数</p>
        <p class="role_fix">*拖动可调整排序</p>
      </div>
      <ul @click="moveIn">
        <li
          v-for="(item,index) in hiderightItem"
          :key="index"
          class="wrapAll"
        >
          <span>{{ item.text }}</span>
          <el-popover
            placement="top-start"
            width="300"
            trigger="hover"
          >
            <p>从「{{ item.text }}」中采集到的学员</p>
            <i
              slot="reference"
              class="iconfont icon_ym_ts"
            />
          </el-popover>
        </li>
      </ul>
      <div class="biz-param_box">
        <draggable
          v-model="rightItems.items"
          v-bind="dragOptions"
          tag="ul"
          class="biz-param_items"
          @end="endMove"
          @change="change"
        >
          <transition-group type="transition">
            <li
              v-for="(i,index) in rightItems.items"
              :key="'transtion'+index"
            >
              <div
                v-if="!i.editLi"
                class="no_edit"
              >
                <span>
                  {{ i.text }}
                </span>
                <span v-if="i.access_control === '0'">
                  <el-popover
                    placement="top-start"
                    width="300"
                    trigger="hover"
                  >
                    <p v-if="i.text.includes('校区')">
                      从「校区的公海池」退回总部的学员，用于总部系统中
                    </p>
                    <p v-else-if="i.text.includes('总部')">
                      从「此校区的总部公海池」分配到此校区的学员
                    </p>
                    <p v-else-if="i.text.includes('直播')">
                      从「直播课程」中采集到的学员
                    </p>
                    <p v-else>从「{{ i.text }}」中采集到的学员</p>
                    <i
                      slot="reference"
                      class="iconfont icon_ym_ts"
                    />
                  </el-popover>
                </span>
                <span
                  v-else
                  class="fr"
                >
                  <el-button
                    :disabled="i.isEdit=='2'"
                    type="text"
                    @click="editItem(i,index)"
                  >编辑</el-button>

                  <el-popover
                    v-model="i.pop"
                    placement="top"
                    width="160"
                  >
                    <p style="margin-bottom: 10px"> <i class="el-icon-warning confirm-icon" />确定删除吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        size="mini"
                        class="delete_btn"
                        @click="i.pop = false"
                      >取消</el-button>
                      <el-button
                        type="primary"
                        class="edit_btn"
                        @click="deleteItem(i,index)"
                      >确定</el-button>
                    </div>
                    <el-button
                      slot="reference"
                      :disabled="i.isEdit=='2'"
                      type="text"
                    >删除</el-button>
                  </el-popover>
                </span>
              </div>
              <div
                v-if="i.editLi"
                class="no_edit edit_name"
              >

                <el-input
                  v-model="i.text"
                  placeholder="请输入业务参数名称"
                  clearable
                />
                <span
                  style="color:#46b6ee"
                  class="fr"
                >
                  <span @click="confirmEdit(i,index)">保存</span>
                  <span @click="cancelEdit(i,index)">取消</span>
                </span>
              </div>
            </li>
          </transition-group>
        </draggable>

      </div>
      <div class="right_bottom">

        <el-button
          :disabled="isAdd"
          type="primary"
          @click="addRightItem"
        >
          新增
        </el-button>
      </div>

    </div>

  </div>
</template>

<script>
// eslint-disable-next-line
import { dictList,updateSortOrder, saveChannel, confChannelEditResult, deleteDictItem, updateDictItem, addItem } from '@/api/orgSet/baseSet'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data() {
    return {
      editLi: false,
      visible2: false,
      isAdd: false,
      leftItems: [],
      newrightItems: [],
      rightItems: {},
      saveChannelData: [],
      channelArr: ['FIRSTCHANNELEDIT', 'SECONDCHANNELEDIT'],
      sortnumber: {},
      index: 0,
      sortparamas: {},
      paramas: {},
      paramObj: {},
      val: 0,
      hiderightItem: [] // 禁止拖放的数组
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200
        // group: this.type,
        // disabled: false,
        // ghostClass: 'ghost'
      }
    }
  },
  // watch: {
  //   rightItems: {
  //     handler(newName) {
  //       for (var i = 0; i < newName.items.length; i++) {
  //         console.log(i)
  //         if (newName.items[i].access_control === 0) {
  //           console.log(i)
  //         } else {
  //           this.newrightItems = newName.items[i]
  //         }
  //       }
  //     },
  //     deep: true,
  //     immediate: true
  //   }
  // },
  created() {
    this.getLockValue()
  },
  mounted() {
    // console.log(this.sortnumber)
    this.getDictList(this.val)
  },

  methods: {
    change(val) {
      if (!this.sortparamas.code) {
        this.paramObj.code = this.rightItems && this.rightItems.code
      } else {
        this.paramObj.code = this.sortparamas.code
      }
      this.paramObj.value = val.moved.element.value
    },
    /** 移动结束 */
    endMove(e) {
      // this.drag = false
      this.sortnumber.sortOrder = parseInt(e.newIndex + 1)// 可以知道拖动后的位置
      // console.log('sortOrder', this.sortnumber.sortOrder)
      const obj = {
        ...this.sortnumber,
        ...this.paramObj
      }
      obj.level = 'org'
      this.getnewDictList(obj)
    },
    getDictList(val) {
      dictList().then(res => {
        if (res.data.errorCode === 0) {
          this.leftItems = res.data.results
          // console.info('val', val)
          this.$nextTick(() => {
            if (val === 0) {
              const route = this.$router.history.current.params
              if (route && route.fromTab === 'microWeb') {
                const idx = this.leftItems.findIndex(item => item.dictItem && item.dictItem.code === 'organcategory')
                this.leftItems[idx].isClick = true
                this.rightItems = Object.assign({}, res.data.results[idx].dictItem)
              } else {
                this.leftItems[0].isClick = true
                // const rightItem = Object.assign({}, res.data.results[0].dictItem)
                // console.log(res.data.results[0].dictItem)
                // this.sameFunc(rightItem)
                this.rightItems = Object.assign({}, res.data.results[0].dictItem)
              }
              this.val = 1
            } else if (val === 1) {
              // console.log('index', this.index)
              // console.log(res.data.results[this.index].dictItem)
              // const rightItem = Object.assign({}, res.data.results[this.index].dictItem)
              this.leftItems[this.index].isClick = true
              this.rightItems = Object.assign({}, res.data.results[this.index].dictItem)
              // this.sameFunc(rightItem)
            } else {
              this.leftItems[this.index].isClick = true
              this.rightItems = Object.assign({}, res.data.results[this.index].dictItem)
              // const rightItem = Object.assign({}, res.data.results[this.index].dictItem)
              // this.sameFunc(rightItem)
            }
          })
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    getnewDictList(paramas) {
      updateSortOrder(paramas).then(res => {
        if (res.data.errorCode === 0) {
          // this.leftItems[0].isClick = true
          this.$message.success(res.data.errorMessage)
          this.getDictList(this.val)
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    getLockValue() {
      this.channelArr.forEach(v => {
        this.getConfChannelEditResult(v)
      })
    },

    getConfChannelEditResult(val) {
      const data = {
        confkey: val
      }
      confChannelEditResult(data).then(res => {
        if (res.data.errorCode === 0) {
          this.saveChannelData.push(res.data.value)
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    getItemDetail(val, index) {
      // console.info(' val.dictItem', val.dictItem)
      this.index = index
      this.sortparamas = val.dictItem
      this.leftItems.forEach(v => {
        if (v.isClick) {
          delete v.isClick
        }
      })

      const temp = Object.assign({}, val)
      temp.isClick = true

      this.leftItems.splice(index, 1, temp)

      if (val.typeName == this.$t('firstChannel.label')) {//eslint-disable-line

        temp.dictItem.items.forEach(v => {
          v.isEdit = this.saveChannelData[this.saveChannelData.length - 2]
        })
      }
      if (val.typeName == this.$t('secondChannel.label')) {//eslint-disable-line
        temp.dictItem.items.forEach(v => {
          v.isEdit = this.saveChannelData[this.saveChannelData.length - 1]
        })
      }
      this.$nextTick(() => {
        this.rightItems = Object.assign([], temp.dictItem)
        // this.sameFunc(rightItem)
      })
    },
    // sameFunc(rightItem) {
    //   const newArr = []
    //   const newArrs = []
    //   for (var i = 0; i < rightItem.items.length; i++) {
    //     if (rightItem.items[i].access_control !== '0') {
    //       // console.log(i)
    //       newArr.push(rightItem.items[i])
    //     } else {
    //       newArrs.push(rightItem.items[i])
    //     }
    //   }
    //   const arr = {
    //     code: rightItem.code,
    //     items: newArr
    //   }
    //   this.rightItems = arr
    //   this.hiderightItem = newArrs
    //   // console.log(newArrs)
    // },
    openLock(i, index) {
      this.getItemDetail(i, index)

      const data = {}
      // eslint-disable-next-line
      if (i.isLock == '2') {
        data.value = 1
      } else {
        data.value = 2
      }
      // eslint-disable-next-line
      if (i.typeName == this.$t('firstChannel.label')) {
        data.confKey = 'FIRSTCHANNELEDIT'
      } else {
        data.confKey = 'SECONDCHANNELEDIT'
      }
      saveChannel(data).then(res => {
        if (res.data.errorCode === 0) {
          this.getLockValue()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    isShowLock(val) {
      if (val.typeName === this.$t('firstChannel.label')) {
        val.isLock = this.saveChannelData[this.saveChannelData.length - 2]
        // val.dictItem.isEdit = this.saveChannelData[this.saveChannelData.length - 2]
      }
      if (val.typeName === this.$t('secondChannel.label')) {
        val.isLock = this.saveChannelData[this.saveChannelData.length - 1]
        // val.dictItem.isEdit = this.saveChannelData[this.saveChannelData.length - 1]
      }

      // this.$forceUpdate()
      if (val.typeName === this.$t('firstChannel.label') || val.typeName === this.$t('secondChannel.label')) {
        return true
      }
    },

    isEdit(val) {
      if (val.isEdit == '1') {//eslint-disable-line
        return true
      } else {
        return false
      }
    },
    editItem(i, index) {
      const temp = Object.assign({}, i)
      temp.editLi = true
      this.rightItems.items.splice(index, 1, temp)
      this.$forceUpdate()
    },

    confirmEdit(val, index) {
      // console.log('val', val)
      // console.log('index', index)
      if (val.text.length > 0) {
        this.isAdd = false
        val.editLi = false
        const data = {
          code: this.rightItems.code,
          value: val.value,
          text: val.text,
          level: 'org'
        }
        if (val.value) {
          updateDictItem(data).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success(res.data.errorMessage)
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        } else {
          const timestamp = (new Date()).valueOf()
          const newObj = {
            code: this.rightItems.code,
            value: String(timestamp),
            text: val.text,
            level: 'org',
            key: String(timestamp)

          }
          addItem(newObj).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success(res.data.errorMessage)
              this.getDictList()
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        }

        this.rightItems.items.splice(index, 1, val)
      } else {
        this.$message({
          message: '请输入内容',
          type: 'warning'
        })
      }
    },

    cancelEdit(i, index) {
      const temp = Object.assign({}, i)
      this.isAdd = false
      delete temp.editLi
      if (i.access_control) {
        this.rightItems.items.splice(index, 1, temp)
      } else {
        this.rightItems.items.splice(index, 1)
      }

      this.$forceUpdate()
    },

    deleteItem(val, index) {
      this.visible2 = true
      const data = {
        code: this.rightItems.code,
        value: val.value,
        status: 0,
        level: 'org'
      }

      updateDictItem(data).then(res => {
        if (res.data.errorCode === 0) {
          this.rightItems.items.splice(index, 1)
          this.$nextTick(() => {
            this.rightItems = Object.assign({}, this.rightItems)
          })
          // this.getDictList()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    addRightItem() {
      const data = {
        pop: false,
        text: '',
        editLi: true
      }
      this.rightItems.items.push(data)
      this.isAdd = true
    },
    moveIn() {
      this.$message({
        message: '不可拖拽区域',
        center: true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapAll {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #ddd;
  color: #666666;
}
.role_content {
  height: calc(100vh - 156px);
  overflow: auto;
  margin-bottom: 20px;
}
.active {
  color: #46b6ee;
}
.biz-param_left {
  border: 1px solid #f0f2f5;
  border-radius: 5px;
  overflow: auto;
  // max-height: 500px;
  float: left;
  width: 45%;
}
.biz-param_right {
  width: 50%;
  float: left;
  border: 1px solid #f0f2f5;
  border-radius: 5px;
  overflow: hidden;
  // padding-left: 92px;
  margin-left: 20px;
  .el-tree {
    margin-top: 20px;
  }
}
.role_title {
  font-size: 14px;
  background-color: #f0f2f5;
  line-height: 50px;
  color: #333333;
  padding: 0 20px;
}
.role {
  display: flex;
  background-color: #f0f2f5;
  line-height: 50px;
  justify-content: space-between;
  .role_title1 {
    font-size: 14px;
    background-color: #f0f2f5;
    line-height: 50px;
    color: #333333;
    padding: 0 20px;
  }
  .role_fix {
    margin-right: 20px;
    font-size: 14px;
    color: #999;
  }
}

.biz-param_box {
  display: flex;
  justify-content: space-around;
  li {
    cursor: In;
  }
  // padding: 20px;
}

.biz-param_tree {
  border: 1px solid #f0f2f5;
  padding: 20px;
  width: 40%;
  margin: 10px 0;
}

.right_bottom {
  text-align: end;
  padding: 20px;
  border-top: 1px solid #f0f2f5;
}
.biz-param_items {
  width: 100%;
  li {
    height: 50px;
    line-height: 50px;

    border-bottom: 1px solid #ddd;
    // margin: 0px 5px;
    color: #666666;
    // cursor: pointer;
    .fr {
      color: #ffffff;
    }
  }
}

.biz-param_items li:last-child {
  border-bottom: none;
}

.no_edit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px;
}
.edit_name {
  .el-input {
    width: 200px;
  }
  color: #666666;
}
.text_block {
  width: 300px;
  display: inline-block;
}
</style>
