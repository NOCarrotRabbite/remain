<template>
  <div class="userOperateLog">
    <el-card class="box-card cardPadding">
      <div slot="header"
           class="clearfix">
        <span>操作查询</span>
      </div>
      <el-form :inline="true"
               class="demo-ruleForm seachInput">
        <el-form-item label="用户ID：">
          <el-input v-model="query_number"
                    clearable
                    @clear="clearInput"
                    placeholder="请输入用户ID"></el-input>
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
          <span>用户操作日志</span>
        </div>
        <el-table :data="tableData"
                  stripe
                  :empty-text="loadingText">
          <el-table-column type="index"
                           width="60px">
            <template slot-scope="scope">
              <span>{{scope.$index+(currentPage - 1) * pageSize + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="number"
                           label="用户ID"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="record_time"
                           label="操作时间"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="cmd"
                           label="操作命令"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="content"
                           label="操作内容"
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
  name: 'UserOperateLog',
  components: { Pagination },
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      time_begin: null,
      time_end: null,
      query_number: '',
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
      this.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', new Date(new Date().getTime() - 3 * 60 * 60 * 1000 * 24));
      this.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', new Date());
      let obj = {
        account: this.account,
        login_token: this.login_token,
        time_begin: this.time_begin,
        time_end: this.time_end,
        query_number: this.query_number.replace(/\s+/g, ''),
        page: this.currentPage - 1
      };
      this.$axios.postFormData(this.API.USEROPERATELOG_API, obj)
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
      this.tableDataList();
    },
    // 重置
    clearInput() {
      this.currentPage = 1;
      this.query_number = '';
      this.tableDataList();
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
.userOperateLog {
  .el-card {
    padding-bottom: 44px;
    .el-form-item {
      padding-right: 20px;
    }
  }
}
</style>
