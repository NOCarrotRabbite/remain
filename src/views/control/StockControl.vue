<template>
  <div class="stockControl">
    <el-card class="box-card card">
      <div slot="header"
           class="clearfix">
        <span>库存统计</span>
      </div>
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane label="折线图"
                     name="line">
          <el-form :inline="true"
                   class="demo-ruleForm seachInput">
            <el-form-item label="游戏类型：">
              <el-select v-model="name"
                         @change="switchGameLine">
                <el-option v-for="item in gameList"
                           :key="item"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="查询时间："
                          class="dateInput">
              <el-date-picker v-model="timeVal"
                              type="datetimerange"
                              :picker-options="pickerOptions2"
                              range-separator="-"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              align="right"
                              size="small"
                              @change="setQueryDate">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button @click="clearInput"
                         type="primary"
                         class="btnQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <div class="line-chart"
               id="lineChart"
               v-if="'line' ==  activeName"></div>
        </el-tab-pane>
        <el-tab-pane label="柱状图"
                     name="bar">
          <div class="bar-chart"
               id="barChart"
               v-if="'bar' ==  activeName"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'stockControl',
  data() {
    return {
      flag: false,
      gameList: [],
      time_begin: null,
      time_end: null,
      name: '龙虎斗',
      activeName: 'line',
      // 事件查询控制参数
      isSeach: false,
      timeVal: [],
      pickerOptions2: {
        disabledDate(time) {
          let curDate = (new Date()).getTime();
          let week = 3600 * 1000 * 24 * 7;
          let onWeek = curDate - week;
          return time.getTime() > Date.now() || time.getTime() < onWeek;
        }
      },
      // 定义折线图表对象
      myLineChart: '',
      // 定义柱状图对象
      myBarChart: '',

      // 折线图表配置
      optionLine: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false
          }
        },
        title: {
          text: '游戏库存走势图',
          subtext: 'Game Inventory Trend Chart',
          x: 'center'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 152,
          top: 20,
          bottom: 20,
          show: true,
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

      // 柱状图配置
      optionBar: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        title: {
          text: '游戏库存对比图',
          subtext: 'Game Inventory Contrast Chart',
          x: 'center'
        },
        grid: {
          top: 60,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLine: {
            symbol: ['none', 'arrow'],
            symbolSize: [5, 10],
            lineStyle: {
              type: 'solid'
            }
          },
          axisLabel: {
            interval: 0,
            rotate: 40
          },
          data: []
        },
        yAxis: {
          type: 'value',
          axisLine: {
            symbol: ['none', 'arrow'],
            symbolSize: [5, 10],
            lineStyle: {
              type: 'solid'
            }
          }
        },
        series: [{
          type: 'bar',
          data: []
        }]
      }
    };
  },
  created() {
    this.queryGameList();
  },
  mounted() {
    this.queryLineData(this.getParams());
  },
  methods: {
    // 查询游戏库存折线图数据
    queryLineData(param) {
      this.$axios.postFormData(this.API.GAMESTORAGELIST_API, param)
        .then((res) => {
          if (res.success == true) {
            this.optionLine.legend.data = [];
            this.optionLine.series = [];
            let seriesItem = { type: 'line', name: param.game_name, data: res.data };
            this.optionLine.legend.data.push(param.game_name);
            this.optionLine.series.push(seriesItem);
            // 渲染折线图表
            this.myLineChart = this.echarts.init(document.getElementById('lineChart'));
            this.myLineChart.setOption(this.optionLine);
          } else {
            this.$message.error(res.message || '请求失败，请重试！');
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 查询游戏库存柱状图数据
    queryHistogramData() {
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token'),
      };
      this.$axios.postFormData(this.API.GAMESLIST_API, param)
        .then((res) => {
          if (res.success == true) {
            let tempXaxisData = ['三轴拉霸1', '三轴拉霸2', '三轴拉霸3', '兰桂坊1', '兰桂坊2', '兰桂坊3',
              '小鸡快跑1', '小鸡快跑2', '小鸡快跑3', '时代巨星1', '时代巨星2', '时代巨星3', '水果连连看1', '水果连连看2', '水果连连看3',
              '王者传奇1', '王者传奇2', '王者传奇3', '生财有道1', '生财有道2', '生财有道3', '美人传奇1', '美人传奇2', '美人传奇3', '奔驰宝马',
              '百人斗牛', '百人骰宝', '红黑大战', '飞禽走兽', '龙虎斗'];
            let tempSeriesData = [];
            let map = new Map();
            for (let i in res.data) {
              /* tempXaxisData.push(res.data[i].name);
              tempSeriesData.push(res.data[i].storage); */
              map.set(res.data[i].name, res.data[i].storage);
              if (!tempXaxisData.includes(res.data[i].name)) {
                tempXaxisData.push(res.data[i].name);
              }
            }
            for (let i in tempXaxisData) {
              tempSeriesData[i] = map.get(tempXaxisData[i]);
            }
            this.optionBar.xAxis.data = tempXaxisData;
            this.optionBar.series[0].data = tempSeriesData;
            // 渲染柱状图表
            this.myBarChart = this.echarts.init(document.getElementById('barChart'));
            this.myBarChart.setOption(this.optionBar);
          } else {
            this.$message.error(res.message || '请求失败，请重试！');
            return false;
          }
        }).catch((error) => {
          console.log(error);
        });
    },

    // 获取游戏列表
    queryGameList() {
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token'),
      };
      this.$axios.postFormData(this.API.GAMESLIST_API, param)
        .then((res) => {
          if (res.success == true) {
            for (let i = 0; i < res.data.length; i++) {
              this.gameList.push(res.data[i].name);
            }
          } else {
            this.$message.error(res.message || '请求失败，请重试！');
            return false;
          }
        }).catch((error) => {
          console.log(error);
        });
    },

    // 获取查询参数
    getParams() {
      if (!this.isSeach) {
        this.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
        this.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', new Date());
      }
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token'),
        time_begin: this.time_begin,
        time_end: this.time_end,
        game_name: this.name
      };
      return param;
    },
    // 根据相应的游戏数据类型请求相应的库存数据
    switchGameLine() {
      this.queryLineData(this.getParams());
    },
    // 日期改变事件
    setQueryDate() {
      if (this.timeVal) {
        this.isSeach = true;
        this.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.timeVal[0]);
        this.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.timeVal[1]);
      } else {
        this.isSeach = false;
      }
      this.switchGameLine();
    },
    // 清空查询输入框
    clearInput() {
      this.isSeach = false;
      this.timeVal = '';
      this.switchGameLine();
    },
    handleClick(tab, event) {
      if (this.activeName == 'line') {
        // 渲染折线图表
        this.queryLineData(this.getParams());
      } else {
        // 渲染柱状图表
        this.queryHistogramData(this.myBarChart);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.stockControl {
  .line-chart {
    width: 100%;
    height: 500px;
    padding-top: 30px;
  }
  .bar-chart {
    width: 100%;
    height: 500px;
    padding-top: 30px;
  }
}
</style>
<style lang="scss">
.stockControl {
  .demo-ruleForm {
    display: flex;
    justify-content: center;
  }
  .el-select {
    padding: 0 20px 0 0;
  }
  .dateInput {
    padding-right: 20px;
    .el-form-item__content {
      width: 240px;
      .el-range-editor.el-input__inner {
        width: 240px;
        height: 35px;
        padding: 0 10px;
        margin-top: 3px;
        input {
          width: 90px;
          height: 28px;
        }
      }
    }
  }
}
</style>
