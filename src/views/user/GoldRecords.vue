<template>
  <div class="goldRecords">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>金币库存</span>
      </div>
      <el-row :gutter="10" class="statisticsBox">
        <el-col :span="8">
          <div class="cardContent">
            <div class="contentLeft">
              <i class="iconfont icon-jinbi1"></i>
            </div>
            <div class="contentRight">
              <p class="title">玩家金币总量</p>
              <p class="num">{{gold.x}}</p>
              <p class="cap">{{gold.capX}}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="cardContent">
            <div class="contentLeft">
              <i class="iconfont icon-jinbi1"></i>
            </div>
            <div class="contentRight">
              <p class="title">代理金币总量</p>
              <p class="num">{{gold.y}}</p>
              <p class="cap">{{gold.capY}}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="cardContent">
            <div class="contentLeft">
              <i class="iconfont icon-jinbi1"></i>
            </div>
            <div class="contentRight">
              <p class="title">推广积分总量</p>
              <p class="num">{{gold.z}}</p>
              <p class="cap">{{gold.capZ}}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="cardContent">
            <div class="contentLeft">
              <i class="iconfont icon-jinbi1"></i>
            </div>
            <div class="contentRight">
              <p class="title">历史推广积分总量</p>
              <p class="num">{{gold.sumHistoryPromote}}</p>
              <p class="cap">{{gold.capSumHistoryPromote}}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="cardContent">
            <div class="contentLeft">
              <i class="iconfont icon-jinbi1"></i>
            </div>
            <div class="contentRight">
              <p class="title">金币库存总量</p>
              <p class="num">{{gold.total}}</p>
              <p class="cap">{{gold.capTotal}}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="cardContent">
            <div class="contentLeft">
              <i class="iconfont icon-jinbi1"></i>
            </div>
            <div class="contentRight">
              <p class="title">生成金币总量</p>
              <p class="num">{{gold.produceTotal}}</p>
              <p class="cap">{{gold.capProduceTotal}}</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <div id="coin-echart"
           class="pie-chart"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'GoldRecords',
  data() {
    return {
      gold: {
        x: '',
        y: '',
        z: '',
        total: '',
        produceTotal: '',
        sumHistoryPromote: '',
        capX: '',
        capY: '',
        capZ: '',
        capTotal: '',
        capProduceTotal: '',
        capSumHistoryPromote: '',

      },
      timer: null,
      myChart: '',
      option: {
        title: {
          text: '系统金币类目总量',
          subtext: 'Gold Coins',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}亿 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['玩家金币总量', '代理金币总量', '推广积分总量']
        },
        series: [
          {
            name: '金币类目',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: '',
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.myChart = this.echarts.init(document.getElementById('coin-echart'));
    this.queryGoldData(this.myChart, this.getParams());
    this.$nextTick(function () {
      this.setTimer();
    });
  },
  methods: {
    // 请求图表数据
    queryGoldData(chart, formData) {
      this.$axios.postFormData(this.API.GOLD_STATISTICS_API, formData)
        .then((res) => {
          if (res.success === true) {
            let a = [];
            this.gold.x = this.common.toThousands(res.data.sumMoneyOfPlayer);
            this.gold.capX = this.common.convertCurrency(res.data.sumMoneyOfPlayer);
            this.gold.y = this.common.toThousands(res.data.sumMoneyOfAgent);
            this.gold.capY = this.common.convertCurrency(res.data.sumMoneyOfAgent);
            this.gold.z = this.common.toThousands(res.data.sumPromoteScoreOfPlayer);
            this.gold.sumHistoryPromote = this.common.toThousands(res.data.sumHistoryPromoteScoreOfPlayer);
            this.gold.capSumHistoryPromote = this.common.convertCurrency(res.data.sumHistoryPromoteScoreOfPlayer);
            this.gold.capZ = this.common.convertCurrency(res.data.sumPromoteScoreOfPlayer);
            this.gold.total = this.common.toThousands(Number(res.data.sumMoneyOfPlayer) + Number(res.data.sumMoneyOfAgent) + Number(res.data.sumPromoteScoreOfPlayer));
            this.gold.capTotal = this.common.convertCurrency(Number(res.data.sumMoneyOfPlayer) + Number(res.data.sumMoneyOfAgent) + Number(res.data.sumPromoteScoreOfPlayer));
            this.gold.produceTotal = this.common.toThousands(res.data.sumGeneratedMoney);
            this.gold.capProduceTotal = this.common.convertCurrency(res.data.sumGeneratedMoney);

            a.unshift({ value: res.data.sumMoneyOfAgent / 100000000, name: '代理金币总量' });
            a.unshift({ value: res.data.sumPromoteScoreOfPlayer / 100000000, name: '推广积分总量' });
            a.unshift({ value: res.data.sumMoneyOfPlayer / 100000000, name: '玩家金币总量' });

            this.option.series[0].data = a;
            chart.setOption(this.option);
          } else {
            this.$message.error(res.message || '请求失败，请重试！');
          }
        });
    },
    // 获取参数
    getParams() {
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token')
      };
      return param;
    },
    // 设置定时请求
    setTimer() {
      this.timer = setInterval(() => {
        this.queryGoldData(this.myChart, this.getParams());
      }, 60000);
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
.goldRecords {
  .statisticsBox {
    padding: 20px;
    .el-col-8 {
      padding: 0 0 20px 0;
    }
    .cardContent {
      height: 100px;
      display: flex;
      padding: 20px;
      border: 1px solid #e4e6eb;
      border-radius: 6px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      background: rgba(145, 199, 174, 0.1);
      .contentLeft {
        width: 30%;
        text-align: right;
        padding-right: 10px;
        i {
          font-size: 3vw;
          padding: 3px;
          color: rgba($color: #009933, $alpha: 0.7);
        }
      }
      .contentRight {
        width: 70%;
        text-align: left;
        color: #333;
        p {
          color: #888;
          font-weight: bold;
          font-size: 0.8vw;
        }
        .title {
          padding-bottom: 10px;
          font-weight: 400;
        }
        .num {
          padding-bottom: 5px;
        }
        .cap { font-size: 0.6vw }
      }
    }
   .el-col-5 { width: 20% }
  }
  .el-col {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }

  .pie-chart {
    width: 100%;
    height: 500px;
    padding: 20px;
  }
}
</style>
