<template>
  <el-form :label-width="labelWidth" :label-suffix="labelSuffix" :size="formSize">
    <el-row :gutter="gutter">
      <el-col v-for="(item, index) in list" :key="index" :span="item.span || span">
        <el-form-item :label="item.label" style="margin-bottom: 0" :label-width="item.labelWidth">
          <img v-if="item.type === 'image'" :src="item.value" :alt="item.label" style="width: 90%">
          <div v-else>{{ item.value }}</div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    formSize: {
      type: String,
      default: "mini"
    },
    labelWidth: {
      type: String,
      default: "100px"
    },
    labelSuffix: {
      type: String,
      default: "："
    },

    gutter: {
      type: Number,
      default: 0
    },
    column: {
      type: Number,
      default: 3,
      validator(value) {
        return [1, 2, 3, 4, 6, 8, 12, 24].indexOf(value) > -1;
      }
    },

    list: {
      type: Array,
      required: true,
      default() {
        return [
          {
            label: "Label-01",
            value: "Value-01",
            type: "",
            span: ""
          },
          {
            label: "Label-02",
            value: "Value-02",
            type: "",
            span: ""
          },
          {
            label: "Label-03",
            value: "Value-03",
            type: "",
            span: ""
          },
          {
            label: "Label-04",
            value: "Value-04",
            type: "",
            span: ""
          },
          {
            label: "Label-05",
            value: "Value-05",
            type: "",
            span: ""
          },
          {
            label: "Label-06",
            value: "Value-06",
            type: "",
            span: ""
          },
          {
            label: "Label-07",
            value: "Value-07",
            type: "",
            span: ""
          },
          {
            label: "Label-08",
            value: "Value-08",
            type: "",
            span: ""
          },
          {
            label: "Label-09",
            value: "Value-09",
            type: "",
            span: ""
          },
          {
            label: "Label-10",
            value: "Value-10",
            type: "",
            span: ""
          },
          {
            label: "Label-11",
            value: "Value-11",
            type: "",
            span: ""
          },
          {
            label: "Label-12",
            value: "Value-12",
            type: "",
            span: ""
          },
          {
            label: "Label-13",
            value: "Value-13",
            type: "",
            span: ""
          },
          {
            label: "Label-14",
            value: "Value-14",
            type: "",
            span: ""
          },
          {
            label: "Label-15",
            value: "Value-15",
            type: "",
            span: ""
          },
          {
            label: "Label-16",
            value: "Value-16",
            type: "",
            span: ""
          },
          {
            label: "Label-17",
            value: "Value-17",
            type: "",
            span: ""
          },
          {
            label: "Label-18",
            value: "Value-18",
            type: "",
            span: ""
          },
          {
            label: "Label-19",
            value: "Value-19",
            type: "",
            span: ""
          },
          {
            label: "Label-20",
            value: "http://placehold.it/150x100",
            type: "image",
            span: ""
          }
        ];
      }
    }
  },
  computed: {
    span() {
      return 24 / this.column;
    }
  }
};
</script>
