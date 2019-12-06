<template>
  <Child v-if="childShow" :currentId="currentId" @updateTable="search" @destroy="childShow = false"/>

  <div v-else>
    <BaseSearchForm @search="search">
      <el-form-item label="标题">
        <el-input v-model="formModel.title" placeholder="请输入标题" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-button slot="buttons" type="primary" @click="addTraning">添加培训内容</el-button>
    </BaseSearchForm>

    <BaseTable :headerData="headerData" :tableData="tableData" @operate="operateSwitch"/>

    <BasePagination :paginator="paginator" @currentChange="search"/>

    <el-dialog title="预览" top="0" width="500px" :visible.sync="dialogTableVisible">
        <div class="art-title">{{article.artTitle}}</div>
        <div class="art-content" v-html="article.artContent"></div>
    </el-dialog>
  </div>
</template>

<script>
import contentService from "../service/content";
import { MessageBox } from "element-ui";
import store from "@/store";
import { mapState } from "vuex";
import Child from "@/components/TraningManageChildPage";
export default {
  created() {
    this.search();
  },
  components: {  Child },
  data() {
    return {
      currentId: "",
      childShow: false,

      formModel: {
        title: "",
        contentType: 'train'
      },
      article: {
        artTitle: "",
        createdTime: "",
        pvNum: 999,
        artContent: ""
      },
      dialogTableVisible: false,
      dialogDataModify:{
        operType: '',
        rowNo: '',
      },
      headerData: [
        {
          type: "image",
          label: "封面图"
        },
        {
          type: "",
          label: "编号"
        },
        {
          type: "",
          label: "标题"
        },
        {
          type: "",
          label: "类型"
        },
        {
          type: "",
          label: "创建日期"
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
    };
  },
  store,
  computed: mapState(["userInfo"]),
  methods: {
    search() {
      contentService
        .list(
          this.paginator.currentPage,
          this.paginator.pageSize,
          this.formModel.contentType,
          this.formModel.title
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
              v.coverImg,
              v.rowNo,
              v.title,
              v.categoryName,
              v.gmtCreate,
              v.status == 2 ? ["已发布", "success"] : ["未发布", "info"],
              v.status==1 ? ["发布","修改","预览","删除"] : ["取消发布","预览"],
              v
            ];
          });
        });
    },

    operateSwitch(act, { rowNo }) {
      this.dialogDataModify.rowNo = rowNo;
      let text = "";
      switch (act) {
        case "取消发布":
          this.dialogDataModify.operType = 'draft';
          text = "确定要取消发布该培训内容吗？"
          break;
        case "发布": 
          this.dialogDataModify.operType = 'publish';
          text = "确定要发布该培训内容吗？"
          break;
        case "删除": 
          this.dialogDataModify.operType = 'delete';
          text = "确定要删除该培训内容吗？"
          break;
        case "预览":
          this.preview(rowNo);
          this.dialogDataModify.operType = '';
          break;
        case "修改": 
          this.dialogDataModify.operType = '';
          this.currentId = rowNo;
          this.childShow = true;
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
            type: "warning"
          }).then(_ => {
            contentService.status(rowNo,this.dialogDataModify.operType).then(({ code, msg, data }) => {
                if (code != 200) {
                  this.$message.warning(msg);
                  return;
                }
                this.$message.success("操作成功");
                this.search();
            });
          }).catch(_ => {});
    },
    preview(rowNo){
       const loading = this.$loading({
            lock: true,
            text: "数据处理中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.8)"
          });
            contentService.detail(rowNo).then(({code,msg,data})=> {
              loading.close();
              if (code != 200) {
                this.$message.warning(msg);
                return;
              }
              this.article.artTitle = data.title;
              this.article.artContent = data.content;
              this.article.createdTime = data.gmtCreate;
              this.dialogTableVisible = true;
          });
    },
    addTraning() {
      this.childShow = true;
    }
  }
};
</script>

<style scope>
.art-title{
  font-size:18px;
  font-weight:800;
}
.art-content img{
  max-width:100% !important;
}
</style>

