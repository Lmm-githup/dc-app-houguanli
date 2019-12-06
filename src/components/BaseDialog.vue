<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :width="width" @close="$emit('close')">
    <slot></slot>
    <span slot="footer">
      <slot name="footer"></slot>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "提示"
    },
    width: {
      type: String,
      default: "50%"
    },
    visible: {
      type: Boolean,
      required: true,
      default: false
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
