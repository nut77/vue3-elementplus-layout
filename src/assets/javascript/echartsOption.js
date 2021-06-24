const option = {};

const tooltipStyle = {
  backgroundColor: '#C9D2FF',
  transitionDuration: 0.5,
  textStyle: {
    color: '#10101D',
    fontSize: 12
  },
  borderColor: 'transparent'
};

option.line = {
  tooltip: Object.assign({
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  }, tooltipStyle),
  grid: {
    top: 30,
    left: 60,
    right: 30,
    bottom: 60
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLabel: {
      color: '#c9d2ff',
      fontSize: 10
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#262e54',
        width: 0.7,
        type: 'solid'
      }
    },
    axisLine: {
      lineStyle: {
        color: '#262e54'
      }
    },
    data: ['02-01', '02-02', '02-03', '02-04', '02-05', '02-06', '02-07', '02-08', '02-09', '02-10', '02-11', '02-12', '02-13', '02-14', '02-15']
  },
  yAxis: {
    type: 'value',
    min: 0,
    axisLine: {
      lineStyle: {
        color: '#262e54'
      }
    },
    axisLabel: {
      color: '#c9d2ff'
    },
    splitLine: {
      lineStyle: {
        color: '#262e54',
        width: 0.7,
        type: 'solid'
      }
    }
  },
  series: [{
    type: 'line',
    name: '订单数',
    lineStyle: {
      color: '#ff8800'
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: '#ff8800'
        }, {
          offset: 1, color: 'rgba(255, 150, 79, 0.01)'
        }]
      }
    },
    data: [820, 932, 901, 934, 1290, 1330, 1320, 1212, 45, 67, 88, 2456, 332, 667, 122]
  }],
  dataZoom: [
    {
      id: 'dataZoomX',
      type: 'inside',
      xAxisIndex: [0],
      filterMethod: 'none',
      start: 0,
      end: 200,
      handleSize: 8
    }
  ]
};

option.bar = {
  tooltip: Object.assign({
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#c9d2ff'
      }
    }
  }, tooltipStyle),
  grid: {
    top: 60,
    left: 60,
    right: 30,
    bottom: 50
  },
  textStyle: {
    color: '#c9d2ff'
  },
  color: ['#41b2ff', '#06ae1c', '#ec2f4f'],
  legend: {
    data: ['总数据节点', '去重数据节点', '风险数据节点'],
    textStyle: {
      color: '#c9d2ff'
    },
    left: 35
  },
  xAxis: [
    {
      axisLabel: {
        interval: 0,
        rotate: 20
      },
      type: 'category',
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      interval: 50,
      axisLabel: {
        formatter: '{value}'
      },
      axisLine: {
        lineStyle: {
          color: '#262e54'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#262e54',
          width: 0.7,
          type: 'solid'
        }
      }
    }
  ],
  series: [
    {
      name: '总数据节点',
      type: 'bar',
      barWidth: 10,
      barGap: '70%'
    },
    {
      name: '去重数据节点',
      type: 'bar',
      barWidth: 10
    },
    {
      name: '风险数据节点',
      type: 'bar',
      barWidth: 10
    }
  ]
};

option.pie = {
  tooltip: Object.assign({
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  }, tooltipStyle),
  series: [
    {
      color: ['#41b2ff', '#FF8800', '#EC2F4F', '#06AE1C', '#7E84A3'],
      name: '商品类型',
      type: 'pie',
      radius: ['0%', '80%'],
      center: ['50%', '50%'],
      data: [
        {value: 335, name: '电脑数码'},
        {value: 310, name: '家用电器'},
        {value: 274, name: '个护化妆'},
        {value: 235, name: '日用百货'},
        {value: 400, name: '图书影像'}
      ].sort((a, b) => a.value - b.value),
      roseType: 'radius',
      label: {
        color: '#c9d2ff'
      },
      labelLine: {
        lineStyle: {
          color: '#c9d2ff'
        },
        smooth: 0.2,
        length: 10,
        length2: 20
      },
      itemStyle: {
        shadowBlur: 200,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: () => Math.random() * 200
    }
  ]
};

const seriesPie = {
  name: '',
  type: 'pie',
  startAngle: 90,
  hoverAnimation: false,
  center: ['50%', '50%'],
  itemStyle: {
    normal: {
      labelLine: {
        show: false
      },
      color: 'rgba(66, 66, 66, .4)',
      shadowBlur: 10,
      shadowColor: 'rgba(253, 249, 20, .3)'
    }
  },
  data: [{value: 100}]
};
option.ratio = {
  title: [{
    text: '1000',
    x: 'center',
    top: '53%',
    textStyle: {
      color: '#fdf914',
      fontSize: 14
    }
  }, {
    text: '60%',
    x: 'center',
    top: '42%',
    textStyle: {
      fontSize: '14',
      color: '#fdf914'
    }
  }],
  polar: {
    radius: ['65%', '70%'],
    center: ['50%', '50%']
  },
  angleAxis: {
    max: 100,
    show: false
  },
  radiusAxis: {
    type: 'category',
    show: true,
    axisLabel: {
      show: false
    },
    axisLine: {
      show: false

    },
    axisTick: {
      show: false
    }
  },
  series: [
    {
      name: '',
      type: 'bar',
      roundCap: true,
      barWidth: 50,
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(66, 66, 66, .3)'
      },
      data: [60],
      coordinateSystem: 'polar',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 1,
          x2: 0,
          y2: 0,
          colorStops: [{
            offset: 0, color: '#fdf914'
          }, {
            offset: 1, color: '#38a700'
          }]
        }
      }
    },
    Object.assign({radius: ['80%', '85%']}, seriesPie),
    Object.assign({radius: ['86.5%', '90%']}, seriesPie),
    Object.assign({radius: ['91.5', '93%']}, seriesPie),
    Object.assign({radius: ['94.5%', '95%']}, seriesPie)
  ]
};

export default option;
