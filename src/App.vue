<template>
  <div id="app">
    <routerView/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>

<style>
@import "http://at.alicdn.com/t/font_931962_8qxm8jt3pix.css";
</style>


// Dialog 组件
<style>
.el-button--primary{
  background-color:#433d85;
  border-color:#433d85;
}
.el-button--text{
  color:#433d85;
}
.el-pagination.is-background .el-pager li:not(.disabled).active{
  background-color:#433d85;
}
.el-button.is-plain:focus, .el-button.is-plain:hover{
  background-color:#433d85;
  border-color:#433d85;
  color:#fff;
}
.el-dialog {
  margin-bottom: 0;
}
.el-dialog__header {
  background-color: #f1f2f2;
  padding-top: 0;
  padding-bottom: 0;
  height: 50px;
  line-height: 50px;
}
.el-badge__content.is-fixed{
  right: 0;
}

.el-dialog__title {
  color: #101010;
  font-size: 14px;
}
.el-dialog__header .el-dialog__close {
  font-size: 18px;
  font-weight: bold;
  color: #101010;
}
.el-dialog__body,
.el-dialog__body .el-form-item__label,
.el-dialog__body .el-form-item__content {
  font-size: 12px;
}
.el-dialog__footer {
  padding-top: 0;
}
</style>
