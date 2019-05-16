<template>
  <div>
    <div class="PermissionManage" v-if="viewShow">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>角色列表</span>
          <div>
            <el-button @click="addRole"
                       type="success">新增角色</el-button>
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
          <el-table-column prop="id"
                           label="角色ID"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="name"
                           label="角色名称"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="管理"
                           align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.name != '超级管理员'">
                <el-button type="text"
                           @click="handClick(scope.row)">点击配置权限</el-button>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="remark"
                           label="备注"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作"
                           width="200px"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="delRole(scope.row)"
                         type="danger">删除角色</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 新增角色 -->
      <el-dialog title="发送邮件"
                 @close="cancel"
                 :visible.sync="dialogVisible">
        <el-form :model="detailsData"
                 label-width="100px"
                 class="demo-form mailInput">
          <el-form-item label="角色名称：">
            <el-input v-model="detailsData.role"
                      placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色描述：">
            <el-input v-model="detailsData.remark"
                      type="textarea"
                      rows="4"
                      placeholder="请输入角色描述"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="affirmAddRole">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

export default {
  name: 'PermissionManage',
  components: { Pagination },
  data() {
    return {
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      tableData: [],
      multipleSelection: [],
      loadingText: '数据加载中...',
      dialogVisible: false,
      detailsData: {
        role: '',
        remark: ''
      }
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
        login_token: this.login_token
      };
      this.$axios.postFormData(this.API.LIST_ROLE_API, obj)
        .then((res) => {
          if (res.success === true) {
            this.loadingText = '数据加载中...';
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
    // 新增角色
    addRole() {
      this.dialogVisible = true;
    },
    // 确认新增
    affirmAddRole() {
      let obj = {
        account: this.account,
        login_token: this.login_token,
        role: this.detailsData.role,
        remark: this.detailsData.remark,
      };
      this.$axios.postFormData(this.API.ADD_ROLE_API, obj)
        .then((res) => {
          if (res.success === true) {
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.dialogVisible = false;
            this.tableDataList();
          } else {
            this.$message.error(res.message);
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 删除角色
    delRole(row) {
      this.$confirm('您确定删除选中的角色吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnHashChange: true,
        type: '',
        center: true,
      }).then(() => {
        // 确定删除后调用删除接口
        let obj = {
          account: this.account,
          login_token: this.login_token,
          role: row.name
        };
        this.$axios.postFormData(this.API.DEL_ROLE_API, obj)
          .then((res) => {
            if (res.success === true) {
              this.$message({
                message: res.message,
                type: 'success'
              });
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
    // 关闭新增弹框
    cancel() {
      this.detailsData = {
        role: '',
        remark: ''
      };
    },
    // 配置权限按钮
    handClick(row) {
      this.$router.push({ path: './AddRole', query: { row } });
    },
    // 选择框选中内容
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
  computed: {
    // 控制二级路由页面的显示和隐藏
    viewShow() {
      if (this.$route.path.split('/').reverse()[0] === 'AddRole') {
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
.PermissionManage {
  .el-card {
    padding-bottom: 44px;
  }
}
</style>
