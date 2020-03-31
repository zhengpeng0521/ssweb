<template>
  <div class="input_range">
    <el-input-number
      v-model="miniValue"
      :precision="0"
      :min="0"
      :placeholder="'最小'+field.label"
      controls-position="right"
      @change="(value) => onChange(value, 0)" />
    <span>~</span>
    <el-input-number
      v-model="maxValue"
      :precision="0"
      :min="0"
      :placeholder="'最大'+field.label"
      controls-position="right"
      @change="(value) => onChange(value, 1)" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: null,
      required: true
    },

    field: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      miniValue: undefined,
      maxValue: undefined,
      newValue: [undefined, undefined]
    }
  },

  watch: {
    value(newProps) {
      if (!newProps) {
        this.miniValue = undefined
        this.maxValue = undefined
        this.newValue = [undefined, undefined]
      }
    }
  },

  methods: {
    onChange(value, index) {
      this.newValue[index] = value
      this.$emit('input', this.newValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.input_range{
  display: flex;

  span{
    margin: 0 10px;
    font-size: 12px;
  }
}

.input_range /deep/{
  .el-input-number--mini{
    width: 100%;
  }
  .el-input-number__increase,.el-input-number__decrease{
    display: none;
  }
  .el-input-number.is-controls-right .el-input__inner{
    padding: 0 15px;
    text-align: left;
  }
}
</style>
