<template>
  <div>
    <BaseSearchForm @search="search">
      <el-form-item label="活动名称">
        <el-input v-model="formModel.activityName" placeholder="请输入活动名称" @keyup.enter.native="search"></el-input>
      </el-form-item>
      
      <el-button slot="buttons" type="primary" @click="addActivity">添加活动</el-button>
    </BaseSearchForm>

    <BaseTable :headerData="headerData" :tableData="tableData" @operate="operateSwitch"/>

    <BasePagination :paginator="paginator" @currentChange="search"/>

    <BaseDialogModify
      title="添加活动"
      :visible.sync="dialogVisibleModify"
      width="600px"
      @onSubmit="dialogSaveActivity"
    >
      <el-form
        :model="dialogDataModify"
        :rules="dialogRulesModify"
        label-width="120px"
        ref="validateInfoRef"
        size="mini"
        style="padding-right: 30px"
      >
        <el-form-item label="活动名称" prop="activityName">
          <el-input
            v-model="dialogDataModify.activityName"
            placeholder="请输入活动名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动类型" prop="activityType">
          <BaseSelect
                type="activityType"
                :value.sync="dialogDataModify.activityType"
                placeholder="请选择活动类型"
                :showAll="false"
              />
        </el-form-item>
        <el-form-item label="活动时间" prop="daterange">
          <el-date-picker
            v-model="dialogDataModify.daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="适应范围" prop="scopeType">
           <el-select v-model="dialogDataModify.scopeType">
             <el-option label="所有门店" value="all"></el-option>
             <el-option label="指定门店" value="assign"></el-option>
           </el-select>
        </el-form-item>
        <el-form-item label="选择门店" prop="storeRows" v-if="dialogDataModify.scopeType == 'assign'">
           <el-select v-model="dialogDataModify.storeRows" multiple filterable>
             <el-option v-for="(data,index) in orgList" :key="index" :label="data.orgName" :value="data.rowNo"></el-option>
           </el-select>
        </el-form-item>
        <el-form-item label="活动描述" prop="activityDesc">
           <el-input
            type="textarea"
            v-model="dialogDataModify.activityDesc"
            rows="5"
            placeholder="请输入活动描述"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </BaseDialogModify>
  </div>
</template>

<script>
import activityService from "../service/activity";
import orgService from "../service/org";
import { MessageBox } from "element-ui";
import moment from 'moment'

export default {
  created() {
    this.initOrg();
    this.search();
  },
  data() {
    return {
      formModel: {
        activityName: "",
        activityStatus: ''
      },
      
      headerData: [
        {
          type: "",
          label: "活动名称"
        },
        {
          type: "",
          width: "120px",
          label: "活动类型"
        },
        {
          type: "",
          label: "活动时间"
        },
        {
          type: "",
          label: "适应范围"
        },
        {
          type: "",
          label: "创建时间"
        },
        {
          type: "tag",
          width: "120px",
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
        rowNo: '',
        activityName: "",
        activityType: '',
        startDate: "",
        endDate: "",
        scopeType: "",
        storeRows:[],
        storeNames:[],
        activityDesc: '',
        daterange: [],
      },
      dialogRulesModify: {
        activityName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        daterange: [
          { required: true, message: "请选择开始和结束时间", trigger: "blur" },
        ],
        scopeType: [
          { required: true, message: "请选择适应范围", trigger: "blur" },
        ],
        activityType: [
          { required: true, message: "请选择活动类型", trigger: "blur" }
        ]
      },
      orgList: []
    };
  },
  methods: {
    initOrg(){
      orgService
        .list(0,9999,'','')
        .then(({ code, msg, data }) => {
          if (code != 200) {
            this.$message.warning(msg);
            return;
          }
          if (!data) return;
          const { paginator, list } = data;
          this.orgList = list;
        });
    },
    search() {
      activityService
        .list(
          this.paginator.currentPage,
          this.paginator.pageSize,
          this.formModel.activityName,
          this.formModel.activityStatus
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
              v.activityName,
              v.activityTypeName,
              v.startDate + ' ~ ' + v.endDate,
              v.scopeType == 'all' ? '所有门店' : v.storeNames,
              v.gmtCreate,
              v.activityStatus == 0 ? ["已过期", "warning"] : v.activityStatus == 1 ? ["进行中", "success"] :  ["未开始", "info"],
              ["修改","删除"],
              v
            ];
          });
        });
    },
    addActivity(){
       this.reset();
       this.dialogVisibleModify = true;
    },
    reset(){
      this.dialogDataModify.rowNo = '';
       this.dialogDataModify.activityName = "";
       this.dialogDataModify.activityType = '';
       this.dialogDataModify.startDate = "";
       this.dialogDataModify.endDate = "";
       this.dialogDataModify.scopeType = "";
       this.dialogDataModify.storeRows = [];
       this.dialogDataModify.storeNames = [];
       this.dialogDataModify.activityDesc = '';
       this.dialogDataModify.daterange = [];
    },
    operateSwitch(act, { rowNo,activityName,activityType,startDate,endDate,scopeType,storeRows,activityDesc }) {
      this.dialogDataModify.rowNo = rowNo;
      let text = "";
      switch (act) {
        case "删除":
          this.dialogDataModify.operType = 'delete';
          text = "确定要删除该活动吗？"
          break;
         case "修改": 
          this.reset();
          this.dialogDataModify.rowNo = rowNo;
          this.dialogDataModify.activityName = activityName;
          this.dialogDataModify.activityType = activityType;
          this.dialogDataModify.scopeType = scopeType;
          if(scopeType == 'assign'){
            this.dialogDataModify.storeRows = storeRows.split(",");
          }
          this.dialogDataModify.activityDesc = activityDesc;
          this.dialogDataModify.daterange.push(startDate);
          this.dialogDataModify.daterange.push(endDate);
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
              activityService.delete(rowNo).then(({ code, msg, data }) => {
                if (code != 200) {
                  this.$message.warning(msg);
                  return;
                }
                this.$message.success("操作成功");
                this.search();
              });
            })
            .catch(_ => {});
    },

    dialogSaveActivity() {
      this.$refs["validateInfoRef"].validate(valid => {
        if (!valid) return;

        this.dialogDataModify.startDate = moment(this.dialogDataModify.daterange[0]).format('YYYY-MM-DD');
        this.dialogDataModify.endDate = moment(this.dialogDataModify.daterange[1]).format('YYYY-MM-DD');
        this.dialogDataModify.daterange = '';
        let obj = [];
        
        this.dialogDataModify.storeRows.map(v => {
           this.orgList.map(k => {
              if (v == k.rowNo){obj.push(k.orgName)}
           });
        });

        this.dialogDataModify.storeRows = this.dialogDataModify.storeRows.join(",");
        this.dialogDataModify.storeNames = obj.join(",");
        activityService
          .save(this.dialogDataModify)
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

<style scoped>
.el-select{
  width:100% !important;
}
</style>
