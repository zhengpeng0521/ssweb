<template>
  <div>
    <div v-if="field.type == 'select'">
      <el-select
        v-model="params[field.key]"
        :loading="loading"
        :loading-text="'拼命加载中'"
        :size="field.size"
        :disabled="field.disabled"
        :placeholder="field.placeholder"
        :filterable="field.isFilterable != undefined ? field.isFilterable : true"
        :clearable="field.clearable !== undefined ? field.clearable : true"
        :style="field.itemStyle"
        :popper-class="popClass"
        :class="className"
        style="width: 100%"
        @change="(value) => {selectChange && selectChange(value, field.control)}"
      >
        <el-option
          v-for="(option, index) in list"
          :key="index + '_selfSelect'"
          :value="(typeof option === 'object') ? option[field.optionValue || 'value'] : option"
          :label="(typeof option === 'object') ? option[field.optionLabel || 'label'] : option"
        />
      </el-select>
    </div>
    <div v-if="field.type == 'selectAdd'">
      <el-select
        v-model="params[field.key]"
        :loading="loading"
        :loading-text="'拼命加载中'"
        :size="field.size"
        :disabled="field.disabled"
        :placeholder="field.placeholder"
        :filterable="field.isFilterable != undefined ? field.isFilterable : true"
        :clearable="field.clearable !== undefined ? field.clearable : true"
        :style="field.itemStyle"
        :popper-class="popClass"
        :class="className"
        multiple
        collapse-tags
        style="width: 100%"
      >
        <el-option
          v-for="(option, index) in list"
          :key="index + '_selfSelect'"
          :value="(typeof option === 'object') ? option[field.optionValue || 'value'] : option"
          :label="(typeof option === 'object') ? option[field.optionLabel || 'label'] : option"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  props: {
    className: {
      type: String,
      default: undefined
    },
    popClass: {
      type: String,
      default: undefined
    },
    field: {
      type: Object,
      default: () => {}
    },
    params: {
      type: Object,
      default: {} // eslint-disable-line
    },
    selectChange: {
      type: Function,
      default: undefined
    }
  },
  data() {
    return {
      values: [],
      list: [],
      loading: false
    }
  },
  watch: {
    field: {
      handler: function(val, oldval) {
        this.list = val.options
      },
      immediate: true, // 关键
      deep: true
    }
  },
  mounted() {
    const { isAsync, initFirst, options, key, optionValue, type } = this.field
    if (isAsync) {
      this.getSelect()
    } else {
      this.list = options
      if (initFirst && options.length > 0 && type === 'select') {
        this.params[key] = options[0][optionValue || 'value']
      }
      // if (initFirst && options.length > 0 && type === 'selectAdd') {
      //   this.params[key] = [options[0][optionValue || 'value']]
      // }
    }
  },

  methods: {
    async getSelect() {
      const { url, asyncParams, initFirst, key, optionValue, listValue, type } = this.field
      this.loading = true
      const { data } = await request({
        url: url,
        method: 'post',
        data: asyncParams || {}
      })
      if (data && data.errorCode === 0 && type === 'select') {
        this.list = data[listValue || 'results']
        if (initFirst) {
          this.params[key] = data.results[0][optionValue || 'value']
        }
      } else {
        this.$message.error(data && data.errorMessage || '下拉获取失败！')
      }
      this.loading = false
    }
  }
}
</script>
