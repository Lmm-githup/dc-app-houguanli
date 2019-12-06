<template>
  <div class="base-tabs">
    <div class="tab-button-group">
      <slot name="buttonGroup">
        <!-- <el-button type="primary" size="mini">新建</el-button> -->
      </slot>
    </div>

    <!-- <el-tabs v-model="tabIndex" :type="tabsType" @tab-click="tabClick"> -->
    <el-tabs v-model="tabIndex" :type="tabsType">
      <el-tab-pane v-for="(label, index) in labelList" :key="index" :label="label">
        <slot :name="'tab' + index + 'Pane'">{{ 'tab' + index + 'Pane' }}</slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: {
    tabsType: {
      type: String,
      default: "card"
    },
    labelList: {
      type: Array,
      required: true,
      default() {
        return ["用户管理", "帐号管理"];
      }
    },
    index: {
      type: String,
      default: "0"
    }
  },
  data() {
    return {
      tabIndex: this.index
    };
  },
  watch: {
    tabIndex() {
      this.$emit("update:index", this.tabIndex);
    },
    index() {
      this.tabIndex = this.index;
    },
  }
};
</script>


<style scoped>
.base-tabs {
  position: relative;
}

.tab-button-group {
  position: absolute;
  right: 5px;
  top: 10px;
  z-index: 999;
}
</style>
