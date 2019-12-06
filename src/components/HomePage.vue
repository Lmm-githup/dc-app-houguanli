<template>
  <div style="height: 100%">
    <el-container class="home">
      <!-- 头部 -->
        <el-header height="70px">
          <HomeHeader
            :menuList="['修改密码']"
            @click="opertateSwitchHeaderMenu"
          />
        </el-header>
      
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="120px">
          <HomeSidebar :menuList="menuList"/>
        </el-aside>
        <!-- 路由区域 -->
        <el-main>
          <transition name="el-fade-in" mode="out-in">
            <routerView/>
          </transition>
        </el-main>
      </el-container>
    </el-container>

    <BaseDialogRead title="个人信息" :visible.sync="dialogVisibleUser" width="400px">
      <BaseCols :list="dialogDataUser" :column="1" labelWidth="120px"/>
    </BaseDialogRead>

    <BaseDialogModify
      title="修改密码"
      :visible.sync="dialogVisiblePwd"
      width="500px"
      @onSubmit="dialogSavePwd"
    >
      <el-form
        :model="dialogDataPwd"
        :rules="dialogRulesPwd"
        label-width="120px"
        ref="pwdInfoRef"
        size="mini"
        style="padding-right: 30px"
      >
        <el-form-item label="旧的登陆密码" prop="oldpwd">
          <el-input
            v-model="dialogDataPwd.oldpwd"
            type="password"
            placeholder="请输入旧的登陆密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpwd">
          <el-input
            v-model="dialogDataPwd.newpwd"
            type="password"
            placeholder="请输入新密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码" prop="againpwd">
          <el-input
            v-model="dialogDataPwd.againpwd"
            type="password"
            placeholder="请再次输入新密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </BaseDialogModify>
  </div>
</template>

<script>
import HomeHeader from "@/components/HomeHeader";
import HomeSidebar from "@/components/HomeSidebar2";
import sysUserService from "../service/sysUser";

import store from "@/store";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    HomeHeader,
    HomeSidebar
  },
  data() {
    const compairePsw = (rule, value, callback) => {
      let err;
      if (value !== this.dialogDataPwd.newpwd) {
        err = new Error("两次密码不匹配");
      }
      callback(err);
    };
    return {
      menuList: [
        {
          title: "首页",
          index: "Home",
          icon: 'iconfont el-icon-kbjzhuye'
        },
        {
          title: "账号管理",
          icon: 'iconfont el-icon-kbjsuo',
          children: [
            {
              title: "用户管理",
              index: "SysUserManage"
            }
          ]
        },
        {
          title: "导购管理",
          icon: 'iconfont el-icon-kbjyuangong',
          children: [
            {
              title: "员工管理",
              index: "EmployeeManage"
            },
            {
              title: "部门管理",
              index: "OrgManage"
            },
            {
              title: "职位管理",
              index: "PositionManage" 
            },
            {
              title: "角色管理",
              index: "RoleManage"
            },
            {
              title: "权限管理",
              index: "AuthManage"
            }
          ]
        },
        {
          title: "活动管理",
          index: "ActivityManage",
          icon: 'iconfont el-icon-kbjhuodong'
        },
        {
          title: "培训管理",
          index: "TraningManage",
          icon: 'iconfont el-icon-kbjpeixun'
        },
        {
          title: "通告管理",
          index: "AnnouncementManage",
          icon: 'iconfont el-icon-kbjtonggao'
        },
        {
          title: "会员权益",
          index: "EquityManage",
          icon: 'iconfont el-icon-kbjquanyiguanli'
        },
        {
          title: "数据导入",
          icon: 'iconfont el-icon-kbjhuodong',
          children: [
            {
              title: "明星产品",
              index: "StarProductManage"
            },
            {
              title: "挂金产品",
              index: "GoldProductManage"
            }
          ]
        },
        {
          title: "用户使用情况",
          index: "UserAnalysisManage",
          icon: 'iconfont el-icon-kbjpeixun'
        },
        /*{
          title: "论坛管理",
          icon: 'iconfont el-icon-kbjbbs',
          children: [
            {
              title: "版块管理",
              index: "PlatManage"
            },
            {
              title: "账子管理",
              index: "PostsManage"
            }
          ]
        }*/
      ],

      dialogVisibleUser: false,
      dialogDataUser: [],

      dialogVisiblePwd: false,
      dialogDataPwd: {
        oldpwd: "",
        newpwd: "",
        againpwd: ""
      },
      dialogRulesPwd: {
        oldpwd: [
          { required: true, message: "请输入旧的登录密码", trigger: "blur" }
        ],
        newpwd: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, message: "密码少于6位", trigger: "blur" }
        ],
        againpwd: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: compairePsw, trigger: "blur" }
        ]
      }
    };
  },
  store,
  computed: mapState(["userInfo", "messageNum"]),
  methods: {
    ...mapMutations(["updateUserInfo", "updateMessageCount"]),

    opertateSwitchHeaderMenu(title) {
      switch (title) {
        case "个人信息":
          this.dialogVisibleUser = true;
          break;
        case "修改密码":
          this.dialogVisiblePwd = true;
          break;

        default:
          break;
      }
    },

    dialogSavePwd() {
      this.$refs["pwdInfoRef"].validate(valid => {
        if (!valid) return;
        sysUserService
          .updatePwd(this.dialogDataPwd.oldpwd, this.dialogDataPwd.newpwd)
          .then(({ code, msg, data }) => {
            this.$refs["pwdInfoRef"].resetFields();

            if (code != 200) {
              this.$message.warning(msg);
              return;
            }

            this.$message.success("修改成功");
            this.dialogVisiblePwd = false;
          });
      });
    }
  },
  created() {
    
  }
};
</script>

<style scoped>
/* 主页 */
.home {
  height: 100%;
  color: #333;
}

/* 头部 */
.el-header {
  line-height: 70px;
  background-color: #433d85;
  background-image:url('../assets/header-bg.jpg');
  background-size: auto 100%;
  border-bottom: 1px solid #433d85;
  color:#fff;
  padding: 0px 20px 0px 0px;
}

/* 侧边栏 */
.el-aside {
  background-color: #16161c;
}

/* 路由区域 */
.el-main {
  background-color: #fff;
  position: relative;
}
</style>
