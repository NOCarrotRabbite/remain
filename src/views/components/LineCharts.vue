<template>
  <div class="line-chart" id="lineChart"></div>
</template>

<script>
export default {
  name: 'LineChart',
  props: {
    seriesData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 定义折线图表对象
      myChart: '',
      // 定义不同游戏数据数组

      // 折线图表配置
      optionLine: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false
          }
        },
        title: {
          text: '库存统计',
          subtext: 'repertory Trend Chart',
          x: 'center'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: 'left',
          top: 50,
          selected: {},
          data: []
        },
        grid: {
          top: 60,
          containLabel: true
        },
        xAxis: {
          type: 'time',
          axisLine: {
            symbol: ['none', 'arrow'],
            symbolSize: [5, 10],
            lineStyle: {
              type: 'solid'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            symbol: ['none', 'arrow'],
            symbolSize: [5, 10],
            lineStyle: {
              type: 'solid'
            }
          },
          splitLine: {
            show: false
          }
        },
        dataZoom: [{
          type: 'inside',
          show: true,
          filterMode: 'none',
          start: 0,
          end: 100
        }],
        series: []
      },
    };
  },
  created() {},
  mounted() { },
  methods: {
    // 获取游戏列表
    queryGameList() {
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token'),
      };
      this.$axios.postFormData(this.API.GAMESLIST_API, param)
        .then((res) => {
          if (res.success == true) {
            let seriesTemp = [];
            let legendTemp = [];
            let seriesItem = { type: 'line' };
            for (let i = 0; i < res.data.length; i++) {
            }
            this.option.series = seriesTemp;
            this.option.legend.data = legendTemp;
            console.log(this.option.series);
            this.myChart = this.echarts.init(document.getElementById('lineChart'));
            this.myChart.setOption(this.option);
          } else {
            this.$message.error('获取游戏失败！');
            return false;
          }
        }).catch((error) => {
          console.log(error);
        });
    },
    // 初始化曲线
    getSeriesData() {
      // let seriesItem = { type: 'line' };
      // this.option.series.push({ type: 'line', name: '龙虎斗', data: this.seriesData });
      // this.option.legend.data.push(name);
    }
  },
  watch: {
    seriesData: {
      immediate: true,
      handler(val) {
        this.queryGameList();
        //  this.getSeriesData();
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
.line-chart {
  width: 100%;
  height: 700px;
  text-align: left;
}
</style>
<style lang="scss">
.line-chart {
}
</style>
