<template>
  <BaseDialog :title="title" :visible.sync="dialogVisible" :width="width">
    <slot></slot>
    <span slot="footer">
      <slot name="footer">
        <el-button
          :type="closeButtonType"
          :size="closeButtonSize"
          @click="dialogVisible = false"
        >{{ closeButtonText }}</el-button>
      </slot>
    </span>
  </BaseDialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "查看详情"
    },
    width: {
      type: String,
      default: "60%"
    },
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    closeButtonType: {
      type: String,
      default: "info"
    },
    closeButtonSize: {
      type: String,
      default: "mini"
    },
    closeButtonText: {
      type: String,
      default: "关 闭"
    }
  },
  data() {
    return {
      dialogVisible: this.visible
    };
  },
  watch: {
    dialogVisible() {
      this.$emit("update:visible", this.dialogVisible);
    },
    visible() {
      this.dialogVisible = this.visible;
    }
  }
};
</script>
