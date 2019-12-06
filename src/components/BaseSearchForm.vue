<template>
  <el-form :inline="true" :size="size">
    <slot>
      <!-- <el-form-item label="姓名">
        <el-input v-model="formModel.name" placeholder="请输入用户姓名" @keyup.enter.native="search"></el-input>
      </el-form-item>-->
      <!-- <el-form-item label="年龄段">
        <BaseSelect type="contactAge" :value.sync="formModel.age" @change="search" />
      </el-form-item>-->
      <!-- <el-form-item label="发布日期">
        <el-date-picker
          v-model="formModel.date"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          @change="search"
          style="width: 220px"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>-->
    </slot>
    <el-form-item>
      <el-button
        :type="searchType"
        :plain="searchPlain"
        @click="$emit('search')"
        v-leaveBtn
      >{{ searchText }}</el-button>
      <slot name="buttons">
        <!-- <el-button type="primary" @click="dialogVisible = true">新增</el-button> -->
      </slot>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: "mini"
    },
    searchText: {
      type: String,
      default: "查询"
    },
    searchType: {
      type: String,
      default: ""
    },
    searchPlain: {
      type: Boolean,
      default: true
    }
  }
  // data() {
  //   return {
  //     formModel: {
  //       name: "",
  //       age: "",
  //       date: ""
  //     }
  //   };
  // },
  // methods: {
  //   search() {
  //     console.log(this.formModel);
  //   }
  // }
};
</script>
