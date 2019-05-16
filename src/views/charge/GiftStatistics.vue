<template>
  <div class="giftStatistics">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>充值数据</span>
        <el-button @click="backLast" type="primary">返回</el-button>
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
        <el-table-column prop="sender"
                         label="赠送人ID"
                         show-overflow-tooltip
                         align="center">
        </el-table-column>
        <el-table-column prop="receiver"
                         label="接受人ID"
                         show-overflow-tooltip
                         align="center">
        </el-table-column>
        <el-table-column prop="transfer_count"
                         label="赠送次数"
                         show-overflow-tooltip
                         align="center">
        </el-table-column>
        <el-table-column prop="transfer_sum"
                         label="合计"
                         show-overflow-tooltip
                         align="center">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'giftStatistics',
  data() {
    return {
      tableData: [
        {
          sender: 123,
          receiver: 456,
          transfer_count: 5,
          transfer_sum: 100000
        }
      ],
      loadingText: '数据加载中...',
      currentPage: 1,
      pageSize: 10,
    };
  },
  created() {
    /* this.tableDataList(this.getParams()); */
  },
  methods: {
    // 列表数据
    tableDataList(param) {
      this.tableData = [];
      this.$axios.postFormData(this.API.GIFT_RECORDS_API, param)
        .then((res) => {
          if (res.success === true) {
            this.loadingText = '数据加载中...';
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
        login_token: localStorage.getItem('currentUser_token')
      };
      return param;
    },
    // 返回上一级路由
    backLast() {
      this.$router.push({ path: './gift_records' });
    }

  }
};
</script>
<style lang="scss" scoped>
</style>
