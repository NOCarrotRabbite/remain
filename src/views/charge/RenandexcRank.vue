<template>
  <div class="renandexcRank">
    <el-card class="box-card cardPadding">
      <div slot="header"
           class="clearfix">
        <span>充值排行数据</span>
      </div>
      <el-table :data="tableData"
                :cell-style="cellStyle"
                stripe
                :empty-text="loadingText"
                :header-cell-style="headerCellStyle"
                :default-sort="{prop: 'recharge_count', order: 'descending'}"
                @sort-change="sortDynamic">
        <el-table-column type="index"
                         width="60px">
          <template slot-scope="scope">
            <span>
              {{scope.$index+(currentPage - 1) * pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="number"
                         label="玩家ID"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="recharge_count"
                         label="累计充值次数"
                         show-overflow-tooltip
                         :sort-orders="sortOrders"
                         sortable="custom">
        </el-table-column>
        <el-table-column prop="recharge_sum"
                         label="总计充值金额"
                         show-overflow-tooltip
                         :sort-orders="sortOrders"
                         sortable="custom">
        </el-table-column>
        <el-table-column prop="exchange_count"
                         label="累计兑换次数"
                         show-overflow-tooltip
                         :sort-orders="sortOrders"
                         sortable="custom">
        </el-table-column>
        <el-table-column prop="exchange_sum"
                         label="总计兑换金额"
                         show-overflow-tooltip
                         :sort-orders="sortOrders"
                         sortable="custom">
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
  name: 'RenandexcRank',
  components: { Pagination },
  data() {
    return {
      gold: {
        x: 10000000000,
        y: 2000000000,
      },
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
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
      this.$axios.postFormData(this.API.PLAYER_CHARGE_RANK_API, param)
        .then((res) => {
          if (res.success === true) {
            if (res.data.length > 0) {
              this.tableData = res.data;
              this.total = res.data_total;
            } else {
              this.loadingText = '暂无数据';
            }
          } else {
            this.$message.error(res.message || '请求失败，请重试！');
          }
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
    // 高亮列
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 5 || columnIndex === 8) {
        return 'color: rgb(236, 85, 98);';
      }
      return '';
    },
    // 表头高亮列
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == this.highLight) {
        return 'color: rgba(0, 153, 51, 0.7);';
      }
      return '';
    },
    // pageSize/currentPage改变事件
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.tableDataList(this.getParams());
    },
    // 表格排序回调事件
    sortDynamic(column) {
      let map = new Map();
      map.set('recharge_count', 1);
      map.set('recharge_sum', 2);
      map.set('exchange_count', 3);
      map.set('exchange_sum', 4);
      map.set('ascending', 1);
      map.set('descending', 0);
      this.highLight = map.get(column.prop) + 1;
      this.order = map.get(column.prop);
      this.asc = map.get(column.order);
      this.$axios.postFormData(this.API.PLAYER_CHARGE_RANK_API, this.getParams())
        .then((res) => {
          if (res.success === true) {
            this.total = res.data_total;
            this.tableData = res.data;
          } else {
            this.$message.error(res.message || '请求失败，请重试！');
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.renandexcRank {
  .statisticsBox {
    padding: 20px;
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
        .title {
          padding-bottom: 20px;
          font-weight: 400;
        }
        p {
          color: #888;
          font-weight: bold;
          font-size: 0.8vw;
        }
      }
    }
  }
  .el-col {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
}
</style>
