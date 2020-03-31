<template>
  <transition name="slide-fade">
    <div
      v-show="isVisible"
      ref="dataDetail"
      class="side-dialog"
    >
      <div class="body">
        <!-- <iframe
          :src="dataDetailUrl"
          class="cont"
        /> -->
        <IframeCom :out-url="dataDetailUrl"/>
      </div>
    </div>
  </transition>
</template>
<script>
import IframeCom from '@/components/IframeCom/iframeCom'
export default {
  components: {
    IframeCom
  },
  props: {
    'visible': {
      type: Boolean,
      default: true
    },
    'dataDetailUrl': {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isVisible: this.visible
    }
  },
  watch: {
    'visible'(val) {
      this.isVisible = val
    },
    'isVisible'(val) {
      this.$emit('update:visible', val)
    }
  },
  mounted() {
    const self = this
    window.addEventListener('message', function(e) {
      if (e.data === 'closeDataDetail') {
        var receiver = document.getElementById('receiver') && document.getElementById('receiver').contentWindow
        receiver && receiver.postMessage('updateData', '*')
        self.close()
      }
    }, false)
  },
  methods: {
    close() {
      this.isVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.el-popper {
  z-index: 10001 !important;
  p {
    font-size: 12px;
    color: #666;
  }
}
.side-dialog {
  top: 40px;
  right: 0px;
  z-index: 1000;
  width: calc(100% - 150px);
  position: fixed;
  margin-left: -20px;
  height: calc(100%);
  background-color: #ffffff;
  -moz-box-shadow: 2px 2px 5px #333333;
  -webkit-box-shadow: 2px 2px 5px #333333;
  box-shadow: 2px 2px 5px #333333;
  .top {
    width: calc(100vw - 185px) !important;
    justify-content: space-between;
    display: flex;
    padding: 20px 10px;
    border: 0;
    .top-left {
      display: flex;
      align-items: center;
      margin: 0;
      img {
        margin-right: 10px;
        width: 35px;
        height: 35px;
      }
      span {
        font-size: 14px;
        color: rgb(89, 89, 89);
      }
    }
  }
  .body {
    width: 100%;
    height: calc(100vh - 40px);
    .cont {
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(1000px);
  opacity: 0;
}
</style>

