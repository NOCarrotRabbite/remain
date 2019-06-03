<template>
  <div class="LoginLog">
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
          <span>用户登录日志</span>
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
          <el-table-column prop="nick"
                           label="用户昵称"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="alipay_account"
                           label="支付宝账号"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="alipay_name"
                           label="支付姓名"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="bankcard_account"
                           label="银行卡账号"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="bankcard_name"
                           label="银行卡姓名"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="bank_name"
                           label="银行名称"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="mobile"
                           label="联系方式"
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
  name: 'LoginLog',
  components: { Pagination },
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      query_number: '',
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
      this.$axios.postFormData(this.API.EXECHANGE_ACCOUNT_CONFIG_API, param)
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
    // 重置
    clearInput() {
      this.currentPage = 1;
      this.query_number = '';
      this.tableDataList(this.getParams());
    },
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.tableDataList(this.getParams());
    },
    // 获取查询参数
    getParams() {
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token'),
        query_number: this.query_number.replace(/\s+/g, ''),
        page: this.currentPage - 1
      };
      return param;
    }
  }
};
</script>
<style lang="scss" scoped>
.LoginLog {
  .el-card {
    padding-bottom: 44px;
    .el-form-item {
      padding-right: 20px;
    }
  }
}
</style>
