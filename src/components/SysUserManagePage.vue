<template>
  <div>
    <BaseSearchForm @search="search">
      <el-form-item label="账号">
        <el-input v-model="formModel.loginName" placeholder="请输入账号" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-button slot="buttons" type="primary" @click="dialogVisibleModify = true">添加账号</el-button>
    </BaseSearchForm>

    <BaseTable :headerData="headerData" :tableData="tableData" @operate="operateSwitch"/>

    <BasePagination :paginator="paginator" @currentChange="search"/>

    <BaseDialogModify
      title="添加账号"
      :visible.sync="dialogVisibleModify"
      width="500px"
      @onSubmit="dialogSaveUser"
    >
      <el-form
        :model="dialogDataModify"
        :rules="dialogRulesModify"
        label-width="120px"
        ref="userInfoRef"
        size="mini"
        style="padding-right: 30px"
      >
        <el-form-item label="账号" prop="loginName">
          <el-input
            v-model="dialogDataModify.loginName"
            placeholder="请输入登陆账号"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input
            v-model="dialogDataModify.userName"
            placeholder="请输入姓名"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="dialogDataModify.mobile"
            placeholder="请输入手机号"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="loginPwd">
          <el-input
            v-model="dialogDataModify.loginPwd"
            type="password"
            placeholder="请输入新密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="againpwd">
          <el-input
            v-model="dialogDataModify.againpwd"
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
import sysUserService from "../service/sysUser";
import { MessageBox } from "element-ui";
export default {
  created() {
    this.search();
  },
  data() {
    const compairePsw = (rule, value, callback) => {
      let err;
      if (value !== this.dialogDataModify.loginPwd) {
        err = new Error("两次密码不匹配");
      }
      callback(err);
    };
    return {
      formModel: {
        loginName: ""
      },

      headerData: [
        {
          type: "",
          label: "账号"
        },
        {
          type: "",
          label: "姓名"
        },
        {
          type: "",
          label: "手机号"
        },
        {
          type: "tag",
          label: "状态"
        },
        {
          type: "operations",
          label: "操作"
        }
      ],
      tableData: [],
      paginator: {
        currentPage: 1,
        pageSize: 10,
        totalCounts: 0,
        totalPages: 0
      },

      dialogVisibleModify: false,
      dialogDataModify: {
        loginPwd: "",
        userNo: "",
        loginName: "",
        userName: "",
        mobile:"",
        operType: ""
      },
      dialogRulesModify: {
        loginPwd: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, message: "密码少于6位", trigger: "blur" }
        ],
        loginName: [
          { required: true, message: "请输入登陆账号", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        againpwd: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: compairePsw, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    search() {
      sysUserService
        .userList(
          this.paginator.currentPage,
          this.paginator.pageSize,
          this.formModel.loginName
        )
        .then(({ code, msg, data }) => {
          if (code != 200) {
            this.$message.warning(msg);
            return;
          }

          if (!data) return;
          const { paginator, list } = data;

          this.paginator = paginator;
          this.tableData = list.map(v => {
            return [
              v.loginName,
              v.userName,
              v.mobile,
              v.userStatus == 1 ? ["正常", "success"] : ["禁用", "warning"],
              v.loginName == 'admin' ? '-' : v.userRole == 1 ? (v.userStatus==1 ? ["禁用","重置密码"] : ["启用"]) : '-',
              v
            ];
          });
        });
    },

    operateSwitch(act, { userNo }) {
      this.dialogDataModify.userNo = userNo;
      let text = "";
      switch (act) {
        case "禁用":
          this.dialogDataModify.operType = 'invalid';
          text = "确定要禁用该用户吗？"
          break;
         case "启用": 
          this.dialogDataModify.operType = 'active';
          text = "确定要启用该用户吗？"
          break;
        case "重置密码": 
          text = "确定要重置密码吗？"
          this.dialogDataModify.operType = 'resetPwd';
          break;
        default:
          this.dialogDataModify.operType = "";
          break;
      }
      if(!this.dialogDataModify.operType){
        return;
      }
      MessageBox.confirm(text, "信息", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "info"
          }).then(_ => {
            if(this.dialogDataModify.operType == 'resetPwd'){
              sysUserService.resetPwd(userNo).then(({ code, msg, data }) => {
                if (code != 200) {
                  this.$message.warning(msg);
                  return;
                }
                this.$message.success("操作成功");
                this.search();
              });
            }else{
              sysUserService.updateUserStatus(userNo,this.dialogDataModify.operType).then(({ code, msg, data }) => {
                if (code != 200) {
                  this.$message.warning(msg);
                  return;
                }
                this.$message.success("操作成功");
                this.search();
              });
            }
          }).catch(_ => {});
    },

    dialogSaveUser() {
      this.$refs["userInfoRef"].validate(valid => {
        if (!valid) return;
        sysUserService
          .save(this.dialogDataModify.userNo, this.dialogDataModify.loginName, this.dialogDataModify.loginPwd,this.dialogDataModify.userName,this.dialogDataModify.mobile)
          .then(({ code, msg, data }) => {
            this.$refs["userInfoRef"].resetFields();

            if (code != 200) {
              this.$message.warning(msg);
              return;
            }

            this.$message.success("操作成功");
            this.search();
            this.dialogVisibleModify = false;
          });
      });
    }
  }
};
</script>
