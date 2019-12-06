<template>
  <div>
    <BaseSearchForm @search="search">
      <el-form-item label="员工编号">
        <el-input v-model="formModel.userCode" placeholder="请输入员工编号" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formModel.userName" placeholder="请输入姓名" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="部门">
        <el-input v-model="formModel.orgName" placeholder="请输入部门" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formModel.mobile" placeholder="请输入手机号" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <!--<el-form-item label="邮箱">
        <el-input v-model="formModel.email" placeholder="请输入邮箱" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="员工状态">
        <BaseSelect type="userStatus" :value.sync="formModel.userStatus" @change="search"/>
      </el-form-item>-->
      <el-button slot="buttons" type="primary" @click="addEmp">添加员工</el-button>
    </BaseSearchForm>

    <BaseTable :headerData="headerData" :tableData="tableData" @operate="operateSwitch"/>

    <BasePagination :paginator="paginator" @currentChange="search"/>

    <BaseDialogModify
      title="添加员工"
      :visible.sync="dialogVisibleModify"
      width="500px"
      @onSubmit="dialogSaveUser"
    >
      <el-form
        :model="dialogDataModify"
        :rules="dialogRulesModify"
        label-width="120px"
        ref="validateInfoRef"
        size="mini"
        style="padding-right: 30px"
      >
        <el-form-item label="员工号" prop="userCode">
          <el-input
            v-model="dialogDataModify.userCode"
            placeholder="请输入员工号"
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
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="dialogDataModify.email"
            placeholder="请输入邮箱"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!--<el-form-item label="职位" prop="positionNo">
           <el-select v-model="dialogDataModify.positionNo" filterable style="width:100%;">
              <el-option v-for="data in positionList" :key="data.rowNo" :label="data.orgName +' - ' +data.positionName" :value="data.rowNo">
                <span style="float: left">{{ data.orgName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ data.positionName }}</span>
              </el-option>
           </el-select>
        </el-form-item>-->
        <el-form-item label="职位" prop="positionNo">
           <el-input
            @click.native="selectPosition"
            v-model="dialogDataModify.positionName"
            placeholder="请选择职位"
            readonly="readonly"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="loginPwd" v-if="addFlag">
          <el-input
            v-model="dialogDataModify.loginPwd"
            type="password"
            placeholder="请输入新密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="againpwd" v-if="addFlag">
          <el-input
            v-model="dialogDataModify.againpwd"
            type="password"
            placeholder="请再次输入新密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </BaseDialogModify>


    <BaseDialog 
      title="选择职位"
      :visible.sync="dialogVisiblePosition"
      width="770px"
    >
      <BaseSearchForm @search="search_position">
      <el-form-item label="职位编码">
        <el-input v-model="formModel_position.code" placeholder="请输入职位编码"></el-input>
      </el-form-item>
      <el-form-item label="职位名称">
        <el-input v-model="formModel_position.name" placeholder="请输入职位名称"></el-input>
      </el-form-item>
      </BaseSearchForm>
      <el-table :data="positionList" style="width: 100%">
        <el-table-column prop="orgName" label="部门名称" width="230px"></el-table-column>
        <el-table-column prop="positionCode" label="职位编码" width="200px"></el-table-column>
        <el-table-column prop="positionName" label="职位名称" width="200px"></el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <BasePagination :paginator="paginator_position" @currentChange="init"/>
    </BaseDialog>
  </div>
</template>

