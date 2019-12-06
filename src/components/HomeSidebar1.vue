<template>
  <div>
    <div class="img_container">
      <img src="../assets/dered.png">
    </div>
    <el-menu
      :default-active="onRoutes"
      unique-opened
      router
    >
      <el-menu-item
        v-for="(item, index) in menuList"
        :key="index"
        :index="item.index"
      >{{item.title}}</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
    menuList: {
      type: Array,
      required: true,
      default() {
        return [
          
        ];
      }
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  }
};
</script>

<style scoped>
.img_container {
  text-align: center;
  padding-top: 30px;
  padding-bottom:20px;
  border-bottom:1px solid #343930;
  background-color:#2f2f2f;
}
.img_container img {
  width: 100px;
}
.img_container span {
  display: inline-block;
  margin: 20px 0;
  font-size: 24px;
}
.el-menu{
  border-right:0;
}
.el-menu .el-menu-item {
  height: 45px;
    line-height: 45px;
    font-size: 12px;
    color: #fff;
    min-width: auto;
    background-color: #34393e;
}

.el-menu .el-menu-item.is-active{
  color:#409EFF;
  background-color:#fff;
}
</style>