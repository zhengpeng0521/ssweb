/**
 * 无限加载选择框
 *   下拉数据可以下拉动态加载
 * props
 *   参数           说明            类型          其他
 *   multiple       是否多选        {Bool}        默认false
 *   width          选择框宽度      {Str}         默认'260px'，可设置百分比
 *   classStu       班级学员列表    {Arr}         已经是班级学员的需要禁选
 *   type           学员类型        {Str}
 *   noMonth        选项不显示月份  {Bool}        默认false，true不显示月份，false不显示
 *   showType       显示学员类型    {Bool}        默认false，true显示，false不显示
 *   params         额外参数        {Obj}         额外提供的参数
 *   placeholder    占位符          {Str}
 *   disabled       禁用            {Bool}
 *   editInfo       编辑回显数据    {Obj}         有编辑情况时，用于回显编辑的选择数据
 *
 * events
 *   事件           说明                         参数
 *   onChange       选中值发生变化时触发          ids
 */
<template>
  <el-select
    v-loadmore="handleScroll"
    :value="value"
    :filter-method="onSearch"
    :multiple="multiple"
    :style="{width}"
    :placeholder="placeholder"
    :disabled="disabled"
    value-key="id"
    popper-class="big_data_select"
    clearable
    filterable
    @visible-change="showOptions"
    @change="onChange"
  >

    <el-option
      v-for="item in options"
      :key="item.id"
      :label="noMonth ? item[optKey] : type === 'nursery' ? `${item.name}(${Math.floor(item.month / 12)}岁)` : `${item.name}(${item.month}月)`"
      :value="item"
      :disabled="getDisabled(item)"
    >
      <template v-if="item.source || item.sourceType">
        <template v-if="showType">
          <template v-if="item.sourceType">
            <i :class="item.sourceType === 1 ? 'student_type_circle reading_type' :item.sourceType === 2 ? 'student_type_circle previous_type': 'student_type_circle'" />
          </template>
          <template v-else>
            <i :class="item.source === '1' ? 'student_type_circle reading_type' : 'student_type_circle'" />
          </template>
        </template>
      </template>
      <template v-else>
        <template v-if="type === 'reading'">
          <i v-if="showType" class="student_type_circle reading_type" />
        </template>
        <template v-else-if="type === 'latent'">
          <i v-if="showType" class="student_type_circle" />
        </template>
        <template v-else-if="type === 'wangStu'">
          <i v-if="showType" class="student_type_circle previous_type" />
        </template>
      </template>
      {{ noMonth ? item[optKey] : type === 'nursery' ? `${item.name}(${Math.floor(item.month / 12)}岁)` : `${item.name}(${item.month}月)` }}
    </el-option>
  </el-select>
</template>

<script>
import { queryCRMStuList } from '@/api/teachManage/grade'
import { queryClueStuList } from '@/api/teachManage/orderCourse'
import { queryCRMStuAndClueList } from '@/api/crm/financeMgr/financeMgr'
import { batchStuList } from '@/api/crm/stuAccount/stuAccount'
import { debounce } from '@/utils/debounce'
import { coursewareStuQuery } from '@/api/teachManage/onlineLesson'
import { mapState } from 'vuex'

