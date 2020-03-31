let timer = null

/** 防抖动 */
export function debounce(fn, wait = 2000) {
  // 将 debounce 处理结果当作函数返回
  // 触发事件回调时执行这个返回函数
  return function() {
    const that = this
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function() {
      timer = null
      fn.apply(that, args)
    }, wait)
  }
}
