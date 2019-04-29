<template>
  <div class="agentRank">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>商家排行数据</span>
      </div>
      <el-table :data="tableData"
                stripe
                :empty-text="loadingText"
                @sort-change="sortChange"
                :default-sort="{prop: 'recharge_count', order: 'descending'}"
                :header-cell-style="headerCellStyle">
        <el-table-column type="index"
                         width="60px">
          <template slot-scope="scope">
            <span>
              {{scope.$index+(currentPage - 1) * pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="number"
                         label="商家ID"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="recharge_count"
                         label="累计充值次数"
                         :sort-orders="sortOrders"
                         sortable='custom'
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="recharge_sum"
                         label="总计充值金额"
                         sortable='custom'
                         :sort-orders="sortOrders"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="exchange_count"
                         label="累计兑换次数"
                         sortable='custom'
                         :sort-orders="sortOrders"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="exchange_sum"
                         sortable='custom'
                         :sort-orders="sortOrders"
                         label="总计兑换金额"
                         show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <Pagination :total="total"
                  :currentPage="currentPage"
                  :pageSize="pageSize"
                  @currentPage="handleChange"
                  @sizeChange="handleChange" />
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

export default {
  name: 'AgentRank',
  components: { Pagination },
  data() {
    return {
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      // 表单数据
      formInline: {
        accountId: ''
      },
      tableData: [],
      value13: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      time_begin: null,
      time_end: null,
      order: 1,
      asc: 0,
      highLight: 1,
      sortOrders: ['descending', 'ascending'],
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
      this.$axios.postFormData(this.API.RANKAGEENT_API, param)
        .then((res) => {
          if (res.success == true) {
            if (res.data.length > 0) {
              this.tableData = res.data;
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
    // 获取查询参数
    getParams() {
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token'),
        page: this.currentPage - 1,
        order: this.order,
        asc: this.asc
      };
      let startDate = new Date(new Date().getTime() - 4 * 7 * 24 * 60 * 60 * 1000);
      let endDate = new Date();
      param.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', startDate);
      param.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', endDate);
      return param;
    },
    // 排序事件
    sortChange(column) {
      let map = new Map();
      map.set('recharge_count', 1);
      map.set('recharge_sum', 2);
      map.set('exchange_count', 3);
      map.set('exchange_sum', 4);
      map.set('ascending', 1);
      map.set('descending', 0);
      this.highLight = map.get(column.prop);
      this.order = map.get(column.prop);
      this.asc = map.get(column.order);
      this.tableDataList(this.getParams());
    },
    // 表头高亮列
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == this.highLight + 1) {
        return 'color:rgba(0, 153, 51, 0.7);';
      }
      return '';
    },
    // pageSize/currentPage改变事件
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
    },
    // 清空查询输入框
    clearInput() {
      this.formInline.accountId = '';
      this.currentPage = 1;
      this.tableDataList(this.getParams());
    }
  }
};
</script>
<style lang="scss" scoped>
.agentRank {
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
.agentRank {
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
            height: 28px;
          }
        }
      }
    }
  }
}
</style>
