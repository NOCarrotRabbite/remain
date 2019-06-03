<template>
  <div class="SystemPramers">
    <div class="userManage"
         v-if="viewShow">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>系统参数列表</span>
          <div class="btn">
          </div>
        </div>
        <el-table ref="multipleTable"
                  :data="tableData"
                  stripe
                  :empty-text="loadingText"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column type="index"
                           width="60px">
            <!-- <template slot-scope="scope">
              <span>
                {{scope.$index+(currentPage - 1) * pageSize + 1 }}</span>
            </template> -->
          </el-table-column>
          <el-table-column prop="name"
                           label="名称"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="value"
                           label="内容"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="comment"
                           label="注释"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作"
                           width="200px"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="editParameter(scope.row)"
                         type="primary">修改系统参数</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <router-view></router-view>
    <!-- 参数修改弹框 -->
    <el-dialog title="修改系统参数"
               :visible.sync="dialogVisible">
      <el-form :model="detailsData"
               label-width="100px"
               class="demo-form">
        <!--  <el-form-item label="名称：">
          <el-input v-model="detailsData.name"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入名称"></el-input>
        </el-form-item> -->
        <el-form-item label="内容：">
          <el-input v-model="detailsData.value"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows:6}"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="affirmEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

export default {
  name: 'SystemPramers',
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
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token')
      };
      this.$axios.postFormData(this.API.SYSTEM_PARAM_API, param)
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
        }).catch((error) => {
          console.log(error);
        });
    },
    // 新增用户
    /* addUser() {
      this.dialogVisible = true;
    }, */
    // 修改系统参数
    editParameter(row) {
      this.detailsData = row;
      this.dialogVisible = true;
    },
    // 确认修改
    affirmEdit() {
      let obj = {
        account: this.account,
        login_token: this.login_token,
        name: this.detailsData.name,
        value: this.detailsData.value
      };
      this.$axios.postFormData(this.API.EDITSYSTEMPARA_API, obj)
        .then((res) => {
          if (res.success === true) {
            this.dialogVisible = false;
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.tableDataList();
          } else {
            this.$message.error(res.message || '修改失败，请重试！');
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 删除账号
    /* delUser() {
      this.$confirm('您确定删除选中的客服吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: '',
        center: true
      }).then(() => {
        // 确定删除后调用删除接口
        this.$axios.post(this.API.ADDEDIT_ROLE_API, this.multipleSelection)
          .then((res) => {
            if (res.data.status == true) {
              this.$message({
                message: '删除成功！',
                type: 'success'
              });
              // 删除后刷新列表数据
              this.roleListAll(this.name, this.size, this.current);
            } else {
              this.$message.error('删除失败！');
              return false;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }).catch(() => {

      });
    }, */
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
.SystemPramers {
  .el-card {
    padding-bottom: 44px;
  }
}
</style>
<style lang="scss">
.SystemPramers {
  .el-dialog {
    .el-dialog__header {
      display: flex;
    }
    .el-dialog__body {
      padding: 20px 50px 20px 20px;
      /*  display: flex;
      justify-content: center; */
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
          padding: 10px 0 0 0;
        }
      }
    }
  }
}
</style>
