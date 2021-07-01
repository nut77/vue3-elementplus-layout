import qs from 'qs';
export default {
  data() {
    return {
      hasPagination: true,
      table: {
        isLoading: false,
        isSingleExpanded: true,
        columns: [],
        data: [],
        defaultSort: {prop: 'createTime', order: 'descending'},
        sortOrders: ['descending', 'ascending'],
        orderField: '',
        orderBy: 'DESC',
        selection: [],
        selectParamProp: 'id',
        selectParams: [],
        rowKeyProps: ['id'],
        expandRowKeys: [],
        configurableColumns: [],
        configurableVisibleColumns: []
      },
      pagination: {
        size: 30,
        current: 1,
        sizes: [30, 70, 100, 150],
        total: 0
      },
      // 下载用到的 notification组件对象键值对
      notifications: {}
    };
  },
  methods: {
    // 设置表格动态列可见
    handleVisibleColumnsChange(props) {
      this.table.configurableVisibleColumns = props;
    },
    // 拿取表格数据后回到顶部
    scrollToTop() {
      document.querySelector('.table-container .el-table__body-wrapper').scrollTo(0, 0);
    },
    // 拿到表格对象
    getBaseTableComponent(parentComponent = this, refName = 'baseTable') {
      let component = parentComponent.$refs[refName];
      if (component) return component;
      for (const childComponent of parentComponent.$children) {
        component = this.getBaseTableComponent(childComponent, refName);
        if (component) return component;
      }
    },
    async setTableData(module, apiName, params) {
      this.table.isLoading = true;
      const res = await this.$api[module][apiName](params);
      this.table.isLoading = false;
      if (!!res && res.status === 200) {
        this.table.data = (res.data || {data: []}).data;
        this.pagination.total = (res.data || {total: []}).total;
      } else {
        this.$message.error(res.message);
      }
    },
    // 分页事件：val - 值（当前页或者分页大小）、type - 事件类型，size：改变分页大小，current：改变当前页
    handlePaging(val, type = 'current') {
      if (type === 'size') {
        this.pagination.size = val;
        this.pagination.current = 1;
      } else {
        this.pagination.current = val;
      }
      this.getTableData();
      this.scrollToTop();
    },
    // 表格排序
    handleSortChange(prop, order) {
      this.setTableSortValue({prop, order});
      this.pagination.current = 1;
      this.getTableData();
      this.scrollToTop();
    },
    // 设置表格排序值
    setTableSortValue({prop, order}) {
      this.table.orderField = prop;
      this.table.orderBy = order === 'ascending' ? 'ASC' : 'DESC';
    },
    // 搜索、新增、删除 表格数据时调用
    refreshTableData(obj) {
      this.pagination.current = 1;
      this.getTableData();
      this.scrollToTop();
    },
    // 表格勾选
    handleSelectionChange(row) {
      this.table.selection = row;
      this.setSelectParams();
    },
    setSelectParams() {
      this.table.selectParams = this.getSelectParams();
    },
    // 拿到表格勾选参数
    getSelectParams(paramKey = this.table.selectParamProp, selection = this.table.selection) {
      if (!paramKey || !/string|object/.test(typeof paramKey)) return false;
      const params = selection.map(item => {
        if (typeof paramKey === 'string') return item[paramKey];
        let temp = [];
        if (paramKey instanceof Array) {
          // 如果是数组 如：['ip', 'id']
          for (const key of paramKey) temp.push(item[key]);
        } else {
          // 如果是对象 如：{dataId: 'id', dataInId: 'inId'}
          temp = {};
          for (const key in paramKey) {
            temp[key] = item[paramKey[key]];
          }
        }
        return temp;
      });
      return params;
    },
    // 获取表格行键值，一般在有扩展行的时候才用
    getRowKey(row, props = this.table.rowKeyProps) {
      return props.reduce((str, key) => str + row[key], '');
    },
    // 表格行展开
    handleExpandChange(expandRows) {
      this.table.expandRowKeys = expandRows.map(row => this.table.getRowKey(row));
    },
    // 拿到行展开信息：key、是否已展开、在expandRowKeys中的序号
    getExpandRowInfo(row) {
      const rowKey = this.table.getRowKey(row);
      const index = this.table.expandRowKeys.indexOf(rowKey);
      const isExpanded = index !== -1;
      return {rowKey, isExpanded, index};
    },
    // 手动触发行展开-几乎用不到
    manualTriggerExpandRow(row) {
      const {rowKey, isExpanded, index} = this.getExpandRowInfo(row);
      const args = isExpanded ? [index, 1] : [0, this.table.isSingleExpanded ? this.table.expandRowKeys.length : 0, rowKey];
      this.table.expandRowKeys.splice(...args);
    },
    // 切换行展开
    toggleRowExpansion(row) {
      // this.manualTriggerExpandRow(row);
      this.getBaseTableComponent().toggleRowExpansion(row);
      const {isExpanded: isNeedExpand} = this.getExpandRowInfo(row);
      if (isNeedExpand) {
        if (!row.detail) this.$set(row, 'detail', {isLoading: true, data: {}});
        this.getExpandRowDetail(row);
      }
    },
    // 设置行展开数据
    async setExpandRowDetail(row, module, apiName, params) {
      row.detail.isLoading = true;
      const res = await this.$api[module][apiName](params);
      row.detail.isLoading = false;
      if (res.status === 200) row.detail.data = res.data;
    },
    // 根据需要获取的表格查询参数类型，获取表格查询参数
    getTableRequestParams(type = ['page', 'sort'], otherParams = {}) {
      if (!(type instanceof Array)) return {...otherParams};
      const params = {};
      if (type.includes('page')) {
        Object.assign(params, {
          currentPage: this.pagination.current,
          pageSize: this.pagination.size
        });
      }
      if (type.includes('sort')) {
        if (!this.table.orderField) this.setTableSortValue(this.table.defaultSort);
        Object.assign(params, {
          orderField: this.table.orderField,
          orderBy: this.table.orderBy
        });
      }
      return Object.assign(params, otherParams);
    },
    rowIndex(index) {
      return (this.hasPagination ? (this.pagination.current - 1) * this.pagination.size : 0) + index + 1;
    },
    /**
     * 同步下载，利用浏览器自带的文件下载功能
     * @param {string} url - 接口地址
     * @param {Object} [params=null] - 下载参数，qs.stringify会将该对像转为形如：id=123&name=Ada
     * @param {string} [filename=''] - 下载文件名
     */
    downloadFile(url, params = null, filename = '') {
      const el = document.createElement('a');
      el.style.display = 'none';
      document.body.appendChild(el);
      filename && el.setAttribute('download', filename);
      const queryStr = [qs.stringify(params)].map(item => item && `?${item}`)[0];
      el.href = this.$tool.getFullUrl(url + queryStr);
      el.click();
      document.body.removeChild(el);
    },
    /**
     * 异步-带header(token)
     * @param {string} [method='GET'] - 请求方法get/post(不区分大小写)
     * @param {string} url - 接口地址
     * @param {Object} params - 下载参数，get格式为：?id=123&&name="文件下载"
     * @param {string} filename - 下载文件名(必填，若为空，下载下来都是txt格式)
     * @param {Object} [config={}] - 异步请求其它配置
     */
    async downloadFileAsync(method = 'GET', url, params, filename, config = {}) {
      const actionId = Date.now();
      const res = await this.$request.ajax(method, url, params, Object.assign({
        baseURL: '/download',
        responseType: 'blob',
        transformResponse: this.transformResponse,
        onDownloadProgress: event => this.downloadProgress(event, actionId, filename)
      }, config));
      if (res.status === 200) {
        const blob = new Blob([res.data]);
        const fileUrl = URL.createObjectURL(blob);
        this.downloadFile(fileUrl, null, filename || res.headers['content-disposition'] || '下载文件名');
        URL.revokeObjectURL(fileUrl);
      } else {
        this.$message.error('文件获取失败，请稍后再试。');
      }
    },
    // 文件下载响应头格式
    transformResponse(data) {
      return {
        data,
        status: data ? 200 : 500
      };
    },
    // 文件下载进度 actionId：时间戳-标识此次的下载事件
    downloadProgress({loaded, total}, actionId, filename = '') {
      const message = `${filename}<br/>${(loaded / total * 100).toFixed(2)}%（${loaded} / ${total}）`;
      if (!this.notifications[actionId]) {
        this.notifications[actionId] = this.$notify.info({
          title: '文件生成进度',
          message,
          position: 'bottom-left',
          dangerouslyUseHTMLString: true,
          duration: 0
        });
      } else {
        this.notifications[actionId].message = message;
      }
      if (this.notifications[actionId] && total === loaded) this.notifications[actionId].close();
    }
  },
  created() {
    this.table.getRowKey = this.getRowKey;
  }
};
