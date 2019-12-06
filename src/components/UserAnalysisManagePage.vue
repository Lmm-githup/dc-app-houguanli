<template>
  <div>
    <BaseSearchForm @search="search">
      <el-form-item label="姓名">
        <el-input v-model="formModel.userName" placeholder="请输入姓名" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="职务">
        <el-input v-model="formModel.positionName" placeholder="职务" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="所属部门">
        <el-input v-model="formModel.orgName" placeholder="请输入所属部门" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="所属区域">
        <el-input v-model="formModel.regionName" placeholder="请输入所属区域" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-button slot="buttons" type="primary" :loading="loading" @click="exportExcel">导出Excel</el-button>
    </BaseSearchForm>

    <BaseTable :headerData="headerData" :tableData="tableData" @operate="operateSwitch"/>

    <BasePagination :paginator="paginator" @currentChange="search"/>
  </div>
</template>

<script>
import employeeService from "../service/employee";
import { MessageBox } from "element-ui";
import moment from 'moment'
export default {
  created() {
    this.exportUrl = employeeService.exportExcelUrl;
    this.search();
  },
  data() {
    return {
      formModel: {
        userName: "",
        positionName: "",
        orgName:"",
        regionName:""
      },
      exportUrl: "",
      loading: false,

      headerData: [
        {
          type: "",
          label: "姓名"
        },
        {
          type: "",
          label: "职务"
        },
        {
          type: "",
          label: "所在部门"
        },
        {
          type: "",
          label: "所属区域"
        },
        {
          type: "",
          label: "最近登录时间"
        },
        {
          type: "",
          label: "登录次数"
        }
      ],
      tableData: [],
      paginator: {
        currentPage: 1,
        pageSize: 10,
        totalCounts: 0,
        totalPages: 0
      },
    };
  },
  methods: {
    search() {
      employeeService
        .loginList(
          this.paginator.currentPage,
          this.paginator.pageSize,
          this.formModel.userName,
          this.formModel.positionName,
          this.formModel.orgName,
          this.formModel.regionName
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
              v.userName,
              v.positionName,
              v.orgName,
              v.regionName,
              v.lastLoginTime ? moment(v.lastLoginTime).format('YYYY-MM-DD HH:mm:SS') : '-',
              v.loginNum ? v.loginNum : 0,
              v
            ];
          });
        });
    },
    exportExcel(){
      //this.loading = true;
      
      /*employeeService.exportExcel(
        this.formModel.userName,
        this.formModel.positionName,
        this.formModel.orgName,
        this.formModel.regionName
      ).then(({ code,msg,data }) => {
        this.loading = false;
        if(code != 200){
          //this.$message.warning(msg);
        }
      });*/
      let url = process.env.baseURL+'/web/user/userLoginExcel?userName='+this.formModel.userName 
          + '&positionName='+this.formModel.positionName
          + '&orgName='+this.formModel.orgName
          + '&regionName='+this.formModel.regionName;
      window.open(url,'_blank');
    },
    operateSwitch(act, { userNo }) {
      
    },
  }
};
</script>
