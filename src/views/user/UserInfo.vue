<template>
  <div class="userinfo">
    <el-card class="box-card cardPadding">
      <div slot="header"
           class="clearfix">
        <span>操作查询</span>
      </div>
      <el-form :inline="true"
               :model="formInline"
               class="demo-ruleForm seachInput">
        <el-form-item label="用户账号/ID：">
          <el-input v-model="formInline.accountId"
                    @clear="clearInput"
                    clearable
                    placeholder="请输入用户账号/ID"></el-input>
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
          <span>用户信息列表</span>
        </div>
        <el-table :data="tableData"
                  stripe
                  :empty-text="loadingText"
                  @cell-click="operation"
                  :cell-style="cellStyle">
          <el-table-column type="index"
                           width="60px"
                           align="center">
            <template slot-scope="scope">
              <span>
                {{scope.$index+(currentPage - 1) * pageSize+1}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column prop="client_sn"
                           label="用户账号"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>-->
          <el-table-column prop="number"
                           label="用户ID"
                           width="140px"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="nick"
                           label="用户昵称"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="type"
                           label="用户类型"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="is_online"
                           align="center"
                           label="状态"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="money"
                           label="当前金币总量"
                           width="140px"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="login_locked"
                           align="center"
                           label="登录封禁">
          </el-table-column>
          <el-table-column prop="exchange_locked"
                           align="center"
                           label="兑换封禁">
          </el-table-column>
          <el-table-column prop="playgame_locked"
                           align="center"
                           label="游戏封禁">
          </el-table-column>
          <el-table-column prop="transfer_locked"
                           align="center"
                           label="赠送封禁">
          </el-table-column>
          <el-table-column prop="mobile"
                           label="手机号"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="login_time"
                           label="登录时间"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="login_ip"
                           label="登录IP"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="reg_time"
                           label="注册时间"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="reg_ip"
                           label="注册IP"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="client_sn"
                           label="登录设备码"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="client_type"
                           label="登录机型"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作"
                           width="100px"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="editPassword(scope.row)"
                         type="primary">修改密码</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :total="total"
                    :currentPage="currentPage"
                    :pageSize="pageSize"
                    @currentPage="handleChange"
                    @sizeChange="handleChange" />
      </el-card>
    </el-card>
    <!-- 玩家详情弹框 -->
    <el-dialog title="用户详情"
               :visible.sync="dialogVisible">
      <el-form :model="detailsData"
               label-width="120px"
               class="demo-form-inline">
        <el-form-item label="用户ID：">
          <el-input v-model="detailsData.number"
                    readonly
                    placeholder="用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称：">
          <el-input v-model="detailsData.nick"
                    readonly
                    placeholder="用户昵称"></el-input>
        </el-form-item>
        <el-form-item label="用户身份：">
          <el-input v-model="detailsData.type"
                    readonly
                    placeholder="用户身份"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="detailsData.mobile"
                    readonly
                    placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item label="注册时间：">
          <el-input v-model="detailsData.reg_time"
                    readonly
                    placeholder="注册时间"></el-input>
        </el-form-item>
        <el-form-item label="注册IP：">
          <el-input v-model="detailsData.reg_ip"
                    readonly
                    placeholder="注册IP"></el-input>
        </el-form-item>
        <el-form-item label="登录时间：">
          <el-input v-model="detailsData.login_time"
                    readonly
                    placeholder="最后登录时间"></el-input>
        </el-form-item>
        <el-form-item label="登录IP：">
          <el-input v-model="detailsData.login_ip"
                    readonly
                    placeholder="最后登录IP"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改用户类型 -->
    <el-dialog title="提示"
               class="typeEdit"
               :visible.sync="centerDialogVisible"
               width="30%"
               center>
      <span>请选择用户类型：</span>
      <el-select v-model="userTypeValue"
                 placeholder="请选择">
        <el-option v-for="item in options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="affirmType">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

export default {
  name: 'Userinfo',
  components: { Pagination },
  data() {
    return {
      // 表单数据
      formInline: {
        accountId: ''
      },
      options: [
        {
          value: '玩家',
          label: '玩家'
        }, {
          value: '代理',
          label: '代理'
        }
      ],
      tableData: [],
      dialogVisible: false,
      // 玩家详情数据
      detailsData: {},
      total: 0,
      currentPage: 1,
      pageSize: 10,
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      query_number: '',
      loginVisible: false,
      centerDialogVisible: false,
      userTypeValue: '',
      typeID: '',
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
        query_number: this.formInline.accountId.replace(/\s+/g, ''),
        page: this.currentPage - 1
      };
      this.$axios.postFormData(this.API.USERMESSAGE_API, obj)
        .then((res) => {
          if (res.success == true) {
            // 判断是否有数据 改变loading文字
            if (res.data.length > 0) {
              res.data.forEach((items) => {
                items.exchange_locked = items.exchange_locked == 1 ? '封禁' : '未封禁';
                items.login_locked = items.login_locked == 1 ? '封禁' : '未封禁';
                items.is_online = items.is_online == 0 ? '离线' : '在线';
                items.playgame_locked = items.playgame_locked == 1 ? '封禁' : '未封禁';
                items.transfer_locked = items.transfer_locked == 1 ? '封禁' : '未封禁';
                if (items.type == 'player') {
                  items.type = '玩家';
                } else if (items.type == 'agent') {
                  items.type = '代理';
                }
              });
              this.tableData = res.data;
              this.total = res.data_total;
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
    // 查询
    query() {
      this.currentPage = 1;
      this.tableDataList();
    },
    // 清空查询输入框
    clearInput() {
      this.currentPage = 1;
      this.formInline.accountId = '';
      this.tableDataList();
    },
    // 用户账号字体颜色
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 3 || columnIndex === 5 || columnIndex === 6 || columnIndex === 7 || columnIndex === 8 || columnIndex === 9) { // 指定坐标
        return 'color: #0099cc;cursor: pointer;';
      }
      return '';
    },
    // 列表操作（带颜色字体）
    operation(row, column, cell, event) {
      this.detailsData = {};
      switch (column.label) {
        case '用户ID':
          this.detailsData = row;
          this.dialogVisible = true;
          break;
        /*   case '用户ID': */
        /* this.detailsData = row;
        this.dialogVisible = true; */
        /*  this.editID(row);
         break; */
        case '当前金币总量':
          this.editGold(row);
          break;
        case '用户类型':
          this.agency(row);
          break;
        case '登录封禁':
          this.lockedFuction(row, 'login');
          break;
        case '兑换封禁':
          this.lockedFuction(row, 'exchange');
          break;
        case '游戏封禁':
          this.lockedFuction(row, 'playgame');
          break;
        case '赠送封禁':
          this.lockedFuction(row, 'transfer');
          break;
        default:
          '';
      }
    },
    // 修改用户ID
    /* editID(row) {
      this.$prompt('请输入修改的用户ID:', '设置', {
        center: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'megBox',
        inputPlaceholder: '请输入修改的ID',
        inputPattern: /^[1-9][0-9]{7}$/,
        inputErrorMessage: '输入8位数字，第1位不能为0！',
        inputValidator: (val) => {
          if (val === null) {
            this.reg = true;
            return false;
          }
        }
      }).then(({ value }) => {
        let obj = {
          account: this.account,
          login_token: this.login_token,
          old_number: row.number,
          new_number: value
        };
        this.$axios.postFormData(this.API.SETUSERID_API, obj)
          .then((res) => {
            if (res.success == true) {
              this.$message({
                message: '用户ID修改成功！',
                type: 'success'
              });
              this.clearInput();
            } else {
              this.$message.error(res.message || '用户ID修改失败！');
              return false;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }).catch(() => {
      });
    }, */
    // 修改用户类型
    agency(row) {
      this.centerDialogVisible = true;
      this.userTypeValue = row.type;
      this.typeID = row.number;
    },
    // 确认修改用户类型
    affirmType() {
      let obj = {
        account: this.account,
        login_token: this.login_token,
        user_number: this.typeID,
        type: this.userTypeValue == '玩家' ? 'player' : 'agent'
      };
      this.$axios.postFormData(this.API.SETUSERTYPE_API, obj)
        .then((res) => {
          if (res.success == true) {
            this.centerDialogVisible = false;
            this.$message({
              message: '用户类型修改成功！',
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
    },
    // 修改金币
    editGold(row) {
      this.$prompt('请输入增减的金币:', '设置', {
        center: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'megBox',
        inputPlaceholder: '正数为增加，负数为减少！',
        /* inputPattern: /^[0-9]*$/, */
        inputErrorMessage: '请输入修改的金币（只能输入数字）！',
        inputValidator: (val) => {
          if (val === null) {
            this.reg = true;
            return false;
          }
        }
      }).then(({ value }) => {
        let obj = {
          account: this.account,
          login_token: this.login_token,
          user_number: row.number,
          increment: value
        };
        this.$axios.postFormData(this.API.SETMONEY_API, obj)
          .then((res) => {
            if (res.success == true) {
              this.$message({
                message: '金币修改成功！',
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
    // 修改密码
    editPassword(row) {
      this.$prompt('请输入修改的密码:', '设置', {
        center: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'megBox'
      }).then(({ value }) => {
        let obj = {
          account: this.account,
          login_token: this.login_token,
          user_number: row.number,
          login_pwd: value
        };
        this.$axios.postFormData(this.API.SETHUASRPWD_API, obj)
          .then((res) => {
            if (res.success == true) {
              this.$message({
                message: '密码修改成功！',
                type: 'success'
              });
              this.tableDataList();
            } else {
              this.$message.error('密码修改失败！');
              return false;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }).catch(() => {
      });
    },
    // pageSize/currentPage改变事件
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.tableDataList();
    },
    // 封禁公共方法
    lockedFuction(row, msg) {
      let state;
      if (msg == 'login') {
        state = row.login_locked;
      } else if (msg == 'exchange') {
        state = row.exchange_locked;
      } else if (msg == 'playgame') {
        state = row.playgame_locked;
      } else if (msg == 'transfer') {
        state = row.transfer_locked;
      }
      let obj = {
        account: this.account,
        login_token: this.login_token,
        user_number: row.number,
        target: msg,
        locked: state == '未封禁' ? 1 : 0,
      };
      this.$axios.postFormData(this.API.SETUSERLOCKED_API, obj)
        .then((res) => {
          if (res.success == true) {
            this.$message({
              message: (state == '封禁' ? '解封' : '封禁') + '成功！',
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
    }
  }
};
</script>
<style lang="scss" scoped>
.userinfo {
  .demo-ruleForm {
    text-align: left;
    padding: 10px;
    .el-form-item {
      padding-right: 20px;
    }
  }
}
</style>
<style lang="scss">
.userinfo {
  .el-dialog {
    .el-dialog__header {
      display: flex;
    }
    .el-dialog__body {
      padding: 20px 50px 20px 20px;
    }
    .el-form {
      font-size: 0;
      .el-form-item {
        width: 50%;
        display: inline-block;
        .el-input__inner {
          height: 30px;
        }
      }
    }
  }
  .typeEdit {
    display: flex;
    align-items: center;
    .el-dialog {
      width: 420px !important;
      border-radius: 4px;
      .el-dialog__header {
        border-radius: 4px;
      }
      .el-dialog__title {
        margin: 0 auto;
        font-size: 18px;
      }
      .el-input__inner {
        height: 30px;
      }
      .el-input__icon {
        line-height: 30px;
      }
    }
  }
}
</style>
