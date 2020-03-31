import Vue from 'vue'
import { debounce } from '@/utils/debounce'

export default () => {
  Vue.directive('scroll', {
    bind(el, binding) {
      // 获取滚动页面DOM
      const SCROLL_DOM = el.querySelector(
        '.el-select-dropdown .el-select-dropdown__wrap'
      )
      // 虚拟top部分高度
      const TOP_DOM = el.querySelector(
        '.el-select-dropdown .el-select-dropdown__wrap .select_virtual_top'
      )
      // 虚拟top部分高度
      const BOTTOM_DOM = el.querySelector(
        '.el-select-dropdown .el-select-dropdown__wrap .select_virtual_bottom'
      )
      let scrollPosition = 0
      SCROLL_DOM.addEventListener('scroll', debounce(function() {
        // 当前的滚动位置 减去  上一次的滚动位置
        // 如果为true则代表向上滚动，false代表向下滚动
        const flagToDirection = this.scrollTop - scrollPosition > 0
        // 记录当前的滚动位置
        scrollPosition = this.scrollTop

        const LIMIT_BOTTOM = BOTTOM_DOM.offsetHeight + 34
        // 记录滚动位置距离底部的位置
        const scrollBottom =
          this.scrollHeight - (this.scrollTop + this.clientHeight) <
          LIMIT_BOTTOM
        // 下拉
        if (flagToDirection && scrollBottom) {
          binding.value(flagToDirection, scrollPosition, SCROLL_DOM)
        }

        const LIMIT_TOP = TOP_DOM.offsetHeight + 48
        // 上拉
        if (!flagToDirection && this.scrollTop < LIMIT_TOP) {
          binding.value(flagToDirection, scrollPosition)
        }
      }, 100))
    }
  })
}
