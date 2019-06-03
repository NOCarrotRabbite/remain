<template>
  <div class="systemMail">
    <el-card class="box-card cardPadding">
      <div slot="header"
           class="clearfix">
        <span>操作查询</span>
      </div>
      <el-form :inline="true"
               class="demo-ruleForm seachInput">
        <el-form-item label="生成时间："
                      class="dateInput">
          <el-date-picker v-model="timeVal"
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
          <span>系统邮件列表</span>
          <el-button @click="addMail"
                     type="success">新增邮件</el-button>
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
          <el-table-column prop="create_time"
                           label="发送时间"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="receiver"
                           label="用户ID"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="attachment"
                           label="邮件金币数量"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="content"
                           label="邮件内容"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="status"
                           label="状态"
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
    <!-- 新增邮件弹框 -->
    <el-dialog title="发送邮件"
               @close="cancel"
               :visible.sync="dialogVisible">
      <el-form :model="detailsData"
               label-width="100px"
               class="demo-form mailInput">
        <el-form-item label="用户ID：">
          <el-input v-model="detailsData.receivers"
                    placeholder="请输入用户ID"></el-input>
          <el-button @click="checkAllPlayer"
                     class="checkBtn">全选全部玩家</el-button>
        </el-form-item>
        <el-form-item label="金币数量：">
          <el-input v-model="detailsData.attachment "
                    placeholder="请输入金币数量"></el-input>
        </el-form-item>
        <el-form-item label="邮件内容：">
          <el-input v-model="detailsData.content"
                    type="textarea"
                    rows="4"
                    placeholder="请输入邮件内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="affirmAddMail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

export default {
  name: 'SystemMail',
  components: { Pagination },
  data() {
    return {
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      // 表单数据
      timeVal: '',
      tableData: [],
      dialogVisible: false,
      detailsData: {
        receivers: '',
        attachment: '',
        content: ''
      },
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loadingText: '数据加载中...',
      time_begin: null,
      time_end: null,
    };
  },
  created() {
    this.tableDataList();
  },
  methods: {
    // 列表数据
    tableDataList() {
      this.tableData = [];
      if (!this.isSeach) {
        this.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', new Date(new Date().getTime() - 3 * 60 * 60 * 1000 * 24));
        this.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', new Date());
      }
      let obj = {
        account: this.account,
        login_token: this.login_token,
        time_begin: this.time_begin,
        time_end: this.time_end,
        page: this.currentPage - 1
      };
      this.$axios.postFormData(this.API.SYSTEMMAILLIST_API, obj)
        .then((res) => {
          if (res.success == true) {
            this.total = res.data_total;
            if (res.data.length > 0) {
              res.data.forEach((item) => {
                item.status == 0 ? item.status = '未领取' : item.status = '已领取';
              });
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
    // 查询
    query() {
      if (this.timeVal) {
        this.isSeach = true;
      }
      this.currentPage = 1;
      this.tableDataList();
    },
    // 日期改变事件
    setQueryDate() {
      if (this.timeVal) {
        this.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.timeVal[0]);
        this.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.timeVal[1]);
      } else {
        this.isSeach = false;
        this.tableDataList();
      }
    },
    // 新增邮件
    addMail() {
      this.dialogVisible = true;
    },
    // 确认新增邮件
    affirmAddMail() {
      let obj = {
        account: this.account,
        login_token: this.login_token,
        receivers: this.detailsData.receivers == '全部' ? '' : this.detailsData.receivers,
        content: this.detailsData.content,
        attachment: this.detailsData.attachment
      };
      this.$axios.postFormData(this.API.ADDSYSTEMMAIL_API, obj)
        .then((res) => {
          if (res.success == true) {
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.dialogVisible = false;
            this.currentPage = 1;
            this.tableDataList();
          } else {
            this.$message.error(res.message || '请求失败，请重试！');
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 取消新增邮件
    cancel() {
      this.detailsData = {
        receivers: '',
        attachment: '',
        content: ''
      };
      this.dialogVisible = false;
    },
    // 全选全部玩家
    checkAllPlayer() {
      this.detailsData.receivers = '全部';
    },
    // pageSize/currentPage改变事件
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.tableDataList();
    },
    // 清空查询输入框
    clearInput() {
      this.isSeach = false;
      this.timeVal = '';
      this.currentPage = 1;
      this.tableDataList();
    }
  }
};
</script>
<style lang="scss" scoped>
.systemMail {
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
.systemMail {
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
  .el-dialog {
    .el-dialog__header {
      display: flex;
    }
    .el-dialog__body {
      padding: 20px 50px 20px 20px;
    }
    .el-form {
      font-size: 0;
      .el-form-item__content {
        display: flex;
        align-items: center;
        .checkBtn {
          height: 28px;
          margin-left: 10px;
          color: #fff;
          background-color: #409eff;
          border-color: #409eff;
        }
      }
      .el-form-item {
        padding: 0 0 20px 0;
      }
    }
  }
  .mailInput {
    .el-form-item {
      margin: 0;
      padding: 20px 0;
      input {
        border: 1px solid #e4e6eb;
        border-radius: 4px;
        height: 30px;
      }
    }
  }
}
</style>
