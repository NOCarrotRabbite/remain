<template>
  <div class="systemNotification">
    <div class="userManage"
         v-if="viewShow">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>系统公告列表</span>
          <div class="btn">
            <el-button @click="addNotice"
                       type="success">新增公告</el-button>
          </div>
        </div>
        <el-table ref="multipleTable"
                  :data="tableData"
                  stripe
                  :empty-text="loadingText"
                  tooltip-effect="dark"
                  @selection-change="handleSelectionChange">
          <el-table-column type="index"
                           width="60px">
            <template slot-scope="scope">
              <span>
                {{scope.$index+(currentPage - 1) * pageSize + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="content"
                           label="公告内容"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="create_time"
                           label="创建时间"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作"
                           width="200px"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="editNotice(scope.row)"
                         type="primary">修改公告</el-button>
              <el-button @click="delNotice(scope.row)"
                         type="danger">删除公告</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <router-view></router-view>
    <!-- 客服修改弹框 -->
    <el-dialog title="新增公告"
               :visible.sync="dialogVisible">
      <el-form :model="detailsData"
               label-width="100px"
               class="demo-form seachInput">
        <el-form-item label="公告内容：">
          <el-input v-model="detailsData.userId"
                    type="textarea"
                    rows="4"
                    placeholder="请输入公告内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addAffiche">确 定</el-button>
      </span>
    </el-dialog>
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
  name: 'SystemNotification',
  components: { Pagination },
  data() {
    return {
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      tableData: [],
      viewShow: true,
      dialogVisible: false,
      detailsData: {
        userId: ''
      },
      total: 0,
      currentPage: 1,
      pageSize: 10,
      isAdd: false,
      editRow: {},
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
      let obj = {
        account: this.account,
        login_token: this.login_token,
        page: this.currentPage - 1
      };
      this.$axios.postFormData(this.API.LISTNOTICE_API, obj)
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
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 新增公告
    addNotice() {
      this.dialogVisible = true;
      this.isAdd = true;
      this.detailsData.userId = '';
    },
    // 确认新增+修改公告
    addAffiche() {
      let objAdd = {
        account: this.account,
        login_token: this.login_token,
        content: this.detailsData.userId
      };
      let newDate = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', new Date());
      let objEdit = {
        account: this.account,
        login_token: this.login_token,
        id: this.editRow.id,
        create_time: this.isAdd ? this.create_time : newDate,
        content: this.detailsData.userId

      };
      let api = this.isAdd ? this.API.ADDNOTICE_API : this.API.MODIFYNOTICE_API;
      this.$axios.postFormData(api, this.isAdd ? objAdd : objEdit)
        .then((res) => {
          this.dialogVisible = false;
          if (res.success == true) {
            this.$message({
              message: this.isAdd ? '新增成功！' : '修改成功',
              type: 'success'
            });
            // 删除后刷新列表数据
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
    // 修改公告
    editNotice(row) {
      this.dialogVisible = true;
      this.isAdd = false;
      this.detailsData.userId = row.content;
      this.editRow = row;
    },
    // 删除公告
    delNotice(row) {
      this.$confirm('您确定删除选中的公告吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: '',
        center: true
      }).then(() => {
        let obj = {
          account: this.account,
          login_token: this.login_token,
          id: row.id,
          content: row.content
        };
        // 确定删除后调用删除接口
        this.$axios.postFormData(this.API.DELNOTICE_API, obj)
          .then((res) => {
            if (res.success == true) {
              this.$message({
                message: '删除成功！',
                type: 'success'
              });
              // 删除后刷新列表数据
              this.tableDataList();
            } else {
              this.$message.error(res.message);
              return false;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }).catch(() => {

      });
    },
    // 复选框选中内容
    handleSelectionChange(val) {
      console.log('val', val);
    },
    // pageSize/currentPage改变事件
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
    }
  },
  watch: {
    '$route.path': function (newVal, oldVal) {
      if (newVal === '/AddUser') {
        this.viewShow = false;
      } else {
        this.viewShow = true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.systemNotification {
  .el-card {
    padding-bottom: 44px;
  }
}
</style>
<style lang="scss">
.systemNotification {
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
      }
      .el-form-item {
        padding: 0 0 20px 0;
      }
    }
  }
}
</style>
