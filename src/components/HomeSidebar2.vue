<template>
  <div>
    <div class="img_container">
      <!--<el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group>-->
    </div>
    <el-menu
      :default-active="onRoutes"
      unique-opened
      router
      background-color="#16161c"
      text-color="#fff"
      class="glob_sidebar_level2"
    >
      <span v-for="(item, index) in menuList" :key="index" :index="item.title">
        <el-submenu :index="item.title" v-if="item.children && item.children.length > 0">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="(item, index) in item.children"
            :key="index"
            :index="item.index"
          >{{ item.title }}</el-menu-item>
        </el-submenu>
        <el-menu-item v-else
          :index="item.index"
        >
          <i :class="item.icon"></i>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </span>
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
          {
            icon: "iconfont icon-yewucaozuo",
            title: "Page",
            children: [
              {
                title: "HomeWelcome",
                index: "/Page/HomeWelcome"
              }
            ]
          }
        ];
      }
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  data() {
    return {
      isCollapse: true
    }
  }
};
</script>

<style scoped>
.img_container {
  text-align: center;
  padding-bottom:25px;
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
  background-color:#343930;
  border-right:0;
}
.el-menu i {
  margin-right: 8px;
}
.el-menu .el-menu-item {
  height: 45px;
  line-height: 45px;
  font-size: 12px;
  min-width: auto;
  padding-left:10px !important;
}

.el-submenu .el-menu-item{
   padding-left:35px !important;
   border-left: 3px solid #16161c;
}
.el-menu-item.is-active{
  color: #fdd000;
  border-left: 3px solid #fdd000;
}
.el-menu-item:hover{
    outline: 0 !important;
    color: #409EFF !important;
}
.el-menu-item.is-active {
    color: #fdd000 !important;
    /*background: #3e4298  !important;*/
}
.el-submenu__title:focus, .el-submenu__title:hover{
    outline: 0 !important;
    color: #409EFF !important;
    background: #FFF !important;
}
.el-menu-item [class^=el-icon-] {
    margin-right: 5px;
    width: 8px;
    text-align: center;
    font-size: 14px;
    vertical-align: middle;
}
.el-submenu [class^=el-icon-] {
    margin-right: 5px;
    width: 8px;
    text-align: center;
    font-size: 14px;
    vertical-align: middle;
}

</style>

<style>
.glob_sidebar_level2 .el-submenu__title {
  font-size: 12px;
  height: 45px;
  line-height: 45px;
  padding-left:10px !important;
}
.el-submenu__icon-arrow{
   right:10px !important;
}
</style>
