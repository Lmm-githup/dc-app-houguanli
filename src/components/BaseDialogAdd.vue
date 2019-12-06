<template>
  <BaseDialog :title="title" :visible.sync="dialogVisible" :width="width" @close="$emit('close')">
    <slot></slot>
    <span slot="footer">
      <slot name="footer">
        <el-button
          :type="addButtonType"
          :size="addButtonSize"
          @click="$emit('onSubmit')"
        >{{ addButtonText }}</el-button>
        <el-button
          :type="cancelButtonType"
          :size="cancelButtonSize"
          @click="dialogVisible = false; $emit('close');"
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
      default: "新增"
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

    addButtonType: {
      type: String,
      default: "primary"
    },
    addButtonSize: {
      type: String,
      default: "mini"
    },
    addButtonText: {
      type: String,
      default: "添 加"
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
