<template>
  <div>
    <BaseSearchForm @search="search">
      <el-form-item label="职位编码">
        <el-input v-model="formModel.positionCode" placeholder="请输入职位编码" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="职位名称">
        <el-input v-model="formModel.positionName" placeholder="请输入职位名称" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="员工姓名">
        <el-input v-model="formModel.userName" placeholder="请输入员工姓名" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="部门名称">
        <el-input v-model="formModel.orgName" placeholder="请输入部门名称" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-button slot="buttons" type="primary" @click="addPosition">添加职位</el-button>
    </BaseSearchForm>

    <BaseTable :headerData="headerData" :tableData="tableData" @operate="operateSwitch"/>

    <BasePagination :paginator="paginator" @currentChange="search"/>

    <BaseDialogModify
      title="添加职位"
      :visible.sync="dialogVisibleModify"
      width="500px"
      @onSubmit="dialogSavePosition"
    >
      <el-form
        :model="dialogDataModify"
        :rules="dialogRulesModify"
        label-width="120px"
        ref="validateInfoRef"
        size="mini"
        style="padding-right: 30px"
      >
        <el-form-item label="职位编码" prop="positionCode">
          <el-input
            v-model="dialogDataModify.positionCode"
            placeholder="请输入职位编码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="职位名称" prop="positionName">
          <el-input
            v-model="dialogDataModify.positionName"
            placeholder="请输入职位名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="职位类型" prop="positionType">
          <BaseSelect
                type="positionType"
                :value.sync="dialogDataModify.positionType"
                placeholder="请选择职位类型"
                :showAll="false"
                style="width:100%;"
              />
        </el-form-item>
        <!--<el-form-item label="上级职位" prop="parentPositionNo">
           <el-select v-model="dialogDataModify.parentPositionNo" filterable style="width:100%;">
              <el-option v-for="(data,index) in positionList" :key="index" :label="data.orgName + ' - ' + data.positionName" :value="data.rowNo">
                <span style="float: left">{{ data.orgName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ data.positionName }}</span>
              </el-option>
           </el-select>
        </el-form-item>-->
        <el-form-item label="上级职位" prop="parentPositionNo">
           <el-input
            @click.native="selectPosition"
            v-model="dialogDataModify.parentPositionName"
            placeholder="请选择职位"
            readonly="readonly"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="orgNo">
           <el-select v-model="dialogDataModify.orgNo" filterable style="width:100%;">
              <el-option v-for="(data,index) in orgList" :key="index" :label="data.orgName" :value="data.rowNo"></el-option>
           </el-select>
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
        <el-table-column prop="orgName" label="部门名称" width="200px"></el-table-column>
        <el-table-column prop="positionCode" label="职位编码" width="200px"></el-table-column>
        <el-table-column prop="positionName" label="职位名称" width="200px"></el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <BasePagination :paginator="paginator_position" @currentChange="initPostion"/>
    </BaseDialog>
  </div>
</template>

<script>
import positionService from "../service/position";
import orgService from "../service/org";
import { MessageBox } from "element-ui";
export default {
  created() {
    this.init();
    this.initPostion();
    this.search();
  },
  data() {
    return {
      formModel: {
        positionCode: "",
        positionName: "",
        orgName: '',
        userName: ''
      },

      headerData: [
        {
          type: "",
          label: "职位编码"
        },
        {
          type: "",
          label: "职位名称"
        },
        {
          type: "",
          label: "职位类型"
        },
        {
          type: "",
          label: "关联员工"
        },
        {
          type: "",
          label: "上级职位"
        },
        {
          type: "",
          label: "所属部门"
        },
        {
          type: "tag",
          label: "状态"
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
        positionCode: "",
        positionName: "",
        parentPositionNo: "",
        parentPositionName: "",
        orgName:"",
        orgNo:"",
        positionType: '',
        operType: "",
      },
      dialogRulesModify: {
        positionCode: [
          { required: true, message: "请输入职位编码", trigger: "blur" }
        ],
        positionName: [
          { required: true, message: "请输入职位名称", trigger: "blur" }
        ],
        orgNo: [
          { required: true, message: "请选择部门", trigger: "blur" }
        ],
        positionType: [
          { required: true, message: "请选择职位类型", trigger: "blur" }
        ]
      },
      orgList: [],
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
      orgService
        .list(1,100000,'','')
        .then(({ code, msg, data }) => {
          if (code != 200) {
            this.$message.warning(msg);
            return;
          }
          const { paginator, list } = data;
          this.orgList = list;
        });
    },
    initPostion(){
      positionService.useList(this.paginator_position.currentPage,this.paginator_position.pageSize,this.formModel_position.code,this.formModel_position.name,'','')
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
       this.initPostion();
    },
    selectPosition() {
       this.dialogVisiblePosition = true;
    },
    handleClick(row){
      this.dialogDataModify.parentPositionNo = row.rowNo;
      this.dialogDataModify.parentPositionName = row.positionName;
      this.dialogVisiblePosition = false;
    },
    search() {
      positionService
        .list(
          this.paginator.currentPage,
          this.paginator.pageSize,
          this.formModel.positionCode,
          this.formModel.positionName,
          this.formModel.orgName,
          this.formModel.userName
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
              v.positionCode,
              v.positionName,
              v.positionTypeName || '-',
              v.userName || '未使用',
              v.parentPositionName || '-',
              v.orgName,
              v.positionStatus == 1 ? ["正常", "success"] : ["禁用", "warning"],
              v.gmtCreate,
              v.gmtModified,
              ["修改"],
              v
            ];
          });
        });
    },
    addPosition(){
      this.reset();
      this.dialogVisibleModify = true;
    },
    reset(){
       this.dialogDataModify.rowNo = '';
       this.dialogDataModify.positionCode = '';
       this.dialogDataModify.positionName = '';
       this.dialogDataModify.positionType = '';
       this.dialogDataModify.parentPositionNo = '';
       this.dialogDataModify.parentPositionName = '';
       this.dialogDataModify.orgNo = '';
    },
    operateSwitch(act, { rowNo,positionCode,positionName,positionType,parentPositionNo,parentPositionName,orgNo }) {
      this.dialogDataModify.rowNo = rowNo;
      switch (act) {
        case "修改":
          this.reset();
          this.dialogDataModify.rowNo = rowNo;
          this.dialogDataModify.positionCode = positionCode;
          this.dialogDataModify.positionName = positionName || '';
          this.dialogDataModify.positionType = positionType || '';
          this.dialogDataModify.parentPositionNo = parentPositionNo || '';
          this.dialogDataModify.parentPositionName = parentPositionName || '';
          this.dialogDataModify.orgNo = orgNo;
          this.dialogVisibleModify = true;
          break;
        case "查看详情": 
          this.dialogVisibleModify = true;
          break;
        default:
          break;
      }
    },

    dialogSavePosition() {
      this.$refs["validateInfoRef"].validate(valid => {
        if (!valid) return;
        positionService
          .save(this.dialogDataModify.rowNo, this.dialogDataModify.positionCode, this.dialogDataModify.positionName,
          this.dialogDataModify.parentPositionNo,this.dialogDataModify.orgNo,this.dialogDataModify.positionType)
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
