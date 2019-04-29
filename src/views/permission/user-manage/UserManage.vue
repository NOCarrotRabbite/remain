<template>
  <div class="userManageBox">
    <div class="userManage"
         v-if="viewShow">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>成员列表</span>
          <div class="btn">
            <el-button @click="addUser"
                       type="success">新增用户</el-button>
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
            <!-- <template slot-scope="scope">
              <span>
                {{scope.$index+(currentPage - 1) * pageSize + 1 }}</span>
            </template> -->
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
          <el-table-column prop="locked"
                           :formatter='formatter'
                           label="成员状态"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="login_count"
                           label="登录次数"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="login_ip"
                           label="登陆IP"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="login_time"
                           label="最近登录时间"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作"
                           width="280px"
                           :formatter='formatter'
                           align="center">
            <template slot-scope="scope">
              <el-button class="borderBtn"
                         type="primary"
                         @click="enableBtn(scope.row)">{{scope.row.locked == 1? '解封账号' : '封禁账号'}}</el-button>
              <el-button @click="delUser(scope.row)"
                         type="danger">删除账号</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <Pagination :total="total"
                    :currentPage="currentPage"
                    :pageSize="pageSize"
                    @currentPage="handleChange"
                    @sizeChange="handleChange" /> -->
      </el-card>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

export default {
  name: 'UserManage',
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
    this.tableDataList();
  },
  methods: {
    // 判断用户的状态
    formatter(row, column) {
      return row.locked == 1 ? '封禁' : '未封禁';
    },
    // 列表数据
    tableDataList() {
      this.tableData = [];
      let obj = {
        account: this.account,
        login_token: this.login_token
      };
      this.$axios.postFormData(this.API.USERLIST_API, obj)
        .then((res) => {
          if (res.success == true) {
            if (res.data.length > 0) {
              this.tableData = res.data;
              // this.total = res.data_total;
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
    // 新增用户
    addUser() {
      this.$router.push('./AddUser');
    },
    // 删除账号
    delUser(row) {
      this.$confirm('您确定删除选中的用户吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: '',
        center: true
      }).then(() => {
        let obj = {
          account: this.account,
          login_token: this.login_token,
          manager_account: row.account
        };
        // 确定删除后调用删除接口
        this.$axios.postFormData(this.API.DELMANAGER_API, obj)
          .then((res) => {
            if (res.success == true) {
              this.$message({
                message: res.message,
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
    // 封禁/解封管理员
    enableBtn(row) {
      this.$confirm('您确定' + (row.locked == 0 ? '封禁' : '解封') + '选中的用户吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: '',
        center: true
      }).then(() => {
        let obj = {
          account: this.account,
          login_token: this.login_token,
          manager_account: row.account,
          locked: row.locked == 0 ? 1 : 0
        };
        // 确定冻结后调用冻结接口
        this.$axios.postFormData(this.API.SETMANAGERLOCKED_API, obj)
          .then((res) => {
            // 点击按钮返回成功时改变状态显示
            if (res.success == true) {
              this.$message({
                message: (row.locked == 0 ? '封禁' : '解封') + '用户成功！',
                type: 'success'
              });
              // 删除后刷新列表数据
              this.tableDataList();
            } else {
              this.$message.error((row.locked == 0 ? '封禁' : '解封') + '用户失败！');
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
  computed: {
    // 控制二级路由页面的显示和隐藏
    viewShow() {
      if (this.$route.path.split('/').reverse()[0] === 'AddUser') {
        return false;
      }
      return true;
    }
  },
  watch: {
    // 如果路由有变化，刷新数据
    $route: 'tableDataList'
  }
};
</script>
<style lang="scss" scoped>
.userManageBox {
  height: calc(100% - 50px);
  .el-card {
    padding-bottom: 44px;
  }
}
</style>
