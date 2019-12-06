<template>
  <BaseDialog :title="title" :visible.sync="dialogVisible" :width="width">
    <slot></slot>
    <span slot="footer">
      <slot name="footer">
        <el-button
          :type="modifyButtonType"
          :size="modifyButtonSize"
          @click="$emit('onSubmit')"
        >{{ modifyButtonText }}</el-button>
        <el-button
          :type="cancelButtonType"
          :size="cancelButtonSize"
          @click="dialogVisible = false"
        >{{ cancelButtonText }}</el-button>
      </slot>
    </span>
  </BaseDialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "修改"
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

    cancelButtonType: {
      type: String,
      default: "info"
    },
    cancelButtonSize: {
      type: String,
      default: "mini"
    },
    cancelButtonText: {
      type: String,
      default: "取 消"
    },

    modifyButtonType: {
      type: String,
      default: "primary"
    },
    modifyButtonSize: {
      type: String,
      default: "mini"
    },
    modifyButtonText: {
      type: String,
      default: "保 存"
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
