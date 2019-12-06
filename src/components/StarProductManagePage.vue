<template>
  <div>
    <div
      v-loading="loading"
      element-loading-text="正在上传"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    ></div>
    <div slot="buttonGroup" style="text-align:right;">
      <el-col :span="-1">
        <a style="font-size: 14px;color:#409EFF;" :href="importTempUrl">模板下载</a>
      </el-col>
        <el-button @click="deleteAll" style="float:right;margin-left:10px;background:red;border:1px solid red;" type="primary" size="mini" v-leaveBtn>删除全部</el-button>
        <el-upload
              :action="importUrl"
              :on-success="onSuccess"
              :on-progress="onProgress"
              :headers="{Authorization: token}"
              :show-file-list="false"
              :file-list="fileList"
            >
              <el-button type="primary" size="mini" v-leaveBtn>导入明星产品</el-button>
            </el-upload>
    </div>

    <div v-if="tableData.length > 0">
      <el-card class="box-card" v-for="(item,index) in tableData" :key="index">
        <div slot="header" class="clearfix">
          <img :src="item.coverImg" v-if="item.coverImg"/>
            <img src="../assets/dered.png" v-else/>
        </div>
        <div class="text item">
            商品编码：{{item.productCode || '无'}}
        </div>
        <div class="text item">
            商品名称：{{item.productName}}
        </div>
        <div class="text item">
            商品规格：{{item.promotion || '无'}}
        </div>
        <div class="text item">
            生产企业：{{item.brand}}
        </div>
        <div class="text item">
          <el-button style="float: right; padding: 3px 0" @click="deletePrd(item.id)" type="text">删除</el-button>
        </div>
      </el-card>
    </div>
    <div v-else class="nodata">
       暂无数据
    </div>
    <BasePagination style="clear:both;padding-top:50px;" :paginator="paginator" @currentChange="search"  v-if="tableData.length > 0"/>
  </div>
  
</template>

<script>
import impService from "../service/imp";
import { mapGetters } from "vuex";
import { MessageBox } from "element-ui";
export default {
  created() {
    this.importUrl = impService.getImpStarUrl();
    this.importTempUrl = impService.getImpStarTempUrl();
    this.search();
  },
  data() {
    return {
      importUrl: '',
      importTempUrl: '',
      tableData: [],
      paginator: {
        currentPage: 1,
        pageSize: 10,
        totalCounts: 0,
        totalPages: 0
      },
      loading: false,
      fileList: []
    };
  },
  computed: mapGetters(["token"]),
  methods: {
    keydownHandler(event) {
      if (event.key.toUpperCase() !== "ESCAPE") return;
      this.$emit("destroy");
    },
    onSuccess(res, file, fileList) {
      if (res.code == 200) {
        this.$message.success(res.data || '导入成功');
        this.search();
      } else {
        this.$message.warning(res.msg);
      }

      this.loading = false;
    },
    deleteAll(){
      MessageBox.confirm("确定要删除全部吗", "信息", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "info"
          }).then(_ => {
            impService.deleteAll('star').then(({ code, msg, data }) => {
                if (code != 200) {
                  this.$message.warning(msg);
                  return;
                }
                this.$message.success("删除成功");
                this.search();
              });
          }).catch(_ => {});
    },
    onProgress(res, file, fileList) {
      this.loading = true;
    },
    search() {
      impService
        .list(
          this.paginator.currentPage,
          this.paginator.pageSize,
          'star'
        )
        .then(({ code, msg, data }) => {
          if (code != 200) {
            this.$message.warning(msg);
            return;
          }

          if (!data) return;
          const { paginator, list } = data;

          this.paginator = paginator;
          this.tableData = list;
        });
    },
    deletePrd(id) {
        MessageBox.confirm("确定要删除吗", "信息", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "info"
          }).then(_ => {
            impService.delete(id).then(({ code, msg, data }) => {
                if (code != 200) {
                  this.$message.warning(msg);
                  return;
                }
                this.$message.success("删除成功");
                this.search();
              });
          }).catch(_ => {});
    }
  }
};
</script>

<style scoped>
.box-card{
   width:18.5%;
   margin-top:15px;
   float:left;
   height:330px;
   margin-left:1%;
   font-size:14px;
}
.box-card img{
   width: 100%;
   max-height:120px;
}
.nodata{
  width:100%;
  line-height:150px;
  text-align: center;
  color:#999;
}
</style>
