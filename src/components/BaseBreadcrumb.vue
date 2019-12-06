<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item
      v-for="(item, index) in navList"
      :key="index"
      :to="{ path: item[1] }"
      @click.native="onClick(index, $event)"
    >{{ item[0] }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: {
    navList: {
      type: Array,
      required: true,
      default() {
        return [["首页", "/"], ["活动列表", "/Base/Table"], ["活动详情"]];
      }
    }
  },
  methods: {
    onClick(index, event) {
      if (index === this.navList.length - 1) {
        return;
      }
      this.$emit("click", index, event);
    }
  }
};
</script>

<style scoped>
.el-breadcrumb{
  background-color: #f0f0f0;
    /* margin-left: -20px; */
    /* margin-top: -20px; */
    width: 100%;
    line-height: 40px;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    margin-bottom: 50px;
}
.el-breadcrumb .el-breadcrumb__item:first-child{
  padding-left: 20px;
}
</style>

