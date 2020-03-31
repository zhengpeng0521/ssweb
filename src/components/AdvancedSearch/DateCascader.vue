<template>
  <div class="birthdayBox">
    <div class="birthdayCascader">
      <el-cascader
        v-model="startDate"
        :options="startDateOption"
        :clearable="true"
        placeholder="开始日期"
        separator=""
        @change="(value) => {onChange(value,0)}"
      />
      <span class="spacing">~</span>
      <el-cascader
        v-model="endDate"
        :options="endDateOption"
        :clearable="true"
        placeholder="结束日期"
        separator=""
        @change="(value) => {onChange(value,1)}"
      />
    </div>
    <div
      v-if="isCommonSearch && dateStatus"
      class="tip"
    >请选择{{ status }}日期</div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: null,
      required: true
    },
    // eslint-disable-next-line vue/require-default-prop
    isCommonSearch: {
      type: null,
      required: false
    }
  },
  data() {
    return {
      startDate: [],
      endDate: [],
      newValue: [],
      startDateOption: [],
      endDateOption: [],
      status: '',
      dateStatus: false
    }
  },
  watch: {
    value(newProps) {
      if (!newProps || (!newProps[0] && !newProps[1])) {
        this.startDate = []
        this.endDate = []
        this.newValue = [undefined, undefined]
        this.getOptions()
      } else if (newProps[0] && newProps[1]) {
        this.startDate = newProps[0].split('-')
        this.endDate = newProps[1].split('-')
        this.newValue = [newProps[0], newProps[1]]
        this.getOptions()
        this.endDateOption.forEach(item => {
          if (item.value < this.startDate[0]) {
            item.disabled = true
          }
          if (item.value === this.startDate[0]) {
            item.children.forEach(val => {
              if (val.value < this.startDate[1]) {
                val.disabled = true
              }
            })
          }
        })
      }
      this.changeStatus(this.startDate, this.endDate)
    }
  },
  mounted() {
    this.getOptions()
  },
  methods: {
    changeStatus(start, end) {
      if (start.length === 0 && end.length !== 0) {
        this.dateStatus = true
        this.status = '开始'
      } else if (start.length !== 0 && end.length === 0) {
        this.dateStatus = true
        this.status = '结束'
      } else {
        this.dateStatus = false
        this.status = ''
      }
    },
    onChange(val, index) {
      const month = val[0]
      const day = val[1]
      if (index === 0) {
        this.getOptions()
        this.endDateOption.forEach(item => {
          if (item.value < month) {
            item.disabled = true
          }
          if (item.value === month) {
            item.children.forEach(val => {
              if (val.value < day) {
                val.disabled = true
              }
            })
          }
        })
        if (val.length !== 0) {
          this.newValue[0] = month + '-' + day
        } else {
          this.newValue[0] = undefined
        }
        if (this.newValue[1]) {
          const endMonth = this.newValue[1].split('-')[0]
          const endDay = this.newValue[1].split('-')[1]
          if (endMonth < month || (endMonth === month && endDay < day)) {
            this.endDate = []
            this.newValue[1] = undefined
          }
        }
        this.$emit('input', this.newValue)
        if (this.isCommonSearch) {
          this.$parent.timePickerChange()
        }
      }
      if (index === 1) {
        if (val.length !== 0) {
          this.newValue[1] = month + '-' + day
        } else {
          this.newValue[1] = undefined
        }
        this.$emit('input', this.newValue)
        if (this.isCommonSearch) {
          this.$parent.timePickerChange()
        }
      }
      this.changeStatus(this.startDate, this.endDate)
    },
    getOptions() {
      const dateOption = []
      for (let i = 1; i < 13; i++) {
        const monthObj = {
          value: i.toString(),
          label: i + '月',
          children: ''
        }
        if (i < 10) {
          monthObj.value = '0' + i
        }
        if (i === 4 || i === 6 || i === 9 || i === 11) {
          const dayChildren = []
          for (let k = 1; k < 31; k++) {
            const dayObj = {
              value: k.toString(),
              label: k + '日'
            }
            if (k < 10) {
              dayObj.value = '0' + k
            }
            dayChildren.push(dayObj)
          }
          monthObj.children = dayChildren
        } else if (i === 2) {
          const dayChildren = []
          for (let k = 1; k < 30; k++) {
            const dayObj = {
              value: k.toString(),
              label: k + '日'
            }
            if (k < 10) {
              dayObj.value = '0' + k
            }
            dayChildren.push(dayObj)
          }
          monthObj.children = dayChildren
        } else {
          const dayChildren = []
          for (let k = 1; k < 32; k++) {
            const dayObj = {
              value: k.toString(),
              label: k + '日'
            }
            if (k < 10) {
              dayObj.value = '0' + k
            }
            dayChildren.push(dayObj)
          }
          monthObj.children = dayChildren
        }
        dateOption.push(monthObj)
      }
      this.startDateOption = JSON.parse(JSON.stringify(dateOption))
      this.endDateOption = JSON.parse(JSON.stringify(dateOption))
    }
  }
}
</script>

<style lang="scss" scoped>
.el-cascader-menus {
  z-index: 40001;
}
.birthdayBox {
  display: flex;
  width: 100%
}
.birthdayCascader {
  display: flex;
  width: 240px;
}
.tip {
  color: red;
  margin-left: 10px;
  padding-top: 6px;
}
.spacing {
  margin: 0 10px;
  font-size: 12px;
  line-height: 29px
}
</style>

