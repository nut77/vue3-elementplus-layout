<template>
  <div class="wfull table-container" ref="baseTableContainer" v-loading="table.isLoading">
    <!--表格动态列设置-->
    <el-dropdown trigger="click" class="table-setting" v-if="table.configurableColumns.length">
      <span class="el-dropdown-link" title="设置显示列">
        <i class="el-icon-setting"></i>
      </span>
      <el-dropdown-menu class="table-setting-box" #default>
        <el-checkbox-group  v-model="configurableVisibleColumns" @change="props => $emit('setVisibleColumns', props)">
          <el-checkbox
           v-for="item of table.configurableColumns"
           :key="item.prop"
           :label="item.prop">
           {{item.label}}
           </el-checkbox>
        </el-checkbox-group>
      </el-dropdown-menu>
    </el-dropdown>
    <!--常规表格-->
    <template v-if="!!table && !!table.columns.length">
      <el-table
        ref="baseTable"
        class="wfull"
        stripe
        :data="table.data"
        :height="hasPagination ? 'calc(100% - 50px)' : '100%'"
        :default-sort="table.defaultSort"
        :row-key="table.getRowKey"
        :expand-row-keys="table.expandRowKeys"
        @sort-change="({prop, order}) => $emit('sortChange', prop, order)"
        @selection-change="selection => $emit('selectionChange', selection)"
        @expand-change="handleExpandChange">
        <slot name="typeColumn"></slot>
        <template v-for="(item, i) in table.columns">
          <el-table-column
            v-if="getColumnVisible(item.prop)"
            :key="`table_${i}`"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width || 120"
            :show-overflow-tooltip="true"
            :align="item.align || 'left'"
            :class-name="item.className || ''"
            :sort-orders="table.sortOrders"
            :sortable="item.sortable ? 'custom' : false">
            <template #default="{row}">
              <span
                class="table-cell-content"
                @click="item.click && item.click(row)"
                v-html="$options.filters[item.filter || 'transformNull'](row[item.prop], ...item.arguments)"/>
            </template>
          </el-table-column>
        </template>
        <slot name="otherColumns"></slot>
        <slot name="operationColumn"></slot>
      </el-table>
    </template>
    <!--自定义表格-->
    <slot name="table"></slot>
    <!--表格分页-->
    <template v-if="hasPagination">
      <el-pagination
        @size-change="val => $emit('sizeChange', val, 'size')"
        @current-change="val => $emit('currentChange', val, 'current')"
        :current-page="pagination.current"
        :page-sizes="pagination.sizes"
        :page-size="pagination.size"
        :total="pagination.total"
        class="fr mgt20"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </template>
  </div>
</template>

<script>
/**
 * table.columns属性如下：
 * label: 表格列标签label
 * prop: 列属性prop
 * align: 列对齐方式，默认left
 * className: 列样式class
 * sortable: 列是否可排序（后端排序）
 * filter: 过滤器名称：默认transformNull
 * arguments: 数组-过滤器参数
 * width: 列最小宽度，默认120
 * click: 列内容的点击事件（其它鼠标事件类推）
 */
export default {
  name: 'BaseTable',
  props: {
    table: {
      type: Object,
      default: () => ({})
    },
    pagination: {
      type: Object,
      default: () => ({})
    },
    hasPagination: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      configurableVisibleColumns: this.table.configurableVisibleColumns
    };
  },
  methods: {
    getColumnVisible(prop) {
      if (!this.table.configurableColumns.find(item => item.prop === prop)) return true;
      return this.table.configurableVisibleColumns.includes(prop);
    },
    handleExpandChange(row, expandedRows) {
      const isExpanded = expandedRows.length > 0;
      this.$emit('expandChange', isExpanded && this.table.isSingleExpanded ? [row] : expandedRows);
    }
  }
};
</script>

<style scoped lang="less">
  .table-container {
    position: relative;
    height: calc(100% - 60px);
  }
  .table-setting {
    position: absolute;
    top: 11px;
    right: 10px;
    z-index: 1;
    .el-icon-setting {
      font-size: 18px;
      cursor: pointer;
    }
  }
  .table-setting-box {
    .pdlr10;
    width: 130px;
    max-height: 200px;
    overflow: auto;
  }
</style>
