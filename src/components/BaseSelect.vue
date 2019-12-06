<template>
  <el-select
    v-if="type"
    :placeholder="placeholder || defaultPlaceholder"
    :size="size"
    :disabled="disabled"
    v-model="val"
    @change="onChange"
  >
    <el-option label="全部" value v-if="showAll"></el-option>
    <el-option
      v-for="(item, index) in optionList"
      :key="index"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import store from "@/store";
import { mapState } from "vuex";

import commonService from "../service/common";

export default {
  created() {
    const code = this[this.type + "Code"];

    if (code) {
      commonService.lov(code).then(({ code, msg, data }) => {
        if (code != 200) {
          this.$message.warning(msg);
          return;
        }
        for (let i = 0; i < data.length; i++) {
          const v = data[i];
          if (!v.dataKey) continue;
          this.optionList.push({
            label: v.dataValue,
            value: v.dataKey
          });
        }
      });
      return;
    }
    this.optionList = this[this.type + "List"];

  },
  props: {
    type: {
      type: String,
      required: true,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number | String,
      required: true,
      default: ""
    },
    showAll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      val: this.getValue(),
      getValueOnceCalled: false,
      optionList: [],

      positionTypeCode:'POSITION_TYPE',
      positionTypeLabel:'职位类型',

      activityTypeCode:'ACTIVITY_TYPE',
      activityTypeLabel:'活动类型',
    };
  },
  watch: {
    value() {
      this.val = this.getValue();
    }
  },
  store,
  computed: {
    ...mapState(["userInfo"]),
    defaultPlaceholder() {
      return "请选择" + this[this.type + "Label"];
    }
  },
  methods: {
    onChange(value) {
      this.$emit("update:value", value);
      this.$emit("change");
    },
    getValue() {
      if (!this.getValueOnceCalled) {
        this.getValueOnceCalled = true;
        return this.getValueOnce();
      }
      return this.value + "";
    },
    getValueOnce() {
      return this.getValue() || undefined;
    }
  }
};
</script>
