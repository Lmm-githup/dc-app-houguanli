<template>
  <el-container>
    <!-- 头部 -->
    <el-header height="90px">
      <img src="../assets/logo.jpg">
      <div class="logo-title">康佰家导购宝后台管理</div>
    </el-header>
    <!-- 表单 -->
    <el-main :style="mainStyle">
      
      <LoginForm ref="loginFormRef" @login="login"/>
    </el-main>
    <!-- 页脚 -->
    <el-footer
      height="50px"
    >Copyright © 2019 版权所有 康佰家</el-footer>
  </el-container>
</template>

<script>
import store from "@/store";
import { mapMutations } from "vuex";

import commonService from "../service/common";

import LoginForm from "@/components/LoginForm";

export default {
  components: { LoginForm },
  store,
  computed: {
    mainStyle() {
      return {
        height: document.body.clientHeight - 140 + "px"
      };
    }
  },
  methods: {
    ...mapMutations(["updateToken", "updateUserInfo"]),

    login(loginForm, successCallback) {
      const { loginName, loginPwd, code, random } = loginForm;

      commonService
        .login(loginName, loginPwd, code, random)
        .then(({ code, msg, data }) => {
          if (code != 200) {
            this.$message.warning(msg);
            this.$refs.loginFormRef.freshVerifyImg();
            return;
          }
          this.updateToken(data.token);
          this.updateUserInfo(data);
          successCallback && successCallback();
        });
    }
  }
};
</script>

<style scoped>
.el-header {
  background-color: #f1f2f2;
  padding:0px;
  background-image:url('../assets/header-bg.jpg');
  background-size: auto 100%;
  border-bottom:1px solid #fff;
}
.logo-title{
  position:absolute;
  right:2%;
  top:32px;
  color:#f8c301;
  font-size:24px;
}
.el-header img {
  vertical-align: middle;
  background-color: #433d85;
  height: 89px;
}
.el-header h1 {
  display: inline-block;
  margin: 0 0 0 30px;
  font: normal 24px/90px Arial-regular;
}

.el-main {
  background-image: url("../assets/login_bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.el-footer {
  background-color: #433d85;
    border-top: 3px solid #f8c301;
    color: #858c8e;
    font-size: 12px;
    text-align: center;
    line-height: 50px;
    position: absolute;
    bottom: 0;
    width: 100%;
}
</style>
