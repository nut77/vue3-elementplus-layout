<template>
  <div class="dflex box">
    <div class="box-top dflex">
      <div class="box-top-item" v-for="item of boxTopList" :key="item.title">
        <p class="box-title">{{item.title}}</p>
        <div class="box-content" :class="item.isEmpty ? 'box--empty' : ''" v-loading="item.isLoading"></div>
      </div>
    </div>
    <div class="box-bottom mgt20 flex">
      <p class="box-title">{{boxBottom.title}}</p>
      <div class="box-content" :class="boxBottom.isEmpty ? 'box--empty' : ''" v-loading="boxBottom.isLoading"></div>
    </div>
  </div>
</template>

<script>
import echartsOption from '@a/javascript/echartsOption';
import mixins from '@/mixins';
export default {
  name: 'Overview',
  mixins: [mixins.echarts],
  data() {
    const initChartInfo = (title, selector, api) => ({title, isEmpty: true, chart: null, isLoading: false, selector, api});
    return {
      boxTopList: [
        initChartInfo('已完成订单', '.box-top-item:nth-child(1) .box-content'),
        initChartInfo('已完成订单分类统计', '.box-top-item:nth-child(2) .box-content', this.$api.orderManage.getPieData),
        initChartInfo('未完成订单', '.box-top-item:nth-child(3) .box-content'),
        initChartInfo('未完成订单分类统计', '.box-top-item:nth-child(4) .box-content', this.$api.orderManage.getPieData)
      ],
      boxBottom: initChartInfo('订单趋势', '.box-bottom .box-content', this.$api.orderManage.getLineData)
    };
  },
  methods: {
    drawChartPie(info) {
      const option = echartsOption.pie;
      this.drawChart(info, option, data => {
        data = data.sort((a, b) => a.value - b.value);
        option.series[0].data = data;
      });
    },
    // 获得百分比图表
    async drawChartRatio(infoList) {
      const options = [];
      infoList.map(info => {
        this.initChart(info);
        info.isEmpty = true;
        info.isLoading = true;
        options.push(this.$tool.objectDeepClone(echartsOption.ratio));
      });
      const res = await this.$api.orderManage.getRatioData();
      infoList.map(info => (info.isLoading = false));
      if (res.status === 200 && res.data) {
        infoList.map((info, index) => {
          const option = options[index];
          const isUnfinishedStat = info.title.includes('未完成');
          const value = isUnfinishedStat ? res.data.unfinished : res.data.finished;
          option.angleAxis.max = res.data.total;
          option.series[0].data = [value];
          option.title[0].text = value + '单';
          option.title[1].text = ((value / (res.data.total || 1)) * 100).toFixed(2) + '%';
          const color = isUnfinishedStat ? '#EC2F4F' : '#06AE1C';
          option.title[0].textStyle.color = color;
          option.title[1].textStyle.color = color;
          option.series[0].itemStyle.color.colorStops[1].color = color;
          info.isEmpty = !value;
          info.chart.setOption(option, true);
          this.handleResize(info.chart.resize);
        });
      }
    },
    drawChartLine(info) {
      const option = echartsOption.line;
      this.drawChart(info, option, data => {
        data = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        option.xAxis.data = data.map(item => item.date);
        option.series[0].data = data.map(item => item.value);
      });
    }
  },
  mounted() {
    this.drawChartPie(this.boxTopList[1]);
    this.drawChartPie(this.boxTopList[3]);
    this.drawChartRatio([this.boxTopList[0], this.boxTopList[2]]);
    this.drawChartLine(this.boxBottom);
  },
  beforeDestroy() {
    this.disposeCharts([...this.boxTopList, this.boxBottom]);
  }
};
</script>

<style scoped lang="less">
  .box {
    flex-direction: column;
  }
  .box-top {
    justify-content: space-between;
    height: 250px;
    min-height: 250px;
  }
  .box-top-item {
    flex: 1;
    min-width: 250px;
    & + & {
      .mgl20;
    }
  }
  .box-top-item,
  .box-bottom {
    .dflex;
    flex-direction: column;
    .pd15;
    background: @background-color-lighter;
    border-radius: 5px;
  }
  .box-bottom {
    min-height: 300px;
  }
  .box-title {
    .pdb10;
  }
  .box-content {
    .flex;
  }
</style>
