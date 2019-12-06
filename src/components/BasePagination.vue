<template>
  <el-pagination
    layout="prev, pager, next"
    :current-page.sync="paginator.currentPage"
    :page-size="paginator.pageSize"
    :total="paginator.totalCounts"
    :background="true"
    @current-change="$emit('currentChange', $event)"
  ></el-pagination>
</template>

<script>
export default {
  props: {
    paginator: {
      type: Object,
      required: true,
      default() {
        return {
          currentPage: 1,
          pageSize: 10,
          totalCounts: 200
        };
      }
    }
  }
};
</script>

<style scoped>
.el-pagination {
  text-align: right;
  margin-top: 20px;
}
</style>
