/**
 * 动态渲染选择框
 *   下拉数据量太大时可用
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
    v-scroll="handleScroll"
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
    <!-- 模拟顶部数据高度 -->
    <div :style="{ width: '100%', height: `${virtualTop}px` }" class="select_virtual_top" />

    <el-option
      v-for="item in options"
      :key="item.id"
      :label="noMonth ? item[optKey] : type === 'nursery' ? `${item.name}(${Math.floor(item.month / 12)}岁)` : `${item.name}(${item.month}月)`"
      :value="item"
      :disabled="getDisabled(item)"
    >
      <i v-if="showType" :class="item.source === '1' ? 'student_type_circle reading_type' : 'student_type_circle'" />
      {{ noMonth ? item[optKey] : type === 'nursery' ? `${item.name}(${Math.floor(item.month / 12)}岁)` : `${item.name}(${item.month}月)` }}
    </el-option>

    <!-- 模拟底部数据高度 -->
    <div :style="{ width: '100%', height: `${virtualBottom}px` }" class="select_virtual_bottom" />
  </el-select>
</template>

<script>
import { queryCRMStuList } from '@/api/teachManage/grade'
import { queryClueStuList } from '@/api/teachManage/orderCourse'
import { queryCRMStuAndClueList } from '@/api/crm/financeMgr/financeMgr'
import { batchStuList } from '@/api/crm/stuAccount/stuAccount'
import { debounce } from '@/utils/debounce'

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
      allOptions: [], // 所有下拉
      options: [], // 展示下拉
      optShow: false,
      // value: '', // 单选值

      pageCount: 0,
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      pageLimit: 3, // 最多容纳3页的数据量
      pageMap: [], // 记录页码
      maxPage: 1, // 记录滚动过的最大值
      query: {} // 搜索条件
    }
  },

  computed: {
    // 顶部虚拟高度
    virtualTop() {
      if (this.pageMap[0] > 1) {
        return 34 * this.pageSize * (this.pageMap[0] - 1)
      } else {
        return 0
      }
    },

    // 底部虚拟高度
    virtualBottom() {
      const lastPageSize = this.pageMap[this.pageLimit - 1]
      if (lastPageSize && (lastPageSize < this.maxPage)) {
        const height = (this.maxPage - lastPageSize) * 34 * this.pageSize
        return height
      } else {
        return 0
      }
    },

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
    }
  },

  watch: {
    pageIndex(value) {
      console.log('页数', value)
    },
    pageMap(value) {
      console.log('页码记录', value)
    },
    options(value) {
      console.log('展示数据', value)
    },
    maxPage(value) {
      console.log('下拉过的最大页数', value)
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

      console.log('选中=====================', value)
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
    this.pageMap.push(1)
    this.getOptions(this.pageIndex, true)
  },

  methods: {

    /** 是否禁用 */
    getDisabled(row) {
      if (this.type === 'vipReading') {
        return !row.stuCardId || row.stuCardId === ''
      } else {
        return this.classStu.indexOf(row.id) > -1
      }
    },

    onChange(value) {
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
          type: '2'
        }
        queryList = queryCRMStuList
        errText = '获取在读学员失败'
      } else if (this.type === 'latent') {
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
      }

      const { data } = await queryList(params)
      if (data && data.errorCode === 0) {
        if (isDown) { // 下拉
          this.pageIndex = pageIndex
          this.pageCount = data.data.pageCount
          if (pageIndex === 1) {
            // 第一页
            this.options = [...data.results]
          } else {
            // 增加下一页数据
            this.options = [...this.options, ...data.results]
          }
        } else { // 上拉
          this.pageIndex = this.pageMap[this.pageLimit - 1]
          // 删除后一页数据
          this.options.splice(-this.pageSize, this.pageSize)
          // 增加上一页数据
          this.options = [...data.results, ...this.options]
        }

        // 存储已获取的数据
        if (isDown && this.maxPage === 1) {
          this.allOptions = [...data.results]
        } else if (isDown) {
          this.allOptions = [...this.allOptions, ...data.results]
        }
      } else {
        this.$message.error(data && data.errorMessage || errText)
      }

      this.loading = false
      OPT_DOM && loading.close()
    },

    /** 获取展示的三页options */
    getThreeOptions() {
      this.loading = true
      const loading = this.$loading({
        target: document.querySelector('.big_data_select'),
        lock: true,
        text: '加载中',
        fullscreen: false
      })
      const start = (this.pageMap[0] - 1) * this.pageSize
      const end = this.pageMap[this.pageLimit - 1] * this.pageSize
      const newOpts = this.allOptions.slice(start, end)
      this.options = newOpts

      loading.close()
      this.loading = false
    },

    /**
     * 滚动事件
     * @param isDown  true下拉，false上拉
     * @param scrollTop 滚动条位置
     * @param SCROLL_DOM dom对象
     */
    handleScroll(isDown, scrollTop, SCROLL_DOM) {
      // 一页列表高度
      const pageHeight = 34 * this.pageSize

      if (!this.loading && !isDown && scrollTop < this.virtualTop) {
        console.log('上 拉超过当前展示------------')
        // 处理直接操作滚动条产生的特殊情况
        // 瞬间上拉
        const pageIndex = scrollTop === 0 ? 3 : Math.ceil(scrollTop / pageHeight) + 2
        this.pageIndex = pageIndex
        if (pageIndex === 3 || pageIndex === 4) {
          this.pageMap = [1, 2, 3]
        } else {
          this.pageMap = [pageIndex - 2, pageIndex - 1, pageIndex]
        }
        this.getThreeOptions()
      } else if (!this.loading && isDown && scrollTop > this.virtualTop + pageHeight * this.pageLimit) {
        console.log('下 拉超过当前展示------------')
        // 处理直接操作滚动条产生的特殊情况
        // 瞬间下拉
        const pageIndex = Math.ceil(scrollTop / pageHeight)
        // 拉到最后一页，获取最后一页数据，否则获取中间页
        if (pageIndex === this.pageCount) {
          this.pageIndex = pageIndex
          this.pageMap = [pageIndex - 2, pageIndex - 1, pageIndex]
          this.getThreeOptions()
        } else {
          this.pageIndex = pageIndex + 1
          this.pageMap = [pageIndex - 1, pageIndex, pageIndex + 1]
          this.getThreeOptions()
        }

        // 直接拉到底部时滚回40位置
        const bottom = scrollTop - this.pageLimit * pageHeight
        if (this.virtualBottom - 40 <= bottom) {
          SCROLL_DOM.scrollTo(SCROLL_DOM.scrollLeft, scrollTop - 40)
        }
      } else {
        // 滚轮操作滚动条时正常操作
        if (isDown && !this.loading && !this.noMore) {
          console.log('滚动方向：下--------------------')
          // 记录最大页数
          if (this.pageIndex + 1 > this.maxPage) {
            this.maxPage = this.pageIndex + 1
          }

          if (this.pageMap.length >= this.pageLimit) {
            // 当长度相等的时候， 绝对不能超出长度  则有进必有出
            // 删除 pageMap 列表的第一个元素
            this.pageMap.shift()
            // 删除前一页数据
            this.options.splice(0, this.pageSize)
          }
          this.pageMap.push(this.pageIndex + 1)
          // 设置下一页数据
          this.getOptions(this.pageIndex + 1, isDown)
        } else if (!isDown && !this.loading) {
          console.log('滚动方向：上---------------------')
          // 如果在向上滚动时，如果还没有到达第一页则继续加载。 如果已到达则停止加载
          if (this.pageMap[0] > 1) {
            // 同步设置分页
            // ①先删除最后一个元素
            this.pageMap.pop()
            // ②将新元素添加在头部
            this.pageMap = [this.pageMap[0] - 1, ...this.pageMap]
            // ②将新数据添加在头部位置
            this.getOptions(this.pageMap[0], isDown)
          } else return false
        }
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
        this.query = {
          name: query
        }
      }

      // 将所有已获取数据重置
      this.pageMap = [1]
      this.maxPage = 1

      this.getOptions(1, true)
    }, 1100),

    /** 下拉框出现/隐藏时触发 */
    showOptions(show) {
      this.optShow = show
      // 下拉框消失后重置
      if (!show && this.virtualTop > 0) {
        this.pageIndex = 3
        this.pageMap = [1, 2, 3]
        this.getThreeOptions()
      } else if (!show) {
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
  .reading_type{
    background: #46b6ee;
  }
</style>
