<template>
  <div>
    <BaseSearchForm @search="search">
      <el-form-item label="角色名称">
        <el-input v-model="formModel.roleName" placeholder="请输入角色名称" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-button slot="buttons" type="primary" @click="dialogVisibleModify = true">添加角色</el-button>
    </BaseSearchForm>

    <BaseTable :headerData="headerData" :tableData="tableData" @operate="operateSwitch"/>

    <BasePagination :paginator="paginator" @currentChange="search"/>

    <BaseDialogModify
      title="添加角色"
      :visible.sync="dialogVisibleModify"
      width="500px"
      @onSubmit="dialogSaveRole"
    >
      <el-form
        :model="dialogDataModify"
        :rules="dialogRulesModify"
        label-width="120px"
        ref="roleInfoRef"
        size="mini"
        style="padding-right: 30px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="dialogDataModify.roleName"
            placeholder="请输入角色名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="dialogDataModify.remark"
            placeholder="请输入备注"
            type="textarea"
            :max="3"
          ></el-input>
        </el-form-item>
      </el-form>
    </BaseDialogModify>

    <el-dialog title="配置权限" :visible.sync="setupAuthDialog" width="800px" >
      <el-tree 
      :data="moduleList"
      show-checkbox
      default-expand-all
      node-key="moduleCode"
      ref="tree"
      style="height:400px;overflow:auto;"
      highlight-current
      :default-checked-keys="selectList"
       v-loading="loading"
      :props="defaultProps">
    </el-tree>
     <div slot="footer">
        <el-button type="primary" size="mini" :loading="loading" @click="saveRoleModule">确 定</el-button>
         <el-button type="info" size="mini" @click="setupAuthDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import roleService from "../service/role";
import { MessageBox } from "element-ui";
import moment from 'moment'
export default {
  created() {
    this.search();
  },
  data() {
    return {
      formModel: {
        roleName: ""
      },

      headerData: [
        {
          type: "",
          label: "角色名称"
        },
        {
          type: "",
          label: "创建日期"
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
        roleName: '',
        remark: ''
      },
      dialogRulesModify: {
        roleName: [
          { required: true, message: "请输入角色", trigger: "blur" },
        ]
      },

      setupAuthDialog: false,
      loading: false,
      setAuthInfo:{},
      roleId: '',
      moduleList: [],
      selectList : [],
      defaultProps: {
        children: 'viewList',
        label: 'moduleName'
      },
    };
  },
  methods: {
    search() {
      roleService
        .list(
          this.paginator.currentPage,
          this.paginator.pageSize,
          this.formModel.roleName
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
              v.roleName,
              v.gmtCreate ? new moment(v.gmtCreate).format("YYYY-MM-DD HH:mm:ss") : '-' ,
              ["配置权限", "删除"],
              v
            ];
          });
        });
    },

    operateSwitch(act, { id,rowNo }) {
      this.dialogDataModify.id = rowNo;
      let text = "";
      switch (act) {
        case "删除":
          this.dialogDataModify.operType = 1;
          text = "确定要删除该角色吗？"
          break;
         case "配置权限": 
          this.roleId = rowNo;
          this.moduleList = [];
          this.loadAuth(rowNo);
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
              roleService.status(id,this.dialogDataModify.operType).then(({ code, msg, data }) => {
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

    dialogSaveRole() {
      this.$refs["roleInfoRef"].validate(valid => {
        if (!valid) return;
        roleService
          .save(this.dialogDataModify.rowNo, this.dialogDataModify.roleName, this.dialogDataModify.remark)
          .then(({ code, msg, data }) => {
            this.$refs["roleInfoRef"].resetFields();

            if (code != 200) {
              this.$message.warning(msg);
              return;
            }

            this.$message.success("保存成功");
            this.search();
            this.dialogVisibleModify = false;
          });
      });
    },

    loadAuth(id){
      this.loading = true;
      roleService.moduleList(id).then( res => {
          if(res.data.code === 200){
             this.moduleList = res.data.data.moduleList;
             this.selectList = res.data.data.roleIds;
             this.$refs.tree.setCheckedKeys(this.selectList);
             this.loading = false;
          }
      });
      this.setupAuthDialog = true;
    },
    saveRoleModule() {
      let param = this.$refs.tree.getCheckedNodes();
      this.loading = true;
      roleService.saveReoleModule(this.roleId,param).then( res => {
          if(res.data.code !== 200){
             this.$message.warning(res.data.msg);
             return;
          }
          this.$message.success("保存成功");
          this.search();
          this.setupAuthDialog = false;
          this.loading = false;
      });
      
    }

  }
};
</script>
