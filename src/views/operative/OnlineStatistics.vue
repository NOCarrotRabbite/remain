<template>
  <div class="onlineStatistics">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>在线分布数据</span>
      </div>
      <el-row class="chartBox">
        <el-col :span="12"
                :offset="7">
          <el-row :gutter="10"
                  class="echart-left top">
            <el-col :span="19">
              <el-date-picker v-model="queryDate"
                              type="datetimerange"
                              :picker-options="pickerOptions2"
                              range-separator="-"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              align="right"
                              size="small"
                              @change="setQueryDate">
              </el-date-picker>
            </el-col>
            <el-col :span="5"
                    class="buttonBox">
              <el-button @click="queryData"
                         type="primary"
                         style="padding: 9px 11px">重置</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="20"
                :offset="2">
          <div id="echarts"
               class="line-chart"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserNumber',
  data() {
    return {
      // 表单数据
      queryDate: '',
      pickerOptions2: {
        disabledDate(time) {
          let curDate = (new Date()).getTime();
          let week = 3600 * 1000 * 24 * 7;
          let onWeek = curDate - week;
          return time.getTime() > Date.now() || time.getTime() < onWeek;
        }
      },
      // 人数统计
      number: {
        historyLogin: 2000,
        historyCharge: 200,
        historyMaxOnline: 200,
        historyMaxIncreasing: 200,
        averageLogin: 2000,
        averageCharge: 200,
        averageOnline: 200,
        averageIncreasing: 200,

      },
      // 在线分布数据
      maxOnlineUser: 0,
      // 查询参数
      time_begin: null,
      time_end: null,
      // 定时器
      timer: null,
      // 初始化图表
      myChart: '',
      // 图表配置
      option: {
        tooltip: {
          trigger: 'axis'
        },
        title: {
          text: '在线玩家',
          subtext: 'Online Player Trend Chart',
          x: 'center'
        },
        xAxis: {
          type: 'time',
          axisTick: {
            show: false
          },
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
          max: this.yaxisMaxValue,
          splitNumber: 7,
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
        series: [{
          name: '同时在线玩家',
          data: '',
          type: 'line',
        }],
        legend: {
          type: 'scroll',
          right: 115,
          top: 20,
          bottom: 20,
          data: ['同时在线玩家']
        },
      }
    };
  },
  mounted() {
    this.myChart = this.echarts.init(document.getElementById('echarts'));
    this.queryOnlineData(this.myChart, this.getParams(0));
    this.$nextTick(function () {
      this.setTimer();
    });
  },
  methods: {
    // 请求图表数据
    queryOnlineData(chart, formData) {
      this.$axios.postFormData(this.API.ONLINE_STATISTICS_API, formData)
        .then((res) => {
          if (res.success === true) {
            this.option.series[0].data = res.data;
            chart.setOption(this.option);
          } else {
            this.$message.error(res.message || '请求失败，请重试！');
          }
        });
    },
    // 获取查询参数
    getParams(type) {
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token')
      };
      if (type == 0) {
        let startDate = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
        let endDate = new Date();
        param.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', startDate);
        param.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', endDate);
      } else {
        param.time_begin = this.time_begin;
        param.time_end = this.time_end;
      }
      return param;
    },
    // 设置定时请求
    setTimer() {
      this.timer = setInterval(() => {
        this.queryOnlineData(this.myChart, this.getParams(0));
      }, 60000);
    },
    // 重置事件
    queryData() {
      this.queryOnlineData(this.myChart, this.getParams(0));
      this.queryDate = '';
      this.$nextTick(function () {
        this.setTimer();
      });
    },
    // 日期改变事件
    setQueryDate() {
      this.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.queryDate[0]);
      this.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.queryDate[1]);
      this.queryOnlineData(this.myChart, this.getParams());
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};
</script>
<style lang="scss" scoped>
.onlineStatistics {
  .firstList {
    padding-top: 20px;
  }
  .secondList {
    padding-bottom: 20px;
  }
  .statisticsBox {
    .cardContent {
      height: 80px;
      display: flex;
      padding: 20px;
      // border: 1px solid #e4e6eb;
      //border-radius: 6px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      // background: rgba(145, 199, 174, 0.1);
      .contentLeft {
        width: 30%;
        text-align: right;
        padding-right: 10px;
        display: flex;
        align-items: center;
        justify-content: right;
        i {
          font-size: 40px;
          padding: 3px;
          color: rgba($color: #aaa, $alpha: 1);
        }
      }
      .contentRight {
        width: 70%;
        text-align: left;
        color: #333;
        .title {
          padding-bottom: 20px;
          font-weight: 400;
        }
        p {
          color: #888;
          font-weight: bold;
        }
      }
    }
    .noBorder {
      border: none;
      box-shadow: none;
    }
  }
  .chartBox {
    padding: 70px 0 0 0;
    .col-right {
      // z-index: 997;
      padding-right: 50px;
      .top {
        padding-bottom: 30px;
        // z-index: 998;
        .el-date-picker {
          input {
            border: 0;
          }
        }
        .buttonBox {
          // z-index: 999;
        }
      }
      .echart-left {
        text-align: left;
        .bottomContent {
          justify-content: center;
          align-items: center;
          height: 237px;
          display: flex;
          padding: 20px;
          border: 1px solid #e4e6eb;
          border-radius: 6px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          .cardLeft {
            width: 30%;
            text-align: center;
            padding-right: 10px;
            i {
              padding: 5px;
              font-size: 3em;
            }
          }
          .cardRight {
            width: 70%;
            text-align: left;
            p {
              padding-bottom: 25px;
            }
          }
        }
      }
      .bottom {
        .bottomContent {
          //background-color: rgba(145, 199, 174, 0.1);
          color: #a3a3a3;
        }
        padding-right: 10px;
      }
    }
    .line-chart {
      width: 100%;
      height: 400px;
      text-align: left;
      padding: 65px 0 20px 0;
    }
  }
}
</style>
<style lang="scss">
.onlineStatistics {
  .el-range-editor.el-input__inner {
    width: 100%;
    height: 35px;
    input {
      height: 28px;
    }
  }
}
</style>