export default {
  props: {
    multiple: {
      type: Boolean,
      default: false
    },

    width: {
      type: String,
      default: '260px'
    },

    classStu: {
      type: Array,
      default: () => []
    },

    value: {
      type: null,
      default: undefined
    },

    type: {
      type: String,
      required: true
    },

    noMonth: {
      type: Boolean,
      default: false
    },
    showType: {
      type: Boolean,
      default: false
    },
    showAll: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {}
    },

    placeholder: {
      type: String,
      default: '请选择'
    },

    disabled: {
      type: Boolean,
      default: false
    },

    editInfo: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      options: [], // 展示下拉
      optShow: false,
      arrNew: [],
      // value: '', // 单选值

      pageCount: 0,
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      query: {} // 搜索条件
    }
  },

  computed: {

    // 是否有更多
    noMore() {
      return this.pageIndex === this.pageCount
    },

    optKey() {
      if (this.type === 'useClass') {
        return 'stuName'
      } else {
        return 'name'
      }
    },
    ...mapState('recorded', [
      'courseId'
    ])
  },

  watch: {
    pageIndex(value) {
      console.log('页数', value)
    },
    options(value) {
      console.log('展示数据', value)
      this.arrNew = []
      coursewareStuQuery({ cwId: this.courseId }).then(res => {
        // console.log('res', res.data.results)
        res.data.results.forEach(item => {
          this.arrNew.push(
            item.stuId
          )
        })
      })
    },
    value(value) {
      // 编辑回显
      if (this.editInfo && Object.keys(this.editInfo).length > 0) {
        this.options = [this.editInfo]
      }
      // 解决回显问题
      if (!this.optShow) {
        this.options = value && Array.isArray(value) ? value : []
      }
      // 单选从精确查找回显
      if (!this.multiple && Object.keys(value).length > 0) {
        this.options = [value]
      }

      // console.log('选中=====================', value)
    },

    editInfo(value) {
      if (Object.keys(value).length > 0) {
        this.options = [value]
      }
    }
  },

  mounted() {
    // 编辑回显
    if (this.editInfo && Object.keys(this.editInfo).length > 0) {
      return
    }
    if (this.type === 'useClass') {
      return
    }

    this.getOptions(this.pageIndex, true)
  },

  methods: {

    /** 是否禁用 */
    getDisabled(row) {
      if (this.type === 'readAndWangStu') {
        // console.log('this.arrNew------', this.arrNew, row)

        return this.arrNew.indexOf(row.id) > -1
        // return false
      }
      if (this.type === 'vipReading') {
        return !row.stuCardId || row.stuCardId === ''
      } else {
        return this.classStu.indexOf(row.id) > -1
      }
    },

    onChange(value) {
      console.log('value=====', value)
      let ids
      if (this.multiple) {
        ids = []
        value.forEach(item => {
          ids.push(item.id)
        })
      } else {
        ids = value.id
      }

      this.$emit('input', value)
      this.$emit('onChange', ids)
    },

    /** 获取当前页下拉 */
    async getOptions(pageIndex, isDown) {
      this.loading = true
      const OPT_DOM = document.querySelector('.big_data_select')
      const loading = OPT_DOM && this.$loading({
        target: document.querySelector('.big_data_select'),
        lock: true,
        text: '加载中',
        fullscreen: false
      })

      let params = {
        ...this.query,
        pageIndex: pageIndex - 1,
        pageSize: this.pageSize
      }
      let queryList = queryCRMStuList
      let errText = '获取在读学员失败'

      if (this.type === 'reading') {
        // 获取在读
        params = {
          ...this.query,
          pageIndex: pageIndex - 1,
          pageSize: this.pageSize,
          type: '2',
          sourceType: 1
        }
        queryList = queryCRMStuList
        errText = '获取在读学员失败'
      } else if (this.type === 'latent') {
        // params = {
        //   sourceType: '0'
        // }
        // 获取潜在
        queryList = queryClueStuList
        errText = '获取潜在学员失败'
      } else if (this.type === 'all') {
        // 获取全部学员
        queryList = queryCRMStuAndClueList
        errText = '获取学员失败'
      } else if (this.type === 'useClass') {
        // 获取消课用全部学员
        params = {
          ...this.query,
          ...this.params,
          pageIndex: pageIndex - 1,
          pageSize: this.pageSize
        }
        queryList = batchStuList
        errText = '获取学员失败'
      } else if (this.type === 'vipReading' || this.type === 'allReading') {
        // 获取所有在读
        params = {
          sourceType: '1',
          pageIndex: pageIndex - 1,
          pageSize: this.pageSize,
          ...this.query
        }
        queryList = queryCRMStuList
        errText = '获取在读学员失败'
      } else if (this.type === 'nursery') {
        // 获取托班在读
        params = {
          ...this.query,
          pageIndex: pageIndex - 1,
          pageSize: this.pageSize,
          type: '1'
        }
        queryList = queryCRMStuList
        errText = '获取在读学员失败'
      } else if (this.type === 'realAll') {
        // 获取所有
        params = {
          ...this.query,
          pageIndex: pageIndex - 1,
          pageSize: this.pageSize,
          sourceType: -1
        }
        queryList = queryCRMStuAndClueList
        errText = '获取学员失败'
      } else if (this.type === 'wangStu') {
        params = {
          ...this.query,
          pageIndex: pageIndex - 1,
          pageSize: this.pageSize,
          sourceType: 2
        }
        queryList = queryCRMStuList
        errText = '获取往期学员失败'
      } else if (this.type === 'commonalityLeads') {
        params = {
          ...this.query,
          pageIndex: pageIndex - 1,
          pageSize: this.pageSize,
          commonalityLeads: '1'
        }
        queryList = queryCRMStuList
        errText = '获取公海池学员失败'
      } else if (this.type === 'readAndWangStu') {
        params = {
          ...this.query,
          pageIndex: pageIndex - 1,
          pageSize: this.pageSize
        }
        queryList = queryCRMStuList
        errText = '获取学员失败'
      }

      const { data } = await queryList(params)
      if (data && data.errorCode === 0) {
        if (isDown) { // 下拉、
          console.log('1111111122222222')
          this.pageIndex = pageIndex
          this.pageCount = data.data.pageCount
          if (pageIndex === 1) {
            // 第一页
            this.options = [...data.results]
          } else {
            // 增加下一页数据
            this.options = [...this.options, ...data.results]
          }
        }
      } else {
        this.$message.error(data && data.errorMessage || errText)
      }

      this.loading = false
      OPT_DOM && loading.close()
    },

    /**
     * 滚动事件
     * @param isDown  true下拉，false上拉
     * @param scrollTop 滚动条位置
     * @param SCROLL_DOM dom对象
     */
    handleScroll(isDown) {
      if (!this.loading && isDown && !this.noMore) {
        console.log('下拉------------')

        this.getOptions(this.pageIndex + 1, isDown)
      }
    },

    /** 搜索 */
    onSearch: debounce(function(query) {
      console.log(query, 'query====================')
      if (this.type === 'useClass') {
        // 手动消课字段特殊处理
        this.query = {
          nameOrTel: query
        }
      } else {
        console.log('8888888')
        this.query = {
          name: query
        }
      }

      this.getOptions(1, true)
    }, 1100),

    /** 下拉框出现/隐藏时触发 */
    showOptions(show) {
      this.optShow = show
      // 下拉框消失后重置
      if (!show) {
        this.pageIndex = 1
        this.pageMap = [1]
        this.query = {}
        this.getOptions(1, true)
      } else if (show) {
        // 解决回显问题
        this.pageIndex = 1
        this.pageMap = [1]
        this.query = {}
        if (this.type === 'useClass' && !this.params.courseId) {
          return
        }
        this.getOptions(1, true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .student_type_circle{
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
    background: rgb(137, 199, 8);
  }
.previous_type{
  background: rgb(255, 103, 2);
}
  .reading_type{
    background: #46b6ee;
  }
</style>
