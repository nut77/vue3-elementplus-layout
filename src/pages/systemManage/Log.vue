<template>
  <div>
    <div class="mgb20">
      <el-button type="warning" @click="handleDialogShow">批量下载</el-button>
    </div>

    <base-table
      :pagination="pagination"
      :table="table"
      @sortChange="handleSortChange"
      @selectionChange="handleSelectionChange"
      @expandChange="handleExpandChange"
      @sizeChange="handlePaging"
      @currentChange="handlePaging">
      <template #typeColumn>
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column type="index" :index="rowIndex" width="60" label="序号" align="center"></el-table-column>
        <el-table-column type="expand" width="1" class-name="ofh">
          <template #default="{row}">
            <div v-loading="row.detail.isLoading" class="full" :class="Object.keys(row.detail.data).length ? '' : 'box--empty'">
              <p v-for="(value, key) in row.detail.data" :key="key">
                <span class="expanded-item-label">{{key}}：</span>
                <span>{{value}}</span>
              </p>
            </div>
          </template>
        </el-table-column>
      </template>
      <template #operationColumn>
        <el-table-column label="操作" :min-width="100" align="center">
          <template #default="{row}">
            <el-button type="warning" size="small" @click="handleDownloadFileAsync(row)">下载</el-button>
            <el-button type="primary" size="small" @click="toggleRowExpansion(row)">详情</el-button>
          </template>
        </el-table-column>
      </template>
    </base-table>

    <!--批量下载确认框-->
    <base-dialog
      ref="dialog"
      title="批量下载"
      :dialogId="dialogId"
      @dialogConfirm="handleDialogSubmit"
      @dialogClose="hideDialog">
      <p class="base-dialog-tooltip tc">
        当前选中
        <span data-status-text="warning">{{table.selectParams ? table.selectParams.length : 0}}</span>
        条数据，确定要下载这些数据吗？
      </p>
    </base-dialog>
  </div>
</template>

<script>
import mixins from '@/mixins';
export default {
  name: 'Log',
  mixins: [mixins.table, mixins.dialog],
  data() {
    return {
      isLoading: true,
      table: {
        defaultSort: {prop: 'created', order: 'descending'},
        isSingleExpanded: false,
        columns: [
          {label: '生成时间', prop: 'created', width: 150, sortable: true},
          {label: '日志名称', prop: 'name'},
          {label: '操作用户', prop: 'username'},
          {label: '存放路径', prop: 'path'}
        ]
      }
    };
  },
  methods: {
    getTableData() {
      this.setTableData('systemManage', 'getSystemLog', this.getTableRequestParams());
    },
    getExpandRowDetail(row) {
      this.setExpandRowDetail(row, 'systemManage', 'getSystemLogDetail', row.id);
    },
    handleDownloadFileAsync(row) {
      this.downloadFileAsync('get', '/v16.3.0/node-v16.3.0-x86.msi', {id: row.id}, row.name);
    },
    handleDialogShow() {
      this.table.selectParams.length ? this.showDialog() : this.$message.error('请选择相关数据');
    },
    handleDialogSubmit() {
      this.downloadFileAsync('post', '/v16.3.0/node-v16.3.0-x86.msi', {ids: this.table.selectParams}, '批量下载.zip');
      this.hideDialog();
    }
  },
  created() {
    this.getTableData();
  }
};
</script>
