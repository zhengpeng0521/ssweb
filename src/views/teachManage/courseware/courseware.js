import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import { summeryQueryCat, print } from '@/api/teachManage/courseware'
import {
  // getCoursewareList,
  queryCourseware // 获取表单数据接口
} from '@/api/teachManage/courseware'
import TreeSelect from '@/components/SubUserSelect/SubUserSelect'
import { do_printImg } from '@/utils/printUtils'
import CoursewareOverdue from './dialog/coursewareOverdue'
import CoursewareCheck from './dialog/coursewareCheck'
import CoursewareVideo from './dialog/coursewareVideo'

// queryCourseware,

export default {
  components: {
    CommonSearch,
    CommonTable,
    CoursewareOverdue,
    CoursewareCheck,
    CoursewareVideo,
    TreeSelect
  },
  data() {
    return {
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '课件名称',
            modelValue: 'name',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'input',
            placeholder: '作者',
            modelValue: 'author',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          // {
          //   itemType: 'select',
          //   placeholder: '类目',
          //   modelValue: 'cat',
          //   isFilterable: true,
          //   isClearable: true,
          //   itemStyle: 'width:140px',
          //   valueKey: 'id',
          //   labelKey: 'name',
          //   apiService: summeryQueryCat // 是否从接口中获取
          // },
          {
            itemType: 'select',
            placeholder: '类型',
            modelValue: 'type',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '文档',
                value: '1'
              },
              {
                label: '图片',
                value: '2'
              },
              {
                label: '视频',
                value: '3'
              }
            ]
          }
        ]
      },
      columns: [
        {
          label: '课件名称',
          prop: 'name',
          isShowTooltip: true,
          width: '120',
          hasSort: true,
          render: (h, params) => {
            return h(
              'span',
              {
                class: 'coursewareName',
                on: {
                  click: () => {
                    this.toCoursewareDetail(params.row)
                  }
                }
              },
              params.row.name
            )
          }
          // formatter: row => {
          //   return `<div style="color:#46B6EE;overflow:hidden;text-overflow:ellipsis;word-break:break-all;white-space:norwap">
          //   ${row.name}</div>`
          // },
          // methods: row => {
          //   this.toCoursewareDetail(row)
          // }
        },
        {
          label: '作者',
          prop: 'author',
          isShowTooltip: true,
          width: '100'
        },
        {
          label: '类目',
          prop: 'catName',
          isShowTooltip: true,
          width: '100'
        },
        {
          label: '文件类型',
          prop: 'type',
          isShowTooltip: true,
          width: '100',
          formatter: row => {
            // eslint-disable-next-line
            if (row.type == '1') {
              return `文档`
              // eslint-disable-next-line
            } else if (row.type == '2') {
              return `图片`
              // eslint-disable-next-line
            } else if (row.type == '3') {
              return `视频`
            } else {
              return `--`
            }
          }
        },
        {
          label: '文件大小',
          prop: 'size',
          isShowTooltip: true,
          width: '100'
        },
        {
          label: '状态',
          prop: 'expire',
          isShowTooltip: true,
          width: '90',
          formatter: row => {
            // eslint-disable-next-line
            if (row.expire == '1') {
              return `正常`
              // eslint-disable-next-line
            } else if (row.type == '0') {
              return `已过期`
            } else {
              return `--`
            }
          }
        },
        {
          label: '到期时间',
          prop: 'expireTime',
          isShowTooltip: true,
          width: '100'
        },
        {
          label: '发布时间',
          prop: 'publishTime',
          hasSort: true,
          isShowTooltip: true,
          width: '100'
        }
      ],
      listQuery: {
        show: true // 是否显示
      },
      options: {
        apiService: queryCourseware, // 表格的数据请求接口
        params: {
          createOrder: '1'
        },
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 235px)',
      treeList: [],
      category: '', // 类目
      printCfg: '1' // 打印配置
    }
  },
  mounted() {
    this.getSummeryQueryCat()
    this.queryCoursewareFun()
  },
  computed: {
    operates() {
      return this.printCfg === '1' ? {
        width: '150',
        fixed: 'right',
        list: [{
          label: '打印',
          method: row => {
            this.toPrint(row)
          }
        }]
      }
        : undefined
    }
  },
  methods: {
    queryCoursewareFun() {
      const params = {
        createOrder: '1'
      }
      queryCourseware(params).then(res => {
        this.printCfg = res.data.print
      })
    },
    getSummeryQueryCat() {
      summeryQueryCat().then(res => {
        const data = res.data
        let catList = []
        const parentList = []
        const childList = []
        if (data.errorCode === 0) {
          catList = data.results
          catList.map(item => {
            // eslint-disable-next-line
            if (item.pid != '-1') {
              childList.push(item)
            } else {
              parentList.push(item)
            }
          })
          for (const i in parentList) {
            parentList[i].children = []
            for (const j in childList) {
              // eslint-disable-next-line
              if (parentList[i].id == childList[j].pid) {
                parentList[i].children.push(childList[j])
              }
            }
          }
          this.treeList = parentList
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      const params = {
        ...formValue,
        createOrder: '1',
        cat: this.category
      }
      this.$refs.tableCommon.getList(params)
      this.printCfg = this.$refs.tableCommon.tableAllData.print
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0,
        createOrder: '1'
      }
      this.category = ''
      this.$refs.tableCommon.getList(params)
    },
    handleSortChange(val) {
      if (val.prop === 'publishTime') { // 按照创建时间排序
        let createOrder = ''
        // eslint-disable-next-line
        if (val.order == 'ascending') { // 升序
          createOrder = '2'
          // eslint-disable-next-line
        } else if (val.order == 'descending') { // 降序
          createOrder = '1'
        }
        const params = {
          createOrder: createOrder,
          name: this.formInline.name,
          author: this.formInline.author,
          cat: this.formInline.cat,
          type: this.formInline.type
        }
        this.$refs.tableCommon.getList(params)
      } else if (val.prop === 'name') { // 按照课件名称排序
        let nameOrder = ''
        // eslint-disable-next-line
        if (val.order == 'ascending') { // 升序
          nameOrder = '2'
          // eslint-disable-next-line
        } else if (val.order == 'descending') { // 降序
          nameOrder = '1'
        }
        const params = {
          nameOrder: nameOrder,
          name: this.formInline.name,
          author: this.formInline.author,
          cat: this.formInline.cat,
          type: this.formInline.type
        }
        this.$refs.tableCommon.getList(params)
      }
    },

    /* 查看课件详情 */
    toCoursewareDetail(row) {
      // eslint-disable-next-line
      if (row.expire == '0') { // 课件过期，无法查看
        this.$refs.coursewareOverdue.show()
        // eslint-disable-next-line
      } else if (row.type == '3') { // video文件
        this.$refs.coursewareVideo.show(row)
      } else { // ppt课件
        this.$refs.coursewareCheck.show(row)
      }
    },

    createRandom(num, from, to) {
      var arr = []
      var json = {}
      while (arr.length < num) {
        // 产生单个随机数
        var ranNum = Math.ceil(Math.random() * (to - from)) + from
        // 通过判断json对象的索引值是否存在 来标记 是否重复
        if (!json[ranNum]) {
          json[ranNum] = 1
          arr.push(ranNum)
        }
      }
      return arr
    },
    /* 打印 */
    toPrint(row) {
      let imgArr = []
      const params = {
        coursewareId: row.coursewareId,
        checkStr: this.createRandom(16, 10, 99).join('')
      }
      // eslint-disable-next-line
      if (row.type == '3') {
        this.$message.error('只能打印文档')
      } else {
        print(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            imgArr = data.imgs
            if (imgArr && imgArr.length > 0) {
              do_printImg(imgArr)
            }
          } else {
            this.$message.error(data.errorMessage)
          }
        })
      }
    }
  }
}
