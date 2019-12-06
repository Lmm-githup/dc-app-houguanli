<template>
  <div>
    <BaseSearchForm @search="search">
      <el-form-item label="部门编号">
        <el-input v-model="formModel.orgCode" placeholder="请输入部门编号" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="部门名称">
        <el-input v-model="formModel.orgName" placeholder="请输入部门名称" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-button slot="buttons" type="primary" @click="addOrg">添加部门</el-button>
    </BaseSearchForm>

    <BaseTable :headerData="headerData" :tableData="tableData" @operate="operateSwitch"/>

    <BasePagination :paginator="paginator" @currentChange="search"/>

    <BaseDialogModify
      title="添加部门"
      :visible.sync="dialogVisibleModify"
      width="500px"
      @onSubmit="dialogSaveOrg"
    >
      <el-form
        :model="dialogDataModify"
        :rules="dialogRulesModify"
        label-width="120px"
        ref="validateInfoRef"
        size="mini"
        style="padding-right: 30px"
      >
        <el-form-item label="部门编码" prop="orgCode">
          <el-input
            v-model="dialogDataModify.orgCode"
            placeholder="请输入部门编码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="orgName">
          <el-input
            v-model="dialogDataModify.orgName"
            placeholder="请输入部门名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortSn">
          <el-input-number
            v-model="dialogDataModify.sortSn"
            autocomplete="off"
            :min="0"
            :max="10000"
          ></el-input-number >
          <label>排序数值越小越靠前</label>
        </el-form-item>
        <el-form-item label="上级部门" prop="parentRow">
           <el-select v-model="dialogDataModify.parentRow" filterable style="width:100%;">
             <el-option label="无" value=""></el-option>
              <el-option v-for="(data,index) in orgList" :key="index" :label="data.orgName" :value="data.rowNo"></el-option>
           </el-select>
        </el-form-item>
      </el-form>
    </BaseDialogModify>
  </div>
</template>

<script>
import orgService from "../service/org";
import { MessageBox } from "element-ui";
export default {
  created() {
    this.init();
    this.search();
  },
  data() {
    return {
      formModel: {
        orgCode: "",
        orgName: ""
      },

      headerData: [
        {
          type: "",
          label: "部门编码"
        },
        {
          type: "",
          label: "部门名称"
        },
        {
          type: "",
          label: "上级部门"
        },
        {
          type: "tag",
          label: "状态"
        },
        {
          type: "",
          label: "序号"
        },
        {
          type: "",
          label: "创建时间"
        },
        {
          type: "",
          label: "修改时间"
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
        rowNo: "",
        orgCode: "",
        orgName: "",
        parentRow:"",
        sortSn: 0
      },
      dialogRulesModify: {
        orgCode: [
          { required: true, message: "请输入部门编码", trigger: "blur" },
        ],
        orgName: [
          { required: true, message: "请输入部门名称", trigger: "blur" }
        ]
      },
      orgList:[]
    };
  },
  methods: {
    init(){
      orgService
        .list(1,10000,'','')
        .then(({ code, msg, data }) => {
          if (code != 200) {
            this.$message.warning(msg);
            return;
          }
          const { paginator, list } = data;
          this.orgList = list;
        });
    },
    search() {
      orgService
        .list(
          this.paginator.currentPage,
          this.paginator.pageSize,
          this.formModel.orgCode,
          this.formModel.orgName
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
              v.orgCode,
              v.orgName,
              v.parentName,
              v.orgStatus == 1 ? ["正常", "success"] : ["禁用", "warning"],
              v.sortSn ? v.sortSn : 0,
              v.gmtCreate,
              v.gmtModified,
              ["修改","查看详情"],
              v
            ];
          });
        });
    },
    addOrg(){
       this.reset();
       this.dialogVisibleModify = true;
    },
    operateSwitch(act, { rowNo,orgCode,orgName,sortSn,parentRow }) {
      this.dialogDataModify.rowNo = rowNo;
      let text = "";
      switch (act) {
        case "修改":
          this.reset();
          this.dialogDataModify.orgCode = orgCode;
          this.dialogDataModify.orgName = orgName;
          this.dialogDataModify.parentRow = parentRow;
          this.dialogDataModify.rowNo = rowNo;
          this.dialogDataModify.sortSn = sortSn;
          this.dialogVisibleModify = true;
          break;
        case "查看详情": 
          this.dialogVisibleModify = true;
          break;
        default:
          break;
      }

    },
    reset(){
      this.dialogDataModify.orgCode = '';
      this.dialogDataModify.orgName = '';
      this.dialogDataModify.parentRow = '';
      this.dialogDataModify.rowNo = '';
      this.dialogDataModify.sortSn = 0;

    },
    dialogSaveOrg() {
      this.$refs["validateInfoRef"].validate(valid => {
        if (!valid) return;
        orgService
          .save(this.dialogDataModify.rowNo, this.dialogDataModify.orgCode, this.dialogDataModify.orgName,this.dialogDataModify.parentRow,this.dialogDataModify.sortSn)
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
