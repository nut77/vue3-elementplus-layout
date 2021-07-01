import * as echarts from 'echarts';
export default {
  data() {
    return {
      resizeFunctionAttr: []
    };
  },
  methods: {
    initChart(info) {
      if (!info.chart) {
        const el = document.querySelector(info.selector);
        info.chart = echarts.init(el);
      }
    },
    // 针对单个图表的异步加载
    async drawChart(info, option, cb) {
      info.isLoading = true;
      this.initChart(info);
      const res = await info.api();
      info.isLoading = false;
      if (res.status === 200 && res.data) {
        cb(res.data);
        info.chart.setOption(option, true);
        this.handleResize(info.chart.resize);
        info.isEmpty = false;
      } else {
        info.isEmpty = true;
      }
    },
    // 图表随窗口缩放
    handleResize(func) {
      const resizeCallback = () => {
        try { func(); } catch (e) {}
      };
      window.addEventListener('resize', resizeCallback);
      this.resizeFunctionAttr.push(resizeCallback);
    },
    // 移除所有监听的resize方法
    removeResizeHandler() {
      this.resizeFunctionAttr.map(func => window.removeEventListener('resize', func));
      this.resizeFunctionAttr = [];
    },
    // 销毁图表实例释放资源
    disposeCharts(chartsList) {
      chartsList.map(item => {
        if (item.chart) {
          echarts.dispose(item.chart);
          item.chart = null;
        }
      });
    }
  },
  destroyed() {
    this.removeResizeHandler();
  }
};
