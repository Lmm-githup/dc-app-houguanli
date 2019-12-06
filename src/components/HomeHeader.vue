<template>
  <div>
    <el-row type="flex" justify="space-between">
      <!-- HeaderTitle -->
      <el-col :span="-1">
        <img class="logo" src="../assets/logored.png"><!--<h2 class="header_title">{{ headerTitle }}</h2>-->
        <!--<span class="logo-title">{{headerTitle}}</span>-->
      </el-col>
      <el-col :span="-1">
        <!-- 下拉菜单 -->
        <el-dropdown trigger="click" @command="$emit('click', $event)">
          <span class="el-dropdown-link">
            欢迎,
            <b>{{ userInfo.userName }}</b>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in menuList"
              :key="index"
              :divided="index !== 0"
              :command="item"
            >{{ item }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 退出登录 -->
        <el-button type="text" class="logout" @click="logout">
          <i class="iconfont icon-ai240" style="color:black"></i>
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { MessageBox } from "element-ui";

import store from "@/store";
import { mapState, mapMutations } from "vuex";

export default {
  props: {
    headerTitle: {
      type: String,
      default: "德成鸿业导购宝后台管理"
    },
    menuList: {
      type: Array,
      required: true,
      default() {
        return ["个人信息", "修改密码"];
      }
    }
  },
  store,
  computed: mapState(["cookiePrefix", "userInfo", "messageNum"]),
  methods: {
    ...mapMutations(["updateUserInfo", "resetState"]),
    logout() {
      MessageBox.confirm("此操作将退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.resetState();
          this.$cookie.delete(this.cookiePrefix + "isLogin");
          this.$router.push({ name: "LoginPage" });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
/* header_title */
.header_title {
  margin: 0;
  font-size: 20px;
}

/* 下拉菜单 */
.el-dropdown {
  height: 16px;
  line-height: 16px;
}
.el-dropdown-link {
  cursor: pointer;
  /*color: #fff;*/
  color:#3c3c3c;
  font-size: 12px;
}
.mark {
  vertical-align: initial;
}

/* 退出 */
.logout i {
  font-size: 20px;
  color: #fff;
  margin-left: 20px;
  vertical-align: sub;
}

.logo{
  /*height: 70px;*/
  padding: 10px;
}
</style>
