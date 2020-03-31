// !(function(e, t) {
// /* eslint-disable */
//     typeof exports === 'object' && typeof module === 'object' ? module.exports = t() : typeof define === 'function' && define.amd ? define([], t) : typeof exports === 'object' ? exports.MultiUpload = t() : e.MultiUpload = t()
//   }(this, function() {
export function MultiUpload(opt = {
  tid: 99,
  oid: 99,
  chunkSize: 5242880,
  action: ''
}) {
  this.action = opt.action
  this.tid = opt.tid
  this.oid = opt.oid
  this.chunkSize = opt.chunkSize
  this.axios = opt.axios || window.axios

  this.CancelToken = this.axios.CancelToken
  this.source = this.CancelToken.source()
}
MultiUpload.prototype = {
  init(fileName) {
    // const CancelToken = this.axios.CancelToken
    const formData = new FormData()
    formData.append('tid', this.tid)
    formData.append('oid', this.oid)
    formData.append('fName', fileName)
    return this.axios.post(`${this.action}/init`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencode'
      },
      cancelToken: this.source.token
    })
  },
  exec(objectName, uploadId, chunkSize, file) {
    chunkSize = chunkSize || this.chunkSize
    const blockNum = Math.ceil(file.size / chunkSize)
    const all = []
    // const CancelToken = this.axios.CancelToken
    for (let i = 0; i < blockNum; i++) {
      const nextSize = Math.min((i + 1) * chunkSize, file.size)
      const fileData = file.slice(i * chunkSize, nextSize)
      const formData = new FormData()
      formData.append('file', fileData)
      formData.append('partIdx', i + 1)
      formData.append('objectName', objectName)
      formData.append('uploadId', uploadId)
      all.push(
        this.axios.post(`${this.action}/exec`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          cancelToken: this.source.token
        })
      )
    }
    return Promise.all(all).then(arr => {
      const etags = []
      arr.forEach(res => {
        etags.push(res.data.eTag)
      })
      return etags
    }).catch(err => {
      console.log('exec取消上传', err)
      if (this.axios.isCancel(err)) {
        console.log('Request canceled', err.message)
      }
    })
  },
  finish(objectName, uploadId, etags) {
    // const CancelToken = this.axios.CancelToken
    const formData = new FormData()
    formData.append('objectName', objectName)
    formData.append('uploadId', uploadId)
    formData.append('eTags', etags.join(','))
    formData.append('z', 'zd')
    return this.axios.post(`${this.action}/finish`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencode'
      },
      // cancelToken: new CancelToken(function executor(c) {
      //   // executor 函数接收一个 cancel 函数作为参数
      //   window.cancelAxios = c
      // })
      cancelToken: this.source.token
    })
  },
  upload(file, chunkSize) {
    return this.init(file.name).then(res => {
      if (res) {
        res = res.data
        const objectName = res.objectName
        const uploadId = res.uploadId
        return this.exec(objectName, uploadId, chunkSize, file).then(etags => {
          if (etags) {
            return this.finish(objectName, uploadId, etags).then(res => res.data).catch(err => {
              if (this.axios.isCancel(err)) {
                console.log('finish取消', err.message)
              }
            })
          }
        })
      }
    }).catch(err => {
      if (this.axios.isCancel(err)) {
        console.log('init取消', err.message)
      }
    })
  }
}
// return MultiUpload
// }))
