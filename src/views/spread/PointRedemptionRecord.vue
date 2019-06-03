<template>
  <div class="exchangeList">
    <el-card class="box-card cardPadding">
      <div slot="header"
           class="clearfix">
        <span>操作查询</span>
      </div>
      <el-form :inline="true"
               class="demo-ruleForm seachInput">
        <el-form-item label="玩家ID：">
          <el-input v-model="query_number"
                    clearable
                    placeholder="请输入玩家ID"></el-input>
        </el-form-item>
        <el-form-item label="查询时间："
                      class="dateInput">
          <el-date-picker v-model="queryDate"
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
          <span>兑换记录</span>
        </div>
        <el-table :data="tableData"
                  stripe
                  :empty-text="loadingText">
          <el-table-column type="index"
                           width="60px">
            <template slot-scope="scope">
              <span>
                {{scope.$index+(currentPage - 1) * pageSize + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="number"
                           label="兑换人ID"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="record_time"
                           label="兑换时间"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="exchange_score"
                           label="本次兑换积分"
                           show-overflow-tooltip>
          </el-table-column>
          <!--<el-table-column prop="exeGoldNum"
                           label="兑换金币数量"
                           show-overflow-tooltip>
          </el-table-column>-->
          <el-table-column prop="remain_score"
                           label="剩余积分"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="remain_money"
                           label="剩余金币"
                           show-overflow-tooltip>
          </el-table-column>
          <!--<el-table-column prop="redemptionRatio"
                           label="兑换比例"
                           show-overflow-tooltip>
          </el-table-column>-->
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
  name: 'exchangeList',
  components: { Pagination },
  data() {
    return {
      // 表格数据
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loadingText: '数据加载中...',
      queryDate: '',
      query_number: '',
      time_begin: null,

    };
  },
  created() {
    this.tableDataList(this.getParams());
  },
  methods: {
    // 列表数据
    tableDataList(param) {
      this.tableData = [];
      this.$axios.postFormData(this.API.POINT_REDEMPTION_API, param)
        .then((res) => {
          console.log(res.data);
          if (res.success == true) {
            this.total = res.data_total;
            if (res.data.length > 0) {
              this.tableData = res.data;
            } else {
              this.loadingText = '暂无数据';
            }
          } else {
            this.$message.error(res.message || '请求失败，请重试！');
            this.loadingText = '暂无数据';
            return false;
          }
        }).catch((error) => {
          console.log(error);
          this.loadingText = '暂无数据';
        });
    },
    // 查询
    query() {
      this.currentPage = 1;
      this.tableDataList(this.getParams());
    },
    // pageSize/currentPage改变事件
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.tableDataList(this.getParams());
    },
    // 清空查询输入框
    clearInput() {
      this.query_number = '';
      this.queryDate = '';
      this.time_begin = null;
      this.time_end = null;
      this.currentPage = 1;
      this.tableDataList(this.getParams());
    },
    // 获取查询参数
    getParams() {
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token'),
        page: this.currentPage - 1,
        query_number: this.query_number.replace(/\s+/g, ''),
      };
      let startDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
      let endDate = new Date();
      param.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', startDate);
      param.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', endDate);

      if (this.time_begin != null && this.time_end != null) {
        param.time_begin = this.time_begin;
        param.time_end = this.time_end;
      }
      return param;
    },
    // 日期改变事件
    setQueryDate() {
      this.time_begin = null;
      this.time_end = null;
      if (this.queryDate != null) {
        this.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.queryDate[0]);
        this.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.queryDate[1]);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.exchangeList {
  .demo-ruleForm {
    text-align: left;
    padding: 10px;
    .el-form-item {
      padding-right: 20px;
    }
  }
}
</style>
<style lang="scss">
.exchangeList {
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
