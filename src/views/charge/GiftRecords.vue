<template>
  <div>
    <div class="exchangeRecords"
         v-if="viewShow">
      <el-card class="box-card cardPadding">
        <div slot="header"
             class="clearfix">
          <span>操作查询</span>
        </div>
        <el-form :inline="true"
                 :model="formInline"
                 class="demo-ruleForm seachInput">
          <el-form-item label="赠送人ID：">
            <el-input v-model="formInline.giftId"
                      clearable
                      @clear="clear"
                      placeholder="请输入赠送人ID"
                      @change="banedOther"
                      :disabled="giftBan"
                      id="gift-id"></el-input>
          </el-form-item>
          <el-form-item label="接受人ID：">
            <el-input v-model="formInline.acceptId"
                      clearable
                      @clear="clear"
                      placeholder="请输入接受人ID"
                      @change="banedOther"
                      :disabled="acceptBan"
                      id="accept-id"></el-input>
          </el-form-item>
          <el-form-item label="赠送时间："
                        class="dateInput">
            <el-date-picker v-model="formInline.queryDate"
                            type="daterange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']"
                            @change="setQueryDate">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       class="btnQuery"
                       @click="queryData">查询</el-button>
            <el-button @click="clearInput"
                       class="btnQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>充值数据</span>
          </div>
          <el-table :data="tableData"
                    :cell-style="cellStyle"
                    stripe
                    :empty-text="loadingText"
                    :header-cell-style="headerCellStyle">
            <el-table-column type="index"
                             width="60px">
              <template slot-scope="scope">
                <span>
                  {{scope.$index+(currentPage - 1) * pageSize + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="record_time"
                             label="赠送时间"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="sender"
                             label="赠送人ID"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="transfer_money"
                             label="赠送金额"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="receiver"
                             label="接受人ID"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="transfer_money_tax"
                             label="实际领取金额"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作"
                             width="100px"
                             show-overflow-tooltip
                             align="center">
              <template slot-scope="scope">
                <el-button type="success"
                           @click="giftStatistic(scope.row, 1)">统计</el-button>
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
    <router-view></router-view>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

export default {
  name: 'ExchangeRecords',
  components: { Pagination },
  data() {
    return {
      // 表单数据
      formInline: {
        giftId: '',
        acceptId: '',
        queryDate: ''
      },
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      time_begin: null,
      time_end: null,
      loadingText: '数据加载中...',
      giftBan: false,
      acceptBan: false
    };
  },
  created() {
    this.tableDataList(this.getParams());
  },
  methods: {
    // 列表数据
    tableDataList(param) {
      this.tableData = [];
      this.$axios.postFormData(this.API.GIFT_RECORDS_API, param)
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
    // 高亮列
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 5) {
        return 'color: rgb(236, 85, 98);';
      }
      return '';
    },
    // 表头高亮列
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2 || columnIndex === 4) {
        return 'color:rgba(0, 153, 51, 0.7);';
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
      this.formInline.query_number = '';
      this.formInline.queryDate = '';
      this.formInline.acceptId = '';
      this.formInline.giftId = '';
      this.time_begin = null;
      this.time_end = null;
      this.currentPage = 1;
      this.tableDataList(this.getParams());
    },
    clear() {
      this.currentPage = 1;
      this.tableDataList(this.getParams());
    },
    // 获取查询参数
    getParams() {
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token'),
        query_number: this.formInline.giftId ? this.formInline.giftId.replace(/\s+/g, '') : this.formInline.acceptId.replace(/\s+/g, ''),
        page: this.currentPage - 1
      };
      if (this.time_begin != null && this.time_end != null) {
        param.time_begin = this.time_begin;
        param.time_end = this.time_end;
      } else {
        let startDate = new Date(new Date().getTime() - 4 * 7 * 24 * 60 * 60 * 1000);
        let endDate = new Date();
        param.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', startDate);
        param.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', endDate);
      }
      return param;
    },
    // 日期改变事件
    setQueryDate() {
      if (this.formInline.queryDate != null) {
        this.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.formInline.queryDate[0]);
        this.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.formInline.queryDate[1]);
      } else {
        this.time_begin = null;
        this.time_end = null;
      }
      // this.tableDataList(this.getParams());
    },
    // 查询事件
    queryData() {
      this.currentPage = 1;
      this.tableDataList(this.getParams());
    },
    banedOther() {
      if (this.formInline.giftId) {
        this.acceptBan = true;
      } else {
        this.acceptBan = false;
      }
      if (this.formInline.acceptId) {
        this.giftBan = true;
      } else {
        this.giftBan = false;
      }
    },
    // 赠送统计方法
    giftStatistic(row) {
      this.$router.push({ path: './gift_statistics', query: { row } });
    }
  },
  computed: {
    // 控制二级路由页面的显示和隐藏
    viewShow() {
      if (this.$route.path.split('/').reverse()[0] === 'gift_statistics') {
        return false;
      }
      return true;
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
