/**
 * 富文本编辑器-图片上传功能自定义
 * props:
 *   v-model          双向绑定
 *   edit-style       富文本编辑器样式
 */
<template>
  <div>
    <quill-editor
      ref="myQuillEditor"
      :value="content"
      :options="editorOption"
      :style="editStyle"
      @change="transferAddact($event)"
    />

    <!-- 上传弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="上传图片"
      width="500px"
      custom-class="rich_text_editor"
      append-to-body
      @close="close"
    >
      <div>
        <el-upload
          ref="upload"
          :on-change="fileChange"
          :on-remove="fileRemove"
          :file-list="fileList"
          :before-upload="beforeUpload"
          action="https://imgsrc.ishanshan.com/gimg/upload"
          list-type="picture"
        >
          <el-button
            :loading="loading"
            type="primary"
          >点击上传</el-button>
        </el-upload>
      </div>

      <span slot="footer">
        <el-button
          :loading="loading"
          @click="close"
        >取 消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="confirm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Quill from 'quill'
import Compressor from 'compressorjs'

// 工具栏配置
let toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }], // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
  [{ 'direction': 'rtl' }], // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['link', 'image', 'video'],
  ['clean'] // remove formatting button
]

export default {
  props: {
    editStyle: {
      type: Object,
      default: () => {}
    },
    value: {
      type: String,
      default: ''
    },
    noVideo: {
      type: Boolean,
      default: false
    }
  },

  data() {
    if (this.noVideo) {
      toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }], // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
        [{ 'direction': 'rtl' }], // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean'] // remove formatting button
      ]
    }

    return {
      content: '', // 内容
      editorOption: {
        placeholder: '请输入内容',
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              'image': this.imageHandlers // 覆盖默认图片按钮事件
            }
          }
        }
      },
      dialogVisible: false,
      fileList: [],
      loading: false,
      images: [],
      addRange: []
    }
  },

  watch: {
    value(val) {
      this.content = val
    }
  },

  mounted() {
    const editBar = document.querySelector('.ql-toolbar')
    const editCon = document.querySelector('.ql-container')
    console.log(editBar.offsetHeight)
    editCon.style.height = `calc(100% - ${editBar.offsetHeight}px)`
  },

  methods: {
    /** 富文本change */
    transferAddact({ quill, html, text }) {
      this.content = html
      this.$emit('input', html)
    },

    /** 富文本上传按钮自定义 */
    imageHandlers(value) {
      if (value) {
        this.dialogVisible = true
      } else {
        this.quill.format('image', false)
      }
    },

    /** 上传前钩子 */
    beforeUpload(file) {
      const that = this

      // 返回promise让上传文件变成压缩后文件，在change中console依然是原大小，实际已经是替换为压缩文件
      return new Promise((resolve, reject) => {
        // 获取图片宽高
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function(theFile) {
          const image = new Image()
          image.src = theFile.target.result
          image.onload = function() {
            let quality = 1
            let width
            let doResize = false // 是否压缩

            // 是否大于1MB，超过进行压缩
            if (file && file.size > 1048576) {
              quality = 0.4
              doResize = true
            }
            // 宽度最大900
            if (this.width > 900) {
              width = 900
              doResize = true
            }
            // 压缩
            if (doResize) {
              new Compressor(file, {
                convertSize: Infinity, // PNG files over this value will be converted to JPEGs.
                quality,
                width,
                success(result) {
                  const lastFile = new File([result], result.name, { type: result.type })
                  resolve(lastFile)
                },
                error(err) {
                  that.$message.error('压缩失败')
                  console.error(err.message)
                }
              })
            } else {
              resolve(file)
            }
          }
        }
      })
    },

    /** 上传change */
    fileChange(file, fileList) {
      // 开始上传
      if (file.status === 'ready') {
        this.loading = true
      }
      // 上传成功
      if (file.status === 'success') {
        if (file.response.url !== '') {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.loading = false
          const images = [...this.images]
          images.push({ name: file.name, url: file.response.url })
          this.images = images
        } else {
          this.$message.error('上传失败')
        }
      }
    },

    /** 上传删除 */
    fileRemove(file, fileList) {
      this.images = []
    },

    /** 关闭上传 */
    close() {
      this.fileList = []
      this.images = []
      this.addRange = []
      this.dialogVisible = false
    },

    /** 确定上传 */
    confirm() {
      if (this.images && this.images.length > 0) { // 将文件上传后的URL地址插入到编辑器文本中
        this.images.forEach(img => {
          const value = img.url
          // 获取光标位置对象，里面有两个属性，一个是index 还有 一个length，这里要用range.index，即当前光标之前的内容长度，然后再利用 insertEmbed(length, 'image', imageUrl)，插入图片即可。
          this.addRange = this.$refs.myQuillEditor.quill.getSelection()
          this.$refs.myQuillEditor.quill.insertEmbed(this.addRange !== null ? this.addRange.index : 0, 'image', value, Quill.sources.USER) // 调用编辑器的 insertEmbed 方法，插入URL
          // 调整光标到最后
          this.$refs.myQuillEditor.quill.setSelection(this.addRange !== null ? this.addRange.index + 1 : 0)
        })

        this.close()
      } else {
        this.$message.error(`${this.images.name}插入失败`)
      }
    }
  }
}
</script>

<style lang="scss">
.rich_text_editor {
  .el-dialog__body {
    padding: 20px !important;
  }
}
.ql-snow .ql-tooltip{
  left: 0 !important;
}
</style>

<style>
/* 修改富文本中默认内容为中文 */
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>