<script>
import employeeService from "../service/employee";
import positionService from "../service/position";
import { MessageBox } from "element-ui";
export default {
  created() {
    this.init();
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
        userCode: "",
        userName: "",
        orgName: "",
        userStatus: "",
        mobile: "",
        email: ""
      },
      addFlag: true,
      headerData: [
        {
          type: "",
          width: "120px",
          label: "员工编号"
        },
        {
          type: "",
          width: "120px",
          label: "登陆账号"
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
          type: "",
          label: "部门"
        },
        {
          type: "",
          label: "职位"
        },
        {
          type: "tag",
          width: "100px",
          label: "状态"
        },
        {
          type: "operations",
          width: "250px",
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
        againpwd: "",
        userNo: "",
        userCode: "",
        userName: "",
        mobile:"",
        email: "",
        positionNo: "",
        positionName: "",
        operType: ""
      },
      dialogRulesModify: {
        loginPwd: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, message: "密码少于6位", trigger: "blur" }
        ],
        userCode: [
          { required: true, message: "请输入员工编号", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        positionNo: [
          { required: true, message: "请选择职位", trigger: "blur" }
        ],
        againpwd: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: compairePsw, trigger: "blur" }
        ]
      },
      positionList: [],
      dialogVisiblePosition: false,
      paginator_position: {
        currentPage: 1,
        pageSize: 8,
        totalCounts: 0,
        totalPages: 0
      },
      formModel_position:{
        name: '',
        code: '',
      }
    };
  },
  methods: {
    init(){
      positionService.noUseList(
        this.paginator_position.currentPage,
        this.paginator_position.pageSize,this.formModel_position.code,this.formModel_position.name,'','')
      .then(({ code, msg, data }) => {
          if (code != 200) {
            this.$message.warning(msg);
            return;
          }
          const { paginator, list } = data;
          this.positionList = list;
          this.paginator_position = paginator;
        });
    },
    search_position(){
       this.paginator_position.currentPage = 1;
       this.init();
    },
    selectPosition() {
       this.dialogVisiblePosition = true;
    },
    handleClick(row){
      this.dialogDataModify.positionNo = row.rowNo;
      this.dialogDataModify.positionName = row.positionName;
      this.dialogVisiblePosition = false;
    },
    search() {
      employeeService
        .empList(
          this.paginator.currentPage,
          this.paginator.pageSize,
          this.formModel.userCode,
          this.formModel.mobile,
          this.formModel.orgName,
          this.formModel.userName,
          this.formModel.userStatus,
          this.formModel.email
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
              v.userCode,
              v.loginName,
              v.userName,
              v.mobile,
              v.orgName,
              v.positionName,
              v.userStatus == 1 ? ["正常", "success"] : ["禁用", "warning"],
              v.userStatus==1 ? ["修改","禁用","重置密码", "解绑"] : ["启用","查看详情"],
              v
            ];
          });
        });
    },
    addEmp(){
      this.addFlag = true;
      this.reset();
      this.dialogVisibleModify = true;
    },
    reset(){
        this.dialogDataModify.loginPwd = "";
        this.dialogDataModify.userNo = "";
        this.dialogDataModify.userCode = "";
        this.dialogDataModify.userName = "";
        this.dialogDataModify.mobile = "";
        this.dialogDataModify.email = "";
        this.dialogDataModify.positionNo = '';
        this.dialogDataModify.positionName = '';
        this.dialogDataModify.againpwd = '';
    },
    operateSwitch(act, { userNo,userCode,userName,mobile,email,positionNo,positionName }) {
      this.dialogDataModify.userNo = userNo;
      let text = "";
      switch (act) {
        case "禁用":
          this.dialogDataModify.operType = 'invalid';
          text = "确定要禁用该员工吗？"
          break;
         case "启用": 
          this.dialogDataModify.operType = 'active';
          text = "确定要启用该员工吗？"
          break;
        case "重置密码": 
          text = "确定要重置密码吗？"
          this.dialogDataModify.operType = 'reset';
          break;
        case "解绑": 
          text = "确定要解绑吗？"
          this.dialogDataModify.operType = 'unbind';
          break;
        case "修改": 
          this.addFlag = false;
          this.reset();
          this.dialogDataModify.userNo = userNo;
          this.dialogDataModify.userCode = userCode;
          this.dialogDataModify.userName = userName;
          this.dialogDataModify.mobile = mobile;
          this.dialogDataModify.email = email;
          this.dialogDataModify.positionNo = positionNo;
          this.dialogDataModify.positionName = positionName;
          this.dialogVisibleModify = true;
          this.dialogDataModify.operType = '';
          break;
        case "查看详情": 
          this.dialogVisibleModify = true;
          this.dialogDataModify.userNo = userNo;
          this.dialogDataModify.userCode = userCode;
          this.dialogDataModify.userName = userName;
          this.dialogDataModify.mobile = mobile;
          this.dialogDataModify.email = email;
          this.dialogDataModify.positionNo = positionNo;
          this.dialogVisibleModify = true;
          this.dialogDataModify.operType = '';
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
              if(this.dialogDataModify.operType == 'reset'){
                employeeService.resetPwd(userNo,this.dialogDataModify.loginPwd).then(({ code, msg, data }) => {
                  if (code != 200) {
                    this.$message.warning(msg);
                    return;
                  }
                  this.$message.success("操作成功");
                  this.search();
                });
              }else if(this.dialogDataModify.operType == 'unbind'){
                employeeService.unbind(userCode).then(({ code, msg, data }) => {
                  if (code != 200) {
                    this.$message.warning(msg);
                    return;
                  }
                  this.$message.success("操作成功");
                  this.search();
                });
              }else{
                employeeService.updateEmpStatus(userNo,this.dialogDataModify.operType).then(({ code, msg, data }) => {
                  if (code != 200) {
                    this.$message.warning(msg);
                    return;
                  }
                  this.$message.success("操作成功");
                  this.search();
                });
              }
            })
            .catch(_ => {});
    },

    dialogSaveUser() {
      this.$refs["validateInfoRef"].validate(valid => {
        if (!valid) return;
        employeeService
          .save(this.dialogDataModify.userNo, this.dialogDataModify.userCode, this.dialogDataModify.mobile,
          this.dialogDataModify.userName,this.dialogDataModify.email,this.dialogDataModify.positionNo,this.dialogDataModify.loginPwd)
          .then(({ code, msg, data }) => {
            if (code != 200) {
              this.$message.warning(msg);
              return;
            }
            this.$refs["validateInfoRef"].resetFields();
            this.$message.success("操作成功");
            this.search();
            this.dialogVisibleModify = false;
          });
      });
    }
  }
};
</script>
