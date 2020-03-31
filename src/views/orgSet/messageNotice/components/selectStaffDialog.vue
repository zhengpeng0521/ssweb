<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    title="选择员工"
    width="600px"
    class="selectStaffDialog"
    @click="handleClose"
  >
    <!-- 选择员工样式 -->
    <div class="selectStaffAll">
      <div class="selectStaffTop">

        <div class="selectStaffTopLeft">
          <!-- 搜索小框 -->
          <div class="selectStaffTopLeftTop">
            <el-input
              v-model="serchName"
              style="width:172px; height:28px;"
              placeholder="搜索员工"
              @input="serchStaff"
            >
              <i
                slot="prefix"
                class="el-input__icon el-icon-search"
              />
            </el-input>
          </div>

          <!-- 部门树形结构 -->
          <div class="selectStaffTopLeftBot">

            <!-- <div class="treeName">全员</div> -->
            <el-tree
              ref="tree"
              :data="treeDataList"
              :expand-on-click-node="false"
              :props="defaultTreeProps"
              :show-checkbox="true"
              :check-strictly="true"
              default-expand-all
              node-key="value"
              @node-click="handleNodeClick"
              @check-change="checkChange"
            >
              <!-- <span slot-scope="{ node, data }" class="custom-tree-node">

                <i v-show="data.status === '0'" class="el-icon-share"/>
                <i v-show="data.status === '1'" class="el-icon-edit"/>
                <i v-show="data.status === '2'" class="el-icon-edit"/>
                <span>{{ node.label }}</span>

              </span>-->
            </el-tree>
          </div>
        </div>

        <!-- 部门人员 -->
        <div class="selectStaffTopRight">
          <p>{{ selectBranch.label }}</p>
          <el-tree
            ref="DataTree"
            :data="tableData"
            :props="defaultDataTreeProps"
            :render-content="renderContent"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
            @check-change="checkDataChange"
          />
        </div>
      </div>
      <div class="selectStaffBottom">
        <div class="selBotDeta">
          已选：
          <span
            v-for="(item ,index) in getCheckedArray"
            :key="item.value"
          >
            <i style=" background: rgba(70, 182, 238, 0.2);border-radius: 12px;color: rgba(29, 157, 242,1);">{{ item.label }}</i>
            <i class="el-icon-circle-close close" @click="delgetCheckedArray(item.value,index)" />
          </span>

          <span
            v-for="(item,index) in selectName"
            :key="item.id"
          >
            <i>{{ item.name }}</i>
            <i class="el-icon-circle-close close" @click="delselectName(item.id,index)" />
          </span>
        </div>
      </div>
    </div>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        type="primary"
        @click="submit"
      >保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  formatList, // 部门数据
  queryList // 员工筛选
} from '@/api/orgSet/staffSet'
import {
  addReceiver, // 消息 ~ 接收人~ 添加接收人
  queryTemp // 消息通知 ~ 消息设置信息
} from '@/api/orgSet/messageNotice.js'
function deepDeptUpdate(target, arr) {
  target.forEach(item => {
    if (arr.indexOf(item.id) !== -1) {
      item.status = '2'
    } else {
      item.status = '0'
    }
    item.children && item.children.length > 0 && deepDeptUpdate(item.children, arr)
  })
}
export default {
  components: {
  },
  data() {
    return {
      messageData: {}, // 父类传过来的数据
      serchName: '', // 搜索员工姓名
      treeDataList: [], // 部门数据
      selectBranch: {}, // 点击的部门数据
      tableData: [], // 点击部门的人员数据
      tableDataCopy: [],
      tableDataId: [], // 所有人员数据id

      getCheckedArray: [], // 选择的部门
      getCheckedArrayId: [], // 选中部门的id
      selectName: [], // 选中的人员
      selectNameId: [], // 选中人员的id
      deptUserCache: {}, // 部门人员缓存
      showCheckBox: true,
      dialogVisible: false,
      defaultTreeProps: {
        children: 'children',
        label: 'label'
      },
      defaultDataTreeProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      }
    }
  },

  mounted() {
    this.getDepartList()
  },

  methods: {
    // 显示弹框
    showDialog(value) {
      console.log(value)
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: false,
        target: document.querySelector('.selectStaffTopLeftBot')
      })
      const loadingone = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: false,
        target: document.querySelector('.selectStaffTopRight')
      })
      const loadingtwo = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: false,
        target: document.querySelector('.selectStaffBottom')
      })

      setTimeout(() => {
        loading.close()
        loadingone.close()
        loadingtwo.close()
      }, 500)
      this.dialogVisible = true
      this.messageData = value
      this.selectName = []
      const params = {
        status: '1',
        pageSize: 99999
      }
      queryList(params).then(res => {
        this.tableDataCopy = res.data.results
      })
      this.queryTempFun(value)
    },

    queryTempFun(value) {
      queryTemp().then(res => {
        console.log(res)
        res.data.results.map(itemResults => {
          if (itemResults.type === value.type) {
            itemResults.deptList.map(item => {
              this.getCheckedArrayId.push(Number(item.id))
            })
            itemResults.userList.map(item => {
              this.selectNameId.push(Number(item.userId))
            })

            const deptListPush = this.getCheckedArrayId
            this.getCheckedArrayId = [...new Set(deptListPush)]
            const userListPush = this.selectNameId
            this.selectNameId = [...new Set(userListPush)]

            this.tableDataCopy.forEach(res => {
              this.selectNameId.forEach(item => {
                if (res.id === item) {
                  const indexRef = this.tableDataCopy.indexOf(res)
                  this.selectName.push(...this.tableDataCopy.slice(indexRef, indexRef + 1))
                  const selectNamePush = this.selectName
                  this.selectName = [...new Set(selectNamePush)]
                }
              })
            })
            this.$nextTick(() => {
              this.$refs.tree.setCheckedKeys(this.getCheckedArrayId)
              this.$refs.DataTree.setCheckedKeys(this.selectNameId)
            })

            // this.$nextTick(() => {
            //   this.$refs.DataTree.setCheckedKeys(this.selectNameId)
            // })
            // setTimeout(() => {
            //   this.$refs.tree.setCheckedKeys(this.getCheckedArrayId)
            // }, 400)
            // setTimeout(() => {
            //   this.$refs.DataTree.setCheckedKeys(this.selectNameId)
            // }, 400)
          }
        })
      })
    },

    // 部门展示
    getDepartList() {
      formatList().then(res => {
        console.log(res)
        if (res.data.errorCode === 0) {
          this.deptsOptions = res.data.results
          const treeData = [{
            label: '全校区',
            children: res.data.results
          }]
          deepDeptUpdate(treeData, [])
          this.treeDataList = treeData
          // this.treeDataList = JSON.parse(JSON.stringify(treeData))
          console.log(this.treeDataList)
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    async getDeptUsers(deptId) {
      let users = this.deptUserCache[deptId] || []
      if (!users || users.length === 0) {
        const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          fullscreen: false,
          target: document.querySelector('.selectStaffTopRight')
        })
        const params = {
          deptId: deptId,
          status: '1',
          pageSize: 99999
        }
        try {
          const res = await queryList(params)
          loading.close()
          if (res.data.errorCode === 0) {
            users = res.data.results
            this.deptUserCache[deptId] = users
            if (this.getCheckedArrayId.indexOf(res.value) !== -1) {
              res.data.disabled = true
              this.tableData.push(res)
            // this.selectNameId.push(item.id)
            }
          }
        } catch (e) {
          console.log(e)
        }
      }
      return users
    },

    // 点击节点后筛选员工
    async handleNodeClick(data, node) {
      // data.status = data.status === '0' || data.status === '1' ? '2' : '0'
      // console.log(data)
      await this.getDeptUsers(data.value)
      // console.log(this.deptUserCache)
      const users = this.deptUserCache[data.value] || []
      // console.log('Users', users)
      this.tableData = []
      users.forEach(item => {
        // item.disabled = true
        this.tableData.push(item)
        // this.selectNameId.push(item.id)
      })
      // console.log('tableData', this.tableData)
      // setTimeout(() => {
      //   this.$refs.DataTree.setCheckedKeys(this.selectNameId)
      // }, 400)
      // console.log(this.treeDataList)
      // const loading = this.$loading({
      //   lock: true,
      //   text: '拼命加载中',
      //   fullscreen: false,
      //   target: document.querySelector('.selectStaffTopRight')
      // // })
      // this.selectBranch = data
      // const params = {
      //   deptId: data.value,
      //   status: '1',
      //   pageSize: 99999
      // }
      // this.tableData = []
      // queryList(params).then(res => {
      //   console.log(res)
      //   res.data.results.filter(item => {
      //     if (this.getCheckedArrayId.indexOf(data.value) !== -1) {
      //       // item.disabled = true
      //       this.tableData.push(item)
      //       //this.selectNameId.push(item.id)
      //     }
      //     // console.log(item)
      //     this.tableData.push(item)
      //     // if (!this.selectNameId.indexOf(item.id)) {
      //     //   this.noelection = true
      //     //   this.share = false
      //     // } else if (this.selectNameId.indexOf(item.id)) {
      //     //   this.allelection = true
      //     //   this.share = false
      //     // }
      //   })
      // })
      // loading.close()
      // // this.$nextTick(() => {
      // //   this.$refs.DataTree.setCheckedKeys(this.selectNameId)
      // // })
      // setTimeout(() => {
      //   this.$refs.DataTree.setCheckedKeys(this.selectNameId)
      // }, 400)
    },

    // 选中的部门
    checkChange(data, checked, indeterminate) {
      // this.handleNodeClick(data)
      // console.log(checked)
      this.getCheckedArray = this.$refs.tree.getCheckedNodes()
      const getCheckedArrayId = []
      this.getCheckedArray.map(item => {
        // item.disabled = true
        getCheckedArrayId.push(item.value)
      })
      this.getCheckedArrayId = [...new Set(getCheckedArrayId)]
      setTimeout(() => {
        this.$refs.DataTree.setCheckedKeys(this.selectNameId)
        // this.$refs.tree.setCheckedKeys(this.getCheckedArrayId)
      }, 400)
    },
    // 搜索员工
    serchStaff() {
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: false,
        target: document.querySelector('.selectStaffTopRight')
      })
      const params = {
        name: this.serchName,
        status: '1',
        pageSize: 99999
      }

      queryList(params).then(res => {
        this.tableData = res.data.results
      })
      loading.close()
    },

    // 树节点后面加内容
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}{data.deptName ? `(${data.deptName})` : null}</span>
          <span>
            <el-tooltip content='未绑定微信' placement='top'>
              <span v-show={data.isWechatBind !== true} class='el-icon-warning' style='color:#FBB323;margin-left:2px;' />
            </el-tooltip>
          </span>
        </span>
      )
    },

    // 选择人员
    checkDataChange(data, checked, indeterminate) {
      // 判定数组中是否有这一项
      const results = this.selectNameId.some(item => {
        console.log(item)
        return item === data.id
      })
      if (results === false && checked === true) { // 没有这个值，选中
        this.selectName.push(data)
        this.selectNameId.push(data.id)
      } else if (results === true && checked === false) { // 有这个值，删除
        const selecIndex = this.selectNameId.indexOf(data.id)
        this.selectNameId.splice(selecIndex, 1)

        const selectNameSplice = this.selectName
        selectNameSplice.map(item => {
          if (item.id === data.id) {
            const selectNameIndex = this.selectName.indexOf(item)
            this.selectName.splice(selectNameIndex, 1)
            console.log(selectNameIndex)

            // this.allelection = true
          }
        })
      }
    },
    delgetCheckedArray(value, i, data) {
      const index = this.getCheckedArrayId.indexOf(value)
      this.getCheckedArrayId.splice(index, 1)
      this.$refs.tree.setCheckedKeys(this.getCheckedArrayId)
      // this.selectName.splice(i, 1)
      this.getCheckedArray.splice(i, 1)
    },
    delselectName(id, i) {
      const index = this.selectNameId.indexOf(id)
      this.selectNameId.splice(index, 1)
      this.$refs.DataTree.setCheckedKeys(this.selectNameId)
      this.selectName.splice(i, 1)

      // this.selectNameId.splice(index, 1)
    },

    // 提交数据
    submit() {
      const params = {
        deptIds: this.getCheckedArrayId.join(','),
        userIds: this.selectNameId.join(','),
        type: this.messageData.type
      }
      addReceiver(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success(res.data.errorMessage)
          this.$emit('toParent')
          this.handleClose()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    // 关闭弹框
    handleClose() {
      this.dialogVisible = false
      this.getCheckedArrayId = []
      this.selectNameId = []
      this.selectName = []
      this.tableData = []
      this.serchName = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input /deep/ .el-input__prefix {
  left: -30px !important;
  right: 110px !important;
}

.el-table /deep/ .el-table__empty-block {
  margin-top: -5px;
  margin-left: -22px;
}
.el-table /deep/ th > .cell {
  font-size: 14px;
  font-weight: 400;
}
.el-table /deep/ td,
.el-table /deep/ th.is-leaf {
  border: 0;
  border-style: none;
}
.el-table::before {
  height: 0;
}
.selectStaffAll {
  width: 560px;
  height: 50px;
  .selectStaffTop {
    width: 560px;
    overflow: hidden;
    zoom: 1;
    .selectStaffTopLeft {
      width: 200px;
      float: left;
      border: 1px solid #ddd;
      .selectStaffTopLeftTop {
        width: 1005;
        height: 55px;
        padding: 14px;
        border-bottom: 1px solid #ddd;
      }
      .selectStaffTopLeftBot {
        width: 100%;
        height: 328px;
        overflow: auto;
        .treeName {
          margin: 14px 0 6px 8px;
        }
      }
    }
    .selectStaffTopRight {
      border: 1px solid #ddd;
      width: 360px;
      height: 385px;
      float: left;
      margin-left: -1px;
      overflow: auto;
      p {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFangSC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 16px;
        margin: 20px 0 30px 20px;
      }
      .selTable {
        margin-left: 8px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFangSC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }
    }
  }
  .selectStaffBottom {
    width: 560px;
    float: left;
    border: 1px solid #ddd;
    border-top: 0;
    margin-bottom: 20px;
    padding: 19px;
    line-height: 20px;
    overflow: hidden;
    .selBotDeta {
      span {
        display:inline-block;
        position: relative;
        margin: 2px;
        i {
          font-style: normal;
          display: inline-block;
          height: 24px;
          padding: 0 10px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFangSC;
          font-weight: 400;
          line-height: 24px;
          text-align: center;
        }
        .close {
          position: absolute;
          right: 0px;
          top: -10px;
          width: 10px;
          height: 10px;
          //border: 1px solid black;
        }
      }
    }
  }
  /deep/.allSelect {
    left: -25px;
  }
}
</style>
