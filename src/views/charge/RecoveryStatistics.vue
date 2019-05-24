<template>
  <div class="recoveryStatistics">
    <el-card class="box-card cardPadding">
      <div slot="header"
           class="clearfix">
        <span>操作查询</span>
      </div>
      <el-form :inline="true"
               class="demo-ruleForm seachInput">
        <el-form-item label="查询时间："
                      class="dateInput">
          <el-date-picker v-model="timeVal"
                          type="daterange"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['00:00:00', '23:59:59']"
                          @change="setQueryDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="query"
                     type="primary"
                     class="btnQuery">查询</el-button>
          <el-button @click="clearInput"
                     class="btnQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>回收率数据</span>
        </div>
        <el-table :data="tableData"
                  stripe
                  :empty-text="loadingText"
                  :cell-style="cellStyle">
          <el-table-column type="index"
                           width="60px">
            <template slot-scope="scope">
              <span>
                {{scope.$index+(currentPage - 1) * pageSize + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time"
                           label="时间"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="atop_sum"
                           align="center"
                           label="当天累计充值额（A）"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="ptoa_sum"
                           align="center"
                           label="当天累计兑换额（B）"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="recovery"
                           align="center"
                           label="充值回收率（B/A）"
                           show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <Pagination :total="total"
                    :currentPage="currentPage"
                    :pageSize="pageSize"
                    @currentPage="handleChange"
                    @sizeChange="handleChange" />
      </el-card>
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

export default {
  name: 'RecoveryStatistics',
  components: { Pagination },
  data() {
    return {
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      // 表单数据
      timeVal: [],
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loadingText: '数据加载中...'
    };
  },
  created() {
    this.tableDataList();
  },
  methods: {
    // 列表数据
    tableDataList() {
      this.tableData = [];
      if (!this.isSeach) {
        this.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', new Date(new Date().getTime() - 3 * 60 * 60 * 1000 * 24));
        this.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', new Date());
      }
      let obj = {
        account: this.account,
        login_token: this.login_token,
        time_begin: this.time_begin,
        time_end: this.time_end,
        page: this.currentPage - 1
      };
      this.$axios.postFormData(this.API.RECOVERYSTATLIST_API, obj)
        .then((res) => {
          let data = {
            time: '',
            atop_sum: '',
            ptoa_sum: '',
            recovery: ''
          };
          if (res.success == true) {
            this.tableData = [];
            if (res.data_total > 0) {
              for (let i in res.data) {
                let atopSum = parseInt(res.data[i].atop_sum);
                let ptoaSum = parseInt(res.data[i].ptoa_sum);
                data.time = i;
                data.atop_sum = res.data[i].atop_sum;
                data.ptoa_sum = res.data[i].ptoa_sum;
                data.recovery = res.data[i].ptoa_sum == 0 ? '/' : (ptoaSum / atopSum) * 100 + '%';
                this.tableData.push(data);
              }
              this.total = res.data_total;
            } else {
              this.loadingText = '暂无数据';
            }
          } else {
            this.$message.error(res.message || '请求失败，请重试！');
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 查询
    query() {
      this.currentPage = 1;
      if (this.timeVal) {
        this.isSeach = true;
      }
      this.tableDataList();
    },
    // 日期改变事件
    setQueryDate() {
      if (this.timeVal) {
        this.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.timeVal[0]);
        this.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.timeVal[1]);
      } else {
        this.isSeach = false;
        this.tableDataList();
      }
    },
    // 高亮列
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
        return 'color: rgb(236, 85, 98);';
      } else if (columnIndex === 3) {
        return 'color:rgba(0, 153, 51, 0.7);';
      }
      return '';
    },
    // pageSize/currentPage改变事件
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.tableDataList();
    },
    // 清空查询输入框
    clearInput() {
      this.isSeach = false;
      this.timeVal = '';
      this.currentPage = 1;
      this.tableDataList();
    }
  }
};
</script>
<style lang="scss" scoped>
.recoveryStatistics {
  .demo-ruleForm {
    text-align: left;
    padding: 10px;
    .el-form-item {
      padding-right: 20px;
    }
    .el-date-picker {
      input {
        border: 0;
      }
    }
  }
}
</style>
<style lang="scss">
.recoveryStatistics {
  .demo-ruleForm {
    .dateInput {
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
}
</style>
