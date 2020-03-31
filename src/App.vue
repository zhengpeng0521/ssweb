<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
.el-loading-mask.is-fullscreen {
  z-index: 14000 !important;
}
/* 更改新手引导Tooltip样式 */
.teststle {
  box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.2) !important;
  border: none !important;
  padding: 14px !important;
}

.teststle .popper__arrow {
  border-bottom-color: #eee !important;
  border-top-color: #eee !important;
}
.teststle .wracon {
  width: 154px;
  font-size: 14px;
}
.teststle .hittitle {
  color: #666;
  line-height: 20px;
}
.teststle .hitword {
  color: #1d9df2;
  margin-top: 5px;
  cursor: pointer;
}
.teststle .hitword:hover {
  color: rgba(29, 157, 242, 0.8);
}
.wrapallT {
  width: 400px !important;
  padding: 40px 20px 20px 23px !important;
}
/* 支付接口消息提示样式 */
.wrapallT .el-message-box__header {
  padding: 0 50px 10px !important;
}
.wrapallT .el-message-box__status {
  top: -45% !important;
}
.wrapallT .el-button {
  line-height: 3px;
}
.wrapallT .el-message-box__btns,
.wrapallTl .el-message-box__btns {
  padding: 0 !important;
}
.wrapallTl {
  width: 400px !important;
  padding: 5px 20px 20px 23px !important;
}
/* 短信取消订单提示 */
.wrapallTl .el-button--small {
  padding: 7px 15px !important;
}
</style>
