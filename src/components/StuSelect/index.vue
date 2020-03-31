/**
 * 动态渲染选择框+精确查找
 *   学员选择
 * props
 *   参数           说明            类型          其他
 *   v-model        绑定选中值      {Str/Arr}     多选时为数组，单选时为字符串
 *   type           学员类型        {Str}         默认reading，可选值：reading在读 | latent潜在 | all全部 | useClass消课专用 | allReading所有在读 | vipReading关联会员卡在读 | nursery托班 | realAll 包括往期的全部 | wangStu 往期学员 | commonalityLeads 公海池 | readAndWangStu 往期和在读
 *   multiple       是否多选        {Bool}        默认false
 *   width          选择框宽度      {Str}         默认'260px'，可设置百分比
 *   clsStuIdArr    班级学员列表    {Arr}         已经是班级学员的需要禁选
 *   noMonth        选项不显示月份  {Bool}        默认false，true不显示月份，false不显示
 *   showType       显示学员类型    {Bool}        默认false，true显示，false不显示
 *   params         额外参数        {Obj}         额外提供的参数
 *   placeholder    占位符          {Str}
 *   disabled       禁用            {Bool}
 *   editInfo       编辑回显数据    {Obj}         有编辑情况时，用于回显编辑的选择数据
 *
 * events
 *   事件           说明                          参数
 *   select         选择框选中触发                value选中值，opiton选中对象
 */
<template>
  <div>
    <!-- <div v-if="showType">
      <span v-if="type === 'latent'"><i class="select_stu_type" />潜在学员</span>
      <span v-if="type === 'reading'" :style="{marginLeft: '10px'}"><i class="select_stu_type reading_type" />在读学员</span>
      <span v-if="type === 'wangStu'" style="{marginLeft: '10px'}"><i class="select_stu_type previous_type" />往期学员</span>
    </div>-->
    <div v-if="showType">
      <span v-if="type === 'latent'">
        <i class="select_stu_type" />潜在学员
      </span>
      <span v-if="type === 'reading'" :style="{marginLeft: '10px'}">
        <i class="select_stu_type reading_type" />在读学员
      </span>
      <span v-if="type === 'wangStu'" style="{marginLeft: '10px'}">
        <i class="select_stu_type previous_type" />往期学员
      </span>
      <template v-if="type=== 'realAll'">
        <span>
          <i class="select_stu_type" />潜在学员
        </span>
        <span :style="{marginLeft: '10px'}">
          <i class="select_stu_type reading_type" />在读学员
        </span>
        <span :style="{marginLeft: '10px'}">
          <i class="select_stu_type previous_type" />往期学员
        </span>
      </template>
      <template v-if="type=== 'all'">
        <span>
          <i class="select_stu_type" />潜在学员
        </span>
        <span :style="{marginLeft: '10px'}">
          <i class="select_stu_type reading_type" />在读学员
        </span>
        <!-- <span :style="{marginLeft: '10px'}"><i class="select_stu_type previous_type" />往期学员</span> -->
      </template>
      <template v-if="type=== 'readAndWangStu'">
        <span :style="{marginLeft: '10px'}">
          <i class="select_stu_type reading_type" />在读学员
        </span>
        <span :style="{marginLeft: '10px'}">
          <i class="select_stu_type previous_type" />往期学员
        </span>

      </template>
    </div>
    <!-- <div v-if="showAll">
      <span><i class="select_stu_type" />潜在学员</span>
      <span :style="{marginLeft: '10px'}"><i class="select_stu_type reading_type" />在读学员</span>
      <span :style="{marginLeft: '10px'}"><i class="select_stu_type previous_type" />往期学员</span>
    </div>-->
    <!-- 大数据量选择器 -->
    <LoadSelect
      ref="bigDataSelect"
      v-model="checkList"
      :type="type"
      :class-stu="clsStuIdArr"
      :width="width"
      :multiple="multiple"
      :no-month="noMonth"
      :show-type="showType"
      :params="params"
      :placeholder="placeholder"
      :disabled="disabled"
      :edit-info="editInfo"
      @onChange="onChange"
    />

    <el-button
      :style="{marginLeft: '10px'}"
      :disabled="disabled"
      type="text"
      @click="accurateSearch"
    >精确查找</el-button>

    <!-- 精确查找弹窗 -->
    <StuSelectDialog
      v-if="isShow"
      ref="selectStu"
      :type="type"
      :show-type="showType"
      :multiple="multiple"
      :params="params"
      @toParent="getSelectData"
      @toclose="close"
    />
  </div>
</template>

<script>
import StuSelectDialog from './StuSelectDialog'
import LoadSelect from './LoadSelect'

export default {
  components: {
    LoadSelect,
    StuSelectDialog
  },

  props: {
    value: {
      type: null,
      default: undefined
    },
    clsStuIdArr: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'reading'
    },
    width: {
      type: String,
      default: '260px'
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
      isShow: false,
      checkList: this.multiple ? [] : {}
    }
  },
  watch: {
    value(value) {
      // 关闭时重置
      if (
        !value ||
        value === '' ||
        (Array.isArray(value) && value.length < 1)
      ) {
        this.checkList = this.multiple ? [] : {}
      }
      this.$emit('select', value, this.checkList)
    },

    editInfo(value) {
      if (Object.keys(value).length > 0) {
        this.checkList = value
        this.$emit('select', this.value, value)
      }
    }
  },
  mounted() {
    console.log('909090', this.type)
  },

  methods: {
    /** 选择框change */
    onChange(ids) {
      this.$emit('input', ids)
    },

    /* 精确查找 */
    accurateSearch() {
      if (this.type === 'useClass' && !this.params.courseId) {
        this.$message.error('请先选择消耗课程!')
        return
      }
      this.isShow = true
      this.$nextTick(() => {
        const checked = this.multiple
          ? this.checkList
          : this.checkList === ''
            ? []
            : [this.checkList]
        this.$refs.selectStu.show(this.value, this.clsStuIdArr, checked)
      })
    },

    /* 获取精确查找的数据 */
    getSelectData(val, list) {
      this.checkList = this.multiple ? list : list[0]
      if (this.multiple) {
        this.$emit('input', val)
      } else {
        this.$emit('input', val[0])
      }
    },

    /** 关闭 */
    close(val) {
      this.isShow = val
    }
  }
}
</script>

<style lang="scss" scoped>
.select_stu_type {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
  background: rgb(137, 199, 8);
}
.previous_type {
  background: rgb(255, 103, 2);
}
.reading_type {
  background: #46b6ee;
}
</style>
