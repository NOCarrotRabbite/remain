<template>
  <div class="LoginLog">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>登录日志</span>
      </div>
      <el-table ref="multipleTable"
                :data="tableData"
                stripe
                :empty-text="loadingText"
                tooltip-effect="dark"
                style="width: 100%">
        <el-table-column type="index">
          <template slot-scope="scope">
            <span>
              {{scope.$index+(currentPage - 1) * pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="role"
                         label="角色名称"
                         align="center"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="account"
                         label="成员账号"
                         align="center"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="login_ip"
                         label="登录IP"
                         align="center"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="record_time"
                         label="操作时间"
                         align="center"
                         show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </el-card>
    <Pagination :total="total"
                :currentPage="currentPage"
                :pageSize="pageSize"
                @currentPage="handleChange"
                @sizeChange="handleChange" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

export default {
  name: 'LoginLog',
  components: { Pagination },
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      loadingText: '数据加载中...'
    };
  },
  created() {
    this.tableDataList(this.account, this.login_token, this.currentPage);
  },
  methods: {
    // 列表数据
    tableDataList(name, token, currentPage) {
      this.tableData = [];
      let obj = {
        account: name,
        login_token: token,
        page: currentPage - 1
      };
      this.$axios.postFormData(this.API.LOGLIST_API, obj)
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
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.tableDataList(this.account, this.login_token, this.currentPage);
    }
  }
};
</script>
<style lang="scss" scoped>
.LoginLog {
  .el-card {
    padding-bottom: 44px;
  }
}
</style>
