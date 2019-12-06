<template>
  <el-table
    :data="tableData"
    :size="size"
    border
    stripe
    :header-cell-style="_headerCellStyle"
    :cell-style="_bodyCellStyle"
    @expand-change="expandChange"
    @selection-change="$emit('selectionChange', $event)"
  >
    <el-table-column v-if="showSelect" type="selection"></el-table-column>

    <el-table-column
      v-if="showIndex"
      type="index"
      :width="indexWidth"
      :label="indexLabel"
      :align="indexAlign"
    ></el-table-column>

    <el-table-column
      v-for="({type, label, width}, index) in headerData"
      align="center"
      :width="width"
      :key="index"
      :label="label"
    >
      <template slot-scope="{row}">
        <div v-if="type === 'operations'">
          <el-button
            v-for="(act, i) in row[index]"
            :key="i"
            type="text"
            :size="size"
            @click="$emit('operate', act, row[row.length - 1])"
          >{{ act }}</el-button>
        </div>
        <el-tag
          v-else-if="type === 'tag'"
          :size="size"
          :type="row[index][1]"
          disable-transitions
        >{{ row[index][0] }}</el-tag>
        <img v-else-if="type === 'image'" :src="row[index]" alt="图片" style="width: 50%">
        <span v-else>{{ row[index] }}</span>
      </template>
    </el-table-column>

    <el-table-column v-if="showExpand" type="expand" :width="expandWidth" :label="expandLabel">
      <slot name="expand"></slot>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    headerData: {
      type: Array,
      required: true,
      default() {
        return [
        ];
      }
    },
    tableData: {
      type: Array,
      required: true,
      default() {
        return [
          
        ];
      }
    },

    size: {
      type: String,
      default: "mini"
    },

    showSelect: {
      type: Boolean,
      default: false
    },

    showIndex: {
      type: Boolean,
      default: false
    },
    indexWidth: {
      type: String,
      default: "70px"
    },
    indexLabel: {
      type: String,
      default: "序号"
    },
    indexAlign: {
      type: String,
      default: "center"
    },

    showExpand: {
      type: Boolean,
      default: false
    },
    expandWidth: {
      type: String,
      default: "60px"
    },
    expandLabel: {
      type: String,
      default: ""
    },

    headerCellStyle: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    _cellStyle() {
      return {
        color: "#101010"
      };
    },
    _headerCellStyle() {
      return {
        ...this._cellStyle,
        backgroundColor: "#f1f2f2",
        ...this.headerCellStyle
      };
    },
    _bodyCellStyle() {
      return {
        ...this._cellStyle
      };
    }
  },
  methods: {
    expandChange(row, expandedRows) {
      if (expandedRows.length === 0) return;
      expandedRows.length === 2 && expandedRows.shift();
      this.$emit("expandChange", row);
    }
  }
};
</script>
