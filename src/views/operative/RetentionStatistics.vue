<template>
  <div class="retentionStatistics">
    <el-card class="box-card cardPadding">
      <div slot="header"
           class="clearfix">
        <span>操作查询</span>
      </div>
      <el-form :inline="true"
               class="demo-ruleForm seachInput">
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
          <span>留存数据</span>
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
          <el-table-column prop="stat_time"
                           label="首次计算日期"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="dru"
                           label="今日新增人数"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="second_day"
                           label="次日留存"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span>
                {{scope.row.second_day+' %'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="third_day"
                           label="2日留存"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span>
                {{scope.row.third_day+' %'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fourth_day"
                           label="3日留存"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span>
                {{scope.row.fourth_day+' %'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fifth_day"
                           label="4日留存"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span>
                {{scope.row.fifth_day+' %'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sixth_day"
                           label="5日留存"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span>
                {{scope.row.sixth_day+' %'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="seventh_day"
                           label="6日留存"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span>
                {{scope.row.seventh_day+' %'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="eighth_day"
                           label="7日留存"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span>
                {{scope.row.eighth_day+' %'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="twoweek_day"
                           label="14日留存"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span>
                {{scope.row.twoweek_day+' %'}}</span>
            </template>
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
  name: 'retentionStatistics',
  components: { Pagination },
  data() {
    return {
      // 表单数据
      queryDate: [],
      // 表格数据
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loadingText: '数据加载中...',
      // 请求时间参数
      time_begin: null,
      time_end: null
    };
  },
  created() {
    this.tableDataList(this.getParams());
  },
  methods: {
    // 列表数据
    tableDataList(formData) {
      this.tableData = [];
      this.$axios.postFormData(this.API.RETENTION_API, formData)
        .then((res) => {
          if (res.success === true) {
            if (res.data.length > 0) {
              console.log(res.data);
              this.tableData = res.data;
              this.total = res.data_total;
            } else {
              this.loadingText = '暂无数据';
            }
          } else {
            this.$message.error(res.message || '请求失败，请重试！');
            return false;
          }
        }).catch((error) => {
          console.log(error);
        });
    },
    // 获取默认查询参数
    getParams() {
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token'),
        page: this.currentPage - 1
      };
      let startDate = new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000);
      let endDate = new Date();
      param.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', startDate);
      param.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', endDate);
      if (this.time_begin != null && this.time_end != null) {
        param.time_begin = this.time_begin;
        param.time_end = this.time_end;
      }
      return param;
    },
    // pageSize/currentPage改变事件
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
    },
    // 清空查询输入框
    clearInput() {
      this.queryDate = '';
      this.time_begin = null;
      this.time_end = null;
      this.currentPage = 1;
      this.tableDataList(this.getParams());
    },
    // 日期改变事件
    setQueryDate() {
      this.time_begin = null;
      this.time_end = null;
      if (this.queryDate != null) {
        this.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.queryDate[0]);
        this.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.queryDate[1]);
      }
    },
    // 条件查询
    query() {
      this.currentPage = 1;
      this.tableDataList(this.getParams());
    }
  }
};
</script>
<style lang="scss" scoped>
.retentionStatistics {
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
.retentionStatistics {
  .demo-ruleForm {
    .dateInput {
      .el-range-editor.el-input__inner {
        width: 240px;
        height: 35px;
        padding: 0 10px;
        margin-top: 3px;
        input {
          width: 80px;
          height: 28px;
        }
      }
    }
  }
}
</style>
