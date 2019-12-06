<template>
  <div>
    <BaseSearchForm @search="search">
      <el-form-item label="职位类型名称">
        <el-input v-model="formModel.positionTypeName" placeholder="请输入职位类型名称" @keyup.enter.native="search"></el-input>
      </el-form-item>
    </BaseSearchForm>

    <BaseTable :headerData="headerData" :tableData="tableData" @operate="operateSwitch"/>

    <BasePagination :paginator="paginator" @currentChange="search"/>

    <!-- Add -->
    <el-dialog title="配置角色" :visible.sync="dialogVisibleModify" width="400px">
      <el-form
        :model="dialogDataModify"
        ref="validateInfoRef"
        :rules="dialogRulesModify"
        size="mini"
        style="padding-right: 30px"
      >
        <el-form-item label="关联角色" prop="positionTypeName">
          <el-select v-model="dialogDataModify.roleNo" placeholder="请选择角色" size="mini">
          <el-option v-for="(item,index) in roleList " :label="item.roleName" :value="item.rowNo" :key="index"></el-option>
        </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="mini" @click="dialogSaveRole">确 定</el-button>
         <el-button type="info" size="mini" @click="dialogVisibleModify = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import authService from "../service/auth";
import roleService from "../service/role";
import { MessageBox } from "element-ui";
export default {
  created() {
    this.initRole();
    this.search();
  },
  data() {
    return {
      formModel: {
        positionTypeName: ""
      },

      headerData: [
        {
          type: "",
          label: "职位类型"
        },
        {
          type: "",
          label: "关联角色"
        },
        {
          type: "",
          label: "创建时间"
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
        positionType: "",
        roleNo: "",
      },
      dialogRulesModify: {
        roleNo: [
          { required: true, message: "请选择角色", trigger: "blur" }
        ]
      },
      roleList: []
    };
  },
  methods: {
    initRole(){
       roleService.list(1,999,'').then(({code,msg,data}) =>{
          if (code == 200) {
           this.roleList = data.list
          }
       });
    },
    search() {
      authService
        .list(
          this.paginator.currentPage,
          this.paginator.pageSize,
          this.formModel.positionTypeName
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
              v.positionTypeName,
              v.roleName ? v.roleName : '-',
              v.gmtCreate ? v.gmtCreate : '-',
              ["配置角色"],
              v
            ];
          });
        });
    },

    operateSwitch(act, { positionType }) {
      this.dialogDataModify.positionType = positionType;
       this.dialogVisibleModify = true;
    },

    dialogSaveRole() {
      this.$refs["validateInfoRef"].validate(valid => {
        if (!valid) return;
        authService
          .save(this.dialogDataModify.positionType, this.dialogDataModify.roleNo)
          .then(({ code, msg, data }) => {
            this.$refs["validateInfoRef"].resetFields();

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
