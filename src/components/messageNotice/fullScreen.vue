<template>
  <transition name="slide-fade">
    <div
      v-if="isVisible"
      ref="sideModal"
      :style="{zIndex:typeS == '服务订购' ? '199' : '99'}"
      class="fullScreen-dialog"
    >
      <div v-if="study" class="lbos">录播课件</div>
      <div class="topStyle">
        <div class="topStyleAll">
          <div>
            <i
              class="el-icon-arrow-left"
              @click="close"
            />
          </div>

          <div @click="close">返回</div>

          <div>|</div>

          <div>{{ type }}</div>
        </div>
      </div>

      <div v-if="study" style="width:98.3%;height:1px;background:rgba(238,238,238,1)" />
      <div v-else style="width:100%;height:1px;background:rgba(238,238,238,1);" />
      <slot />
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    'visible': {
      type: Boolean,
      default: true
    },
    'type': {
      type: String,
      default: ''
    },
    'study': {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      typeS: this.type,
      isVisible: this.visible
    }
  },
  watch: {
    'visible'(val) {
      this.isVisible = val
    },
    'isVisible'(val) {
      this.$emit('update:visible', val)
      if (val) {
        this.$nextTick(() => {
          const side = this.$refs.sideModal
          document.body.appendChild(side)
        })
      }
    },
    'type'(val) {
      this.typeS = val
    },
    'typeS'(val) {
      this.$emit('update:typeS', val)
    }
  },
  beforeDestroy() {
    const child = this.$el
    child.parentNode && child.parentNode.removeChild(child)
  },
  methods: {
    close() {
      this.isVisible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/mixin.scss";

.fullScreen-dialog {
  bottom: 0px;
  right: 0px;
  top: 68px;
  z-index: 99;
  width: calc(100vw - 150px);
  position: absolute;
  margin-left: -20px;
  height: calc(97vh - 40px);
  background-color: #ffffff;
  overflow: auto; /* // -moz-box-shadow: 2px 2px 5px #333333; */
  /* // -webkit-box-shadow: 2px 2px 5px #333333; */
  /* // box-shadow: 2px 2px 5px #333333; */
  .lbos {
    color:rgba(51, 51, 51, 1);
    padding: 20px 0 16px 20px;
    width: 100%;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    font-weight:500;
  }
  .topStyle {
    margin-left: 1.5%;
    height: 50px;
    overflow: hidden;
    .topStyleAll {
      margin-top: 18px;
      height: 14px;
      div {
        float: left;
      }
      div:nth-of-type(1) {
        cursor: pointer;
        color: #333;
        font-weight: 900;
      }
      div:nth-of-type(2) {
        height: 14px;
        cursor: pointer;
        margin-left: 2px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFangSC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 14px;
      }
      div:nth-of-type(3) {
        height: 12px;
        margin: 0 14px 0 14px;
        line-height: 12px;
        color: #dddddd;
      }
      div:nth-of-type(4) {
        height: 14px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFangSC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 14px;
      }
    }
  }
  .close-btn {
    width: 2.5rem;
    height: 2.5rem;
    position: absolute;
    left: -2.5rem;
    display: -webkit-box;
    -webkit-box-pack: center;
    -webkit-box-orient: vertical;
    text-align: center;
    background: #a2daf6;
    border-radius: 5px 0 0 5px;
    box-shadow: -1px 1px 10px #ddd;
    cursor: pointer;
  }
  .close-icon {
    width: 1rem;
    height: 1rem;
    margin-left: 0.3rem;
    transform: rotate(-180deg);
    transition: 0.5s;
    color: #fff;
  }
  .close-icon:hover {
    transform: rotate(180deg);
    transition: 0.5s;
  }
  .el-icon-close {
    transform: rotate(-180deg);
    transition: 0.5s;
    color: #fff;
  }
  .el-icon-close:hover {
    transform: rotate(180deg);
    transition: 0.5s;
  }
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
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
