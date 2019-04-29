<template>
  <div ref="barChart"
       class="barCharts"></div>
</template>
<script>
export default {
  name: 'barChart',
  data() {
    let dataMap = {};
    function dataFormatter(obj) {
      let pList = ['游戏1', '游戏2', '游戏3', '游戏4', '游戏5', '游戏6', '游戏7', '游戏8', '游戏9', '游戏10', '游戏11', '游戏12', '游戏13', '游戏14'];
      let temp;
      for (let year = 2002; year <= 2011; year++) {
        let max = 0;
        let sum = 0;
        temp = obj[year];
        for (let i = 0, l = temp.length; i < l; i++) {
          max = Math.max(max, temp[i]);
          sum += temp[i];
          obj[year][i] = {
            name: pList[i],
            value: temp[i]
          };
        }
        obj[year + 'max'] = Math.floor(max / 100) * 100;
        obj[year + 'sum'] = sum;
      }
      return obj;
    }

    dataMap.dataGDP = dataFormatter({
      // max : 60000,
      2011: [16251.93, 11307.28, 24515.76, 11237.55, 14359.88, 22226.7, 10568.83, 12582, 19195.69, 49110.27, 32318.85, 15300.65, 17560.18, 11702.82],
      2010: [14113.58, 9224.46, 20394.26, 9200.86, 11672, 18457.27, 8667.58, 10368.6, 17165.98, 41425.48, 27722.31, 12359.33, 14737.12, 9451.26],
      2009: [12153.03, 7521.85, 17235.48, 7358.31, 9740.25, 15212.49, 7278.75, 8587, 15046.45, 34457.3, 22990.35, 10062.82, 12236.53, 7655.18],
      2008: [11115, 6719.01, 16011.97, 7315.4, 8496.2, 13668.58, 6426.1, 8314.37, 14069.87, 30981.98, 21462.69, 8851.66, 10823.01, 6971.05],
      2007: [9846.81, 5252.76, 13607.32, 6024.45, 6423.18, 11164.3, 5284.69, 7104, 12494.01, 26018.48, 18753.73, 7360.92, 9248.53, 5800.25],
      2006: [8117.78, 4462.74, 11467.6, 4878.61, 4944.25, 9304.52, 4275.12, 6211.8, 10572.24, 21742.05, 15718.47, 6112.5, 7583.85, 4820.53],
      2005: [6969.52, 3905.64, 10012.11, 4230.53, 3905.03, 8047.26, 3620.27, 5513.7, 9247.66, 18598.69, 13417.68, 5350.17, 6554.69, 4056.76],
      2004: [3110.97, 8477.63, 3571.37, 3041.07, 6672, 3122.01, 4750.6, 8072.83, 15003.6, 11648.7, 4759.3, 5763.35, 3456.7, 15021.84],
      2003: [5007.21, 2578.03, 6921.29, 2855.23, 2388.38, 6002.54, 2662.08, 4057.4, 6694.23, 12442.87, 9705.02, 3923.11, 4983.67, 2807.41],
      2002: [4315, 2150.76, 6018.28, 2324.8, 1940.94, 5458.22, 2348.54, 3637.2, 5741.03, 10606.85, 8003.67, 3519.72, 4467.55, 2450.48]
    });
    return {
      chartBar: '',
      option: {
        baseOption: {
          // 时间控件
          timeline: {
            axisType: 'category',
            autoPlay: true,
            playInterval: 3000,
            data: [
              '2002-01-01', '2003-01-01', '2004-01-01',
              {
                value: '2005-01-01',
                tooltip: {
                  formatter: '{b} GDP达到一个高度'
                },
                symbol: 'diamond',
                symbolSize: 16
              },
              '2006-01-01', '2007-01-01', '2008-01-01', '2009-01-01', '2010-01-01',
              {
                value: '2011-01-01',
                tooltip: {
                  formatter(params) {
                    return params.name + 'GDP达到又一个高度';
                  }
                },
                symbol: 'diamond',
                symbolSize: 18
              },
            ],
            label: {
              formatter(s) {
                return (new Date(s)).getFullYear();
              }
            }
          },
          title: {
            text: '库存统计',
            subtext: 'repertory Trend Chart',
            x: 'center'
          },
          tooltip: {
          },
          /* legend: {
            x: 'right',
            data: ['库存统计']
          }, */
          calculable: true,
          grid: {
            top: 100,
            bottom: 100,
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
                /* label: {
                  show: true,
                  formatter(params) {
                    return params.value.replace('\n', '');
                  }
                } */
              }
            }
          },
          xAxis: [
            {
              type: 'category',
              axisLabel: { interval: 0 },
              data: [
                '游戏1', '游戏2', '游戏3', '游戏4', '游戏5', '游戏6', '游戏7', '游戏8', '游戏9', '游戏10', '游戏11', '游戏12', '游戏13', '游戏14'
              ],
              splitLine: { show: false }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '金币（万元）',
            }
          ],
          series: [
            { name: '库存统计', type: 'bar' }
          ]
        },
        options: [
          {
            title: { text: '2002库存统计' },
            series: [
              {
                label: {
                  show: true,
                  position: 'top'
                },
                data: dataMap.dataGDP['2002']
              }
            ]
          },
          {
            title: { text: '2003库存统计' },
            series: [
              {
                label: {
                  show: true,
                  position: 'top'
                },
                data: dataMap.dataGDP['2003'] }
            ]
          },
          {
            title: { text: '2004库存统计' },
            series: [
              {
                label: {
                  show: true,
                  position: 'top'
                },
                data: dataMap.dataGDP['2004'] }
            ]
          },
          {
            title: { text: '2005库存统计' },
            series: [
              {
                label: {
                  show: true,
                  position: 'top'
                },
                data: dataMap.dataGDP['2005'] }
            ]
          },
          {
            title: { text: '2006库存统计' },
            series: [
              {
                label: {
                  show: true,
                  position: 'top'
                },
                data: dataMap.dataGDP['2006'] }
            ]
          },
          {
            title: { text: '2007库存统计' },
            series: [
              {
                label: {
                  show: true,
                  position: 'top'
                },
                data: dataMap.dataGDP['2007'] }
            ]
          },
          {
            title: { text: '2008库存统计' },
            series: [
              {
                label: {
                  show: true,
                  position: 'top'
                },
                data: dataMap.dataGDP['2008'] }
            ]
          },
          {
            title: { text: '2009库存统计' },
            series: [
              {
                label: {
                  show: true,
                  position: 'top'
                },
                data: dataMap.dataGDP['2009'] }
            ]
          },
          {
            title: { text: '2010库存统计' },
            series: [
              {
                label: {
                  show: true,
                  position: 'top'
                },
                data: dataMap.dataGDP['2010'] }
            ]
          },
          {
            title: { text: '2011库存统计' },
            series: [
              {
                label: {
                  show: true,
                  position: 'top'
                },
                data: dataMap.dataGDP['2011'] }
            ]
          }
        ]
      }
    };
  },
  mounted() {
    this.chartBar = this.$refs.barChart;
    this.chartBar.style.width = window.innerWidth - 400 + 'px';
    this.chartBar = this.echarts.init(this.$refs.barChart);
    this.chartBar.setOption(this.option);
  },
  methods: {
  }
};
</script>
<style lang="scss">
.barCharts {
  width: 100%;
  height: 700px;
}
</style>
