<template>
  <div>
    <base-table
      class="hfull"
      :pagination="pagination"
      :table="table"
      @sortChange="handleSortChange"
      @sizeChange="handlePaging"
      @currentChange="handlePaging"
      @setVisibleColumns="handleVisibleColumnsChange">
      <template #typeColumn>
        <el-table-column type="index" :index="rowIndex" width="60" label="序号" align="center"></el-table-column>
      </template>
      <template #operationColumn>
        <el-table-column label="操作" :min-width="100" align="center">
          <template #default="{row}">
            <el-button type="primary" size="small" @click="handleDialogShowConfirm(row)">编辑</el-button>
          </template>
        </el-table-column>
      </template>
    </base-table>

    <!--弹框-->
    <base-dialog
      ref="dialogConfirm"
      title="编辑客户"
      :dialogId="dialog.confirm.dialogId"
      @dialogConfirm="handleDialogConfirmSubmit"
      @dialogClose="dialog.confirm.dialogId = 0">
      <el-form :model="dialog.confirm.params" label-width="80px">
        <el-form-item prop="isVip" label="优质客户">
          <el-radio-group v-model="dialog.confirm.params.isVip">
            <el-radio label="是">是</el-radio>
            <el-radio label="否">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="description" label="客户描述">
          <el-input type="textarea" maxlength="250" v-model.trim="dialog.confirm.params.description"/>
        </el-form-item>
      </el-form>
    </base-dialog>
  </div>
</template>

<script>
import mixins from '@/mixins';
export default {
  name: 'Customer',
  mixins: [mixins.table, mixins.dialog],
  data() {
    return {
      isLoading: true,
      table: {
        configurableColumns: [
          {label: '订单总数', prop: 'orderTotal'},
          {label: '采购类型', prop: 'purchaseType'},
          {label: '投诉次数', prop: 'unsatisfiedTotal'},
          {label: '好评次数', prop: 'satisfiedTotal'},
          {label: '客户描述', prop: 'description'}
        ],
        configurableVisibleColumns: ['orderTotal'],
        defaultSort: {prop: 'lastOrder', order: 'descending'},
        columns: [
          {label: '最近下单时间', prop: 'lastOrder', sortable: true, filter: 'formatDate', arguments: [], width: 150},
          {label: '客户名', prop: 'username', width: 120, click: (row) => alert(JSON.stringify(row))},
          {label: '订单总数', prop: 'orderTotal', align: 'center', filter: 'numberWithCommas'},
          {label: '未完成订单', prop: 'orderFinished', align: 'center', filter: 'numberWithCommas'},
          {label: '已完成订单', prop: 'orderUnfinished', align: 'center', filter: 'numberWithCommas'},
          {label: '采购类型', prop: 'purchaseType', align: 'center', filter: 'transformArrayToString'},
          {label: '采购数量', prop: 'purchaseTotal', align: 'center', filter: 'numberWithCommas'},
          {label: '优选客户', prop: 'isVip', sortable: true, align: 'center', width: 120},
          {label: '投诉次数', prop: 'unsatisfiedTotal', align: 'center', filter: 'numberWithCommas', width: 120},
          {label: '好评次数', prop: 'satisfiedTotal', align: 'center', filter: 'numberWithCommas', width: 120},
          {label: '客户描述', prop: 'description'}
        ]
      },
      dialog: {
        confirm: {
          dialogId: 0,
          params: {
            id: '',
            isVip: '',
            description: ''
          }
        }
      }
    };
  },
  methods: {
    getTableData() {
      this.setTableData('systemManage', 'getCustomer', this.getTableRequestParams());
    },
    handleDialogShowConfirm(row) {
      this.dialog.confirm.dialogId = Date.now();
      this.$tool.setObject(this.dialog.confirm.params, row);
    },
    async handleDialogConfirmSubmit() {
      this.$refs.dialogConfirm.loadingOpen();
      const res = await this.$api.systemManage.editCustomer(this.dialog.confirm.params);
      this.$refs.dialogConfirm.loadingClose();
      if (!!res && res.status === 200) {
        this.dialog.confirm.dialogId = 0;
        this.$message.success('编辑客户成功');
        this.refreshTableData();
      } else {
        this.$message.error(res.message);
      }
    }
  },
  created() {
    this.getTableData();
  }
};
</script>
