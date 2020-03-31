/**
 * Created by shuyuhan on 19/07/08.
 */
export function store(key, value, expire) {
  const obj = {
    time: new Date().getTime() / 3600000, // 第一次缓存的时间
    value: value, // 缓存的值
    expire: expire // 小时
  }
  const objStr = JSON.stringify(obj)
  localStorage.setItem(key, objStr)
}

export function time() {
  if (localStorage.getItem('name')) {
    // console.info(12)
    const name = localStorage.getItem('name')
    const nameObj = JSON.parse(name)
    // 当前时间
    const dataday = new Date().getTime() / 3600000
    // 拿到缓存时的时间
    const datat = nameObj.time
    // 过期24小时后 就清楚name的缓存 nameObj.expire你设置的缓存时间
    if (dataday - datat >= nameObj.expire) {
      localStorage.removeItem('name')
    }
  }
}

export function times() {
  if (localStorage.getItem('names')) {
    // console.info(12)
    const name = localStorage.getItem('names')
    const nameObj = JSON.parse(name)
    // 当前时间
    const dataday = new Date().getTime() / 3600000
    // 拿到缓存时的时间
    const datat = nameObj.time
    // 过期24小时后 就清楚name的缓存 nameObj.expire你设置的缓存时间
    if (dataday - datat >= nameObj.expire) {
      localStorage.removeItem('names')
    }
  }
}
