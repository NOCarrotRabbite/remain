<template>
  <div class="systemMail">
    <el-card class="box-card cardPadding">
      <div slot="header"
           class="clearfix">
        <span>操作查询</span>
      </div>
      <el-form :inline="true"
               class="demo-ruleForm seachInput">
        <el-form-item label="玩家ID：">
          <el-input v-model="query_number"
                    @clear="clearInput"
                    clearable
                    placeholder="请输入玩家ID"></el-input>
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
          <span>玩家排行数据</span>
        </div>
        <el-table :data="tableData"
                  stripe
                  :empty-text="loadingText"
                  :header-cell-style="headerCellStyle"
                  :default-sort="{prop: 'sum', order: 'descending'}"
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
          <el-table-column prop="count"
                           label="历史游戏次数"
                           show-overflow-tooltip
                           :sort-orders="sortOrders"
                           sortable="custom">
          </el-table-column>
          <el-table-column prop="sum"
                           label="历史输赢金币"
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
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

export default {
  name: 'SystemMail',
  components: { Pagination },
  data() {
    return {
      query_number: '',
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      order: 2,
      asc: 0,
      highLight: 3,
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
      this.$axios.postFormData(this.API.WIN_LOSE_RANK_API, param)
        .then((res) => {
          if (res.success === true) {
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
    // 表头高亮列
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == this.highLight) {
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
      this.query_number = '';
      this.currentPage = 1;
      this.tableDataList(this.getParams());
    },
    // 获取查询参数
    getParams() {
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token'),
        query_number: this.query_number,
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
    // 表格排序回调事件
    sortDynamic(column) {
      let map = new Map();
      map.set('count', 1);
      map.set('sum', 2);
      map.set('ascending', 1);
      map.set('descending', 0);
      this.highLight = map.get(column.prop) + 1;
      this.order = map.get(column.prop);
      this.asc = map.get(column.order);
      this.tableDataList(this.getParams());
    },
    query() {
      this.currentPage = 1;
      this.tableDataList(this.getParams());
    }
  }
};
</script>
<style lang="scss" scoped>
.systemMail {
  .demo-ruleForm {
    text-align: left;
    padding: 10px;
  }
}
</style>
