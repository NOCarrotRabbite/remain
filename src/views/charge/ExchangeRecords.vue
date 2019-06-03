<template>
  <div class="exchangeRecords">
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
                    placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="充值时间："
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
          <span>充值数据</span>
          <el-radio-group v-model="status"
                          size="mini"
                          @change="toggleStatus">
            <el-radio-button label="已处理"></el-radio-button>
            <el-radio-button label="待审核"></el-radio-button>
          </el-radio-group>
        </div>
        <el-table :data="tableData"
                  :cell-style="cellStyle"
                  stripe
                  :empty-text="loadingText">
          <el-table-column type="index"
                           width="60px">
            <template slot-scope="scope">
              <span>{{scope.$index+(currentPage - 1) * pageSize + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="record_time"
                           label="兑换时间"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="number"
                           label="玩家ID"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="id"
                           label="兑换ID"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="account"
                           label="兑换账户账号"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="name"
                           label="兑换账户昵称"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="manager"
                           label="处理人"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="mode"
                           label="兑换类型"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="amount"
                           label="到账金额"
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
  name: 'ExchangeRecords',
  components: { Pagination },
  data() {
    return {
      tableData: [],
      value13: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      queryDate: '',
      query_number: '',
      time_begin: null,
      time_end: null,
      status: '已处理',
      loadingText: '数据加载中...'
    };
  },
  created() {
    this.tableDataList(this.getParams());
  },
  methods: {
    // 列表数据
    tableDataList(param) {
      this.tableData = [];
      this.$axios.postFormData(this.API.EXECHANGE_RECORDS_API, param)
        .then((res) => {
          if (res.success == true) {
            this.total = res.data_total;
            if (res.data.length > 0) {
              this.tableData = res.data;
            } else {
              this.loadingText = '暂无数据';
            }
          } else {
            this.$message.error(res.message || '请求失败，请重试！');
          }
        });
    },
    // 查询
    query() {
      this.currentPage = 1;
      this.tableDataList(this.getParams());
    },
    // 高亮列
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 6 || columnIndex === 7) { // 指定坐标
        return 'color: rgba(0, 153, 51, 0.7);';
      } else if (columnIndex === 8) {
        return 'color: rgb(236, 85, 98);';
      }
      return '';
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
      let map = new Map();
      map.set('已处理', 1);
      map.set('待审核', 2);
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token'),
        page: this.currentPage - 1,
        query_number: this.query_number.replace(/\s+/g, ''),
        query_status: map.get(this.status)
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
    },
    // 状态下拉列表切换数据
    toggleStatus() {
      this.tableDataList(this.getParams());
    }
  }
};
</script>
<style lang="scss" scoped>
.exchangeRecords {
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
  select {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    background-color: #409eff;
    color: #fff;
    padding: 4px 10px;
    border-radius: 2px;
  }
  option {
    background-color: #fff;
    color: #409eff;
  }
}
</style>
<style lang="scss">
.exchangeRecords {
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
