<template>
  <div class="operationLog">
    <el-card class="box-card cardPadding">
      <div slot="header"
           class="clearfix">
        <span>操作查询</span>
      </div>
      <el-form :inline="true"
               :model="formInline"
               class="demo-ruleForm seachInput">
        <el-form-item label="日期："
                      class="dateInput">
          <el-date-picker v-model="formInline.queryDate"
                          type="daterange"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['00:00:00', '23:59:59']"
                          @change="setQueryDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="管理员账号：">
          <el-input v-model="formInline.administrator"
                    @clear="clear"
                    clearable
                    placeholder="请输入管理员账号"></el-input>
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
          <span>数据列表</span>
        </div>
        <el-table ref="multipleTable"
                  :data="tableData"
                  stripe
                  :empty-text="loadingText"
                  tooltip-effect="dark">
          <el-table-column type="index"
                           width="60px">
            <template slot-scope="scope">
              <span>
                {{scope.$index+(currentPage - 1) * pageSize + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="record_time"
                           label="操作时间"
                           align="center"
                           show-overflow-tooltip>
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
          <el-table-column prop="cmd"
                           label="操作命令"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="content"
                           label="操作记录"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-card>
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
  name: 'ActionLog',
  components: { Pagination },
  data() {
    return {
      tableData: [],
      total: 0,
      // 分页参数
      currentPage: 1,
      pageSize: 10,
      // 查询参数
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      time_begin: null,
      time_end: null,
      // 表单数据
      formInline: {
        queryDate: '',
        administrator: ''
      },
      isSeach: false,
      loadingText: '数据加载中...'
    };
  },
  created() {
    this.queryData();
  },
  methods: {
    // 获取列表数据
    queryData() {
      this.tableData = [];
      if (!this.isSeach || !this.formInline.queryDate) {
        this.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', new Date(new Date().getTime() - 3 * 60 * 60 * 1000 * 24));
        this.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', new Date());
      }
      let param = {
        account: this.account,
        login_token: this.login_token,
        page: this.currentPage - 1,
        query_account: this.formInline.administrator.replace(/\s+/g, ''),
        time_begin: this.time_begin,
        time_end: this.time_end
      };
      this.$axios.postFormData(this.API.ADMIN_ACTION_API, param)
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
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 分页查询
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.queryData();
    },
    // 查询
    query() {
      if (this.formInline.queryDate || this.formInline.administrator) {
        this.isSeach = true;
      }
      this.currentPage = 1;
      this.queryData();
    },
    // 日期改变事件
    setQueryDate() {
      if (this.formInline.queryDate) {
        this.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.formInline.queryDate[0]);
        this.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.formInline.queryDate[1]);
      } else {
        this.isSeach = false;
        this.queryData();
      }
    },
    // 清空查询输入框
    clearInput() {
      this.isSeach = false;
      this.formInline.administrator = '';
      this.formInline.queryDate = '';
      this.currentPage = 1;
      this.queryData();
    },
    clear() {
      this.currentPage = 1;
      this.queryData();
    }
  }
};
</script>
<style lang="scss" scoped>
.operationLog {
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
.operationLog {
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
