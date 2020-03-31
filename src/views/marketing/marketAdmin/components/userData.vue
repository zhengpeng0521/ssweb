<template>
  <div class="userDataContainer">
    <CommonSearch
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />
    <div class="downloadBtn">
      <el-button
        v-if="hasBtn('204000003')"
        :disabled="disabled"
        plain
        @click="exportFormData"
      >导出</el-button>
    </div>
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :data-source="dataSource"
      :page-count="pageCount"
      table-key="marketing_marketAdmin_userData"
    />
  </div>
</template>
<script>
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import { formDataQuery, dictGetByKey, summaryQuery } from '@/api/marketing/marketAdmin.js'
import { exportFile } from '@/utils/exportFile.js'
export default {
  components: {
    CommonSearch,
    CommonTable
  },
  data() {
    return {
      // 导出按钮
      disabled: false,
      // 搜索参数
      formValue: {},
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'select',
            placeholder: '请选择采单地点',
            modelValue: 'key',
            labelKey: 'value',
            valueKey: 'key',
            isFilterable: true,
            isClearable: true,
            apiService: dictGetByKey,
            params: { dictkey: 'secondChannel' },
            itemStyle: 'width:140px'
          },
          {
            itemType: 'select',
            placeholder: '请选择采单人员',
            modelValue: 'userId',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            apiService: summaryQuery,
            labelKey: 'userName',
            valueKey: 'userId'
          },
          {
            itemType: 'datePicker',
            datePickerType: 'daterange',
            rangeSeparator: '~',
            startPlaceholder: '报名开始时间',
            endPlaceholder: '报名结束时间',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'date2'
          }
        ]
      },
      // 表格参数
      listQuery: {
        show: true, // 是否显示
        sizeChange: this.sizeChange,
        indexChange: this.indexChange
      },
      columns: [
        // {
        //   label: '学员姓名',
        //   prop: 'babyName',
        //   isShowSet: true,
        //   isShowTooltip: true,
        //   formatter: (row) => {
        //     return this.formatUserDataOfRow('babyName', row.formData)
        //   }
        // },
        // {
        //   label: '学员生日',
        //   prop: 'babyBirthday',
        //   isShowTooltip: true,
        //   isShowSet: true,
        //   width: 110,
        //   formatter: (row) => {
        //     return this.formatUserDataOfRow('babyBirthday', row.formData)
        //   }
        // },
        // {
        //   label: '联系方式',
        //   prop: 'tel',
        //   isShowTooltip: true,
        //   isShowSet: true,
        //   width: 120,
        //   formatter: (row) => {
        //     return this.formatUserDataOfRow('tel', row.formData)
        //   }
        // },
        // // {
        // //   label: '学员性别',
        // //   prop: 'babySex',
        // //   isShowTooltip: true,
        // //   isShowSet: true,
        // //   formatter: (row) => {
        // //     return this.formatUserDataOfRow('babySex', row.formData)
        // //   }
        // // },
        // // {
        // //   label: '家长关系',
        // //   prop: 'parentRelate',
        // //   isShowTooltip: true,
        // //   isShowSet: true,
        // //   formatter: (row) => {
        // //     return this.formatUserDataOfRow('parentRelate', row.formData)
        // //   }
        // // },
        // // {
        // //   label: '家长姓名',
        // //   prop: 'parentName',
        // //   isShowTooltip: true,
        // //   isShowSet: true,
        // //   formatter: (row) => {
        // //     return this.formatUserDataOfRow('parentName', row.formData)
        // //   }
        // // },
        // // {
        // //   label: '地址',
        // //   prop: 'address',
        // //   isShowSet: true,
        // //   isShowTooltip: true,
        // //   formatter: (row) => {
        // //     return this.formatUserDataOfRow('address', row.formData)
        // //   }
        // // },
        // // {
        // //   label: '小区',
        // //   prop: 'neighbourhood',
        // //   isShowSet: true,
        // //   isShowTooltip: true,
        // //   formatter: (row) => {
        // //     return this.formatUserDataOfRow('neighbourhood', row.formData)
        // //   }
        // // },
        // // {
        // //   label: '学校',
        // //   prop: 'school',
        // //   isShowSet: true,
        // //   isShowTooltip: true,
        // //   formatter: (row) => {
        // //     return this.formatUserDataOfRow('school', row.formData)
        // //   }
        // // },
        // // {
        // //   label: '是否会员',
        // //   prop: 'isVip',
        // //   isShowSet: true,
        // //   isShowTooltip: true,
        // //   formatter: (row) => {
        // //     return this.formatUserDataOfRow('isVip', row.formData)
        // //   }
        // // },
        // {
        //   label: '采集地点',
        //   prop: 'placeStr',
        //   isShowSet: true,
        //   isShowTooltip: true,
        //   width: 170
        // },
        // {
        //   label: '采集人员',
        //   prop: 'members',
        //   isShowSet: true,
        //   isShowTooltip: true,
        //   formatter: (row) => {
        //     if (row.memberName) {
        //       return `<span>${row.memberName}</span>`
        //     }
        //   }
        // },
        // {
        //   label: '报名时间',
        //   prop: 'createTime',
        //   isShowSet: true,
        //   isShowTooltip: true,
        //   width: 170
        // }
      ],
      options: {
        isSettingShow: false, // 是否出现设置
        noMount: true,
        params: { activityId: '' },
        apiService: formDataQuery // 表格的数据请求接口
      },
      tableHeight: 'calc(100vh - 233px)',
      pageSize: 10,
      pageIndex: 1,
      pageCount: 0,
      configMap: {}, // 配置项名称和key值,动态表头
      dataSource: [],
      searchValue: {}
    }
  },
  mounted() {
    // this.options.params = { activityId: this.$parent.id }
    // this.$refs.tableCommon.getList({ activityId: this.$parent.id })
    this.getList()
  },
  methods: {
    getList(val) {
      let params = {}
      this.columns = [
        {
          label: '学员姓名',
          prop: 'babyName',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row) => {
            return this.formatUserDataOfRow('babyName', row.formData)
          }
        },
        // {
        //   label: '学员生日',
        //   prop: 'babyBirthday',
        //   isShowTooltip: true,
        //   isShowSet: true,
        //   width: 110,
        //   formatter: (row) => {
        //     return this.formatUserDataOfRow('babyBirthday', row.formData)
        //   }
        // },
        {
          label: '联系方式',
          prop: 'tel',
          isShowTooltip: true,
          isShowSet: true,
          width: 120,
          formatter: (row) => {
            return this.formatUserDataOfRow('tel', row.formData)
          }
        },
        {
          label: '采集地点',
          prop: 'placeStr',
          isShowSet: true,
          isShowTooltip: true,
          width: 170
        },
        {
          label: '采集人员',
          prop: 'members',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row) => {
            if (row.memberName) {
              return `<span>${row.memberName}</span>`
            }
          }
        },
        {
          label: '报名时间',
          prop: 'createTime',
          isShowSet: true,
          isShowTooltip: true,
          width: 170
        }
        // {
        //   label: '兼职姓名',
        //   prop: 'partTime',
        //   isShowSet: true,
        //   isShowTooltip: true,
        //   formatter: (row) => {
        //     return this.formatUserDataOfRow('partTime', row.formData)
        //   }
        // }
      ]
      if (val) {
        params = {
          pageSize: this.pageSize,
          pageIndex: this.pageIndex - 1
        }
        Object.assign(params, val)
        this.$refs.tableCommon.pageIndex = 1
      } else {
        params = {
          ...this.searchValue,
          activityId: this.$parent.id,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex - 1
        }
      }
      let dataSource = []
      formDataQuery(params).then(res => {
        this.pageCount = res.data.data.resultCount
        dataSource = res.data.results
        this.configMap = res.data.configMap
        this.searchValue = params
        for (const config in this.configMap) {
          if (config === 'babyName' || config === 'tel') {
            // eslint-disable-line
          } else {
            const obj = {
              label: this.configMap[config],
              prop: config,
              width: 120,
              isShowTooltip: true
            }
            this.columns.push(obj)
          }
        }
        let formData = []
        if (dataSource && dataSource.length > 0) {
          dataSource.map(item => {
            formData = JSON.parse(item.formData)
            formData.map(form => {
              if (form.name || form.value) {
                item[form.name] = form.value
              } else {
                for (const i in form) {
                  if (form[i] && form[i].length > 0) {
                    item[i] = form[i].join(' ')
                  }
                }
              }
            })
          })
          this.dataSource = dataSource
        } else {
          this.dataSource = []
        }
      })
    },
    sizeChange(size) {
      this.pageSize = size
      this.getList()
    },
    indexChange(index) {
      this.pageIndex = index
      this.getList()
    },
    /** 格式化处理行数据 */
    formatUserDataOfRow(key, rowData) {
      let retValue = ''
      if (rowData && rowData.length > 0) {
        const userData = JSON.parse(rowData)
        userData.forEach(item => {
          if (item.name === key) {
            retValue = item.value
          }
        })
      }
      return retValue
    },
    /* 搜索 */
    searchHandle(formValue) {
      this.formValue = formValue
      if (this.formValue.date2 && this.formValue.date2.length > 0) {
        const obj = {
          pageSize: this.pageSize,
          pageIndex: 0,
          firstCreateTime: this.formValue.date2[0],
          endCreateTime: this.formValue.date2[1],
          place: this.formValue.key,
          sourceType: 1,
          sourceId: this.formValue.userId,
          activityId: this.$parent.id
        }
        const params = {}
        for (var i in obj) {
          if (obj[i] !== undefined) {
            params[i] = obj[i]
          }
        }
        this.getList(params)
      } else {
        const obj = {
          pageSize: 10,
          pageIndex: 0,
          firstCreateTime: '',
          endCreateTime: '',
          place: this.formValue.key,
          sourceType: 1,
          sourceId: this.formValue.userId,
          activityId: this.$parent.id
        }
        var params = {}
        for (var j in obj) {
          if (obj[j] !== undefined) {
            params[j] = obj[j]
          }
        }
        this.getList(params)
      }
    },
    // 导出方法
    exportFormData() {
      const path = '/ss-mic-provider/mic/MarketActivityQueryService/exportFormData'
      const params = {
        firstCreateTime: this.formValue.date2 && this.formValue.date2.length > 0 && this.formValue.date2[0],
        endCreateTime: this.formValue.date2 && this.formValue.date2.length > 0 && this.formValue.date2[1],
        place: this.formValue.key,
        activityId: this.$parent.id,
        tenantId: this.GLOBAL.tenantId,
        orgId: this.GLOBAL.orgId,
        sourceId: this.formValue.userId
      }
      if (params.sourceId) {
        params.sourceType = 1
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      exportFile(path, params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageSize: this.pageSize,
        pageIndex: 0,
        firstCreateTime: '',
        endCreateTime: '',
        place: '',
        sourceType: 1,
        sourceId: '',
        activityId: this.$parent.id
      }
      // this.$refs.tableCommon.getList(params)
      this.getList(params)
      this.formValue = {}
    }

  }
}

</script>
<style lang="scss" scoped>
.downloadBtn {
  position: absolute;
  top: 0;
  right: 0;
}
.userDataContainer {
  position: relative;
}
</style>

