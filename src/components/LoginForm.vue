<template>
  <el-form :model="formData" ref="loginFormRef" :rules="formRules" class="demo-form-inline">
    <h3>欢迎登录</h3>
    <!-- 用户名 -->
    <el-form-item prop="loginName">
      <el-input v-model="formData.loginName" placeholder="请输入用户名">
        <i slot="prefix" class="iconfont icon-user"></i>
      </el-input>
    </el-form-item>
    <!-- 密码 -->
    <el-form-item prop="loginPwd">
      <el-input type="password" v-model="formData.loginPwd" placeholder="请输入密码">
        <i slot="prefix" class="iconfont icon-password"></i>
      </el-input>
    </el-form-item>
    <!-- 验证码 -->
    <el-form-item prop="code">
      <el-row type="flex" align="middle" justify="space-between">
        <el-col :span="14">
          <el-input
            v-model="formData.code"
            placeholder="请输入验证码"
            @keyup.enter.native="formSubmit"
          ></el-input>
        </el-col>
        <el-col :span="-1">
          <div class="verify_img" @click="freshVerifyImg">
            <img :src="verifyImage">
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-row type="flex" justify="space-between">
      <el-col :span="-1">
        <el-checkbox v-model="formData.rememberPwd">记住密码</el-checkbox>
      </el-col>
      <!--<el-col :span="-1">
        <el-button type="text">忘记密码</el-button>
      </el-col>-->
    </el-row>
    <!-- 登录 -->
    <el-form-item>
      <el-button class="login-button" :loading="loading" type="primary" @click="formSubmit">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import store from "@/store";
import { mapState } from "vuex";

import commonService from "../service/common";

export default {
  created() {
    // 获取验证码
    this.freshVerifyImg();

    // 记住密码
    (() => {
      let rememberPwd = this.$cookie.get(this.cookiePrefix + "rememberPwd");
      rememberPwd = JSON.parse(rememberPwd);
      if (!rememberPwd) return;
      this.formData.loginName = rememberPwd[0];
      this.formData.loginPwd = rememberPwd[1];
      this.formData.rememberPwd = true;
    })();
  },
  data() {
    return {
      verifyImage: "",
      loading:false,
      formData: {
        loginName: "",
        loginPwd: "",
        code: "",
        random: "",
        rememberPwd: false
      },
      formRules: {
        loginName: this.$formRules.blur("用户名"),
        loginPwd: this.$formRules.blur("密码"),
        code: this.$formRules.blur("验证码")
      }
    };
  },
  store,
  computed: mapState(["cookiePrefix"]),
  methods: {
    freshVerifyImg() {
      commonService.code().then(({ code, msg, data }) => {
        if (code != 200) {
          this.$message.warning(msg);
          return;
        }
        const { img, random } = data;
        this.verifyImage = img;
        this.formData.random = random;
        this.formData.code = '';
      });
    },
    formSubmit() {
      this.$refs.loginFormRef.validate(
        valid =>
          valid &&
          this.$emit("login", this.formData, () => {
            this.$cookie.set(this.cookiePrefix + "isLogin", true);

            // 记住密码
            if (this.formData.rememberPwd) {
              this.$cookie.set(
                this.cookiePrefix + "rememberPwd",
                JSON.stringify([
                  this.formData.loginName,
                  this.formData.loginPwd
                ]),
                7
              );
            } else {
              this.$cookie.delete(this.cookiePrefix + "rememberPwd");
            }

            this.$router.push("/");
          })
      );
    }
  }
};
</script>

<style scoped>
.el-form {
  width: 300px;
  background-color: #fff;
  position: absolute;
  top: 100px;
  right: 125px;
  padding: 20px;
  border-radius:5px;
}
.el-form h3 {
  text-align: center;
  color: #101010;
  font-size: 24px;
  font-weight: normal;
}
.el-form img {
  vertical-align: top;
}
.login-button {
  width: 100%;
  margin-top: 15px;
}
.s-canvas {
  transform: translateY(7px);
}
.verify_img {
  cursor: pointer;
}
</style>
