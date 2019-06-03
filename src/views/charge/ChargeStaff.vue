<template>
  <div class="systemCustomerService">
    <div class="userManage"
         v-if="viewShow">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>系统充值人员列表</span>
          <el-button @click="addChargeStaff"
                     type="success">新增充值人员</el-button>
        </div>
        <el-table ref="multipleTable"
                  :data="tableData"
                  tooltip-effect="dark"
                  stripe
                  :empty-text="loadingText">
          <el-table-column type="index"
                           width="60px">
            <template slot-scope="scope">
              <span>
                {{scope.$index+(currentPage - 1) * pageSize + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name"
                           label="充值人员名称"
                           align="center"
                           v-model="detailsData.name"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="contact"
                           label="充值人员联系方式"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作"
                           width="200px"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="delUser(scope.row)"
                         type="danger">删除充值人员</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <router-view></router-view>
    <!-- 客服修改弹框 -->
    <el-dialog title="新增充值人员"
               :visible.sync="dialogVisible">
      <el-form :model="detailsData"
               label-width="100px"
               class="demo-form seachInput">
        <el-form-item label="名称：">
          <el-input v-model="detailsData.name"
                    placeholder="请输入充值人员名称"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：">
          <el-input v-model="detailsData.contact"
                    placeholder="请输入充值人员联系方式"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCharge">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

export default {
  name: 'SystemCustomerService',
  components: { Pagination },
  data() {
    return {
      tableData: null,
      viewShow: true,
      dialogVisible: false,
      detailsData: {
        name: '',
        contact: ''
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
        login_token: localStorage.getItem('currentUser_token'),
      };
      this.$axios.postFormData(this.API.CHARGE_STAFF_API, param)
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
        }).catch((error) => {
          console.log(error);
        });
    },
    // 新增充值人员
    addChargeStaff() {
      this.dialogVisible = true;
    },
    // 确定新增充值人员
    addCharge() {
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token'),
        name: this.detailsData.name,
        contact: this.detailsData.contact
      };
      this.$axios.postFormData(this.API.ADD_CHARGE_STAFF_API, param)
        .then((res) => {
          if (res.success == true) {
            this.dialogVisible = false;
            this.tableDataList();
            this.$message.success(res.message || '保存成功！');
          } else {
            this.$message.error(res.message || '保存失败，请重试！');
          }
        }).catch((error) => {
          console.log(error);
        });
    },
    // 删除系统充值人员
    delUser(data) {
      this.$confirm('您确定删除此充值人员吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: '',
        center: true
      }).then(() => {
        let param = {
          account: localStorage.getItem('currentUser_name'),
          login_token: localStorage.getItem('currentUser_token'),
          name: data.name,
        };
        this.$axios.postFormData(this.API.DELETE_CHARGE_STAFF_API, param)
          .then((res) => {
            if (res.success == true) {
              this.$message.success(res.message || '删除成功！');
              this.tableDataList();
            } else {
              this.$message.error(res.message || '删除失败，请重试！');
            }
          });
      }).catch((error) => {
        console.log(error);
      });
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
.systemCustomerService {
  .el-card {
    padding-bottom: 44px;
  }
}
</style>
<style lang="scss">
.systemCustomerService {
  .el-dialog {
    .el-dialog__header {
      display: flex;
    }
    .el-dialog__body {
      padding: 20px 50px 20px 20px;
      display: flex;
      justify-content: center;
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
  }
}
</style>
