<template>
  <div class="onlineUser">
    <el-card class="box-card cardPadding">
      <div slot="header"
           class="clearfix">
        <span>操作查询</span>
      </div>
      <el-form :inline="true"
               :model="formInline"
               class="demo-ruleForm seachInput">
        <el-form-item label="用户ID：">
          <el-input v-model="formInline.accountId"
                    @clear="clearInput"
                    clearable
                    placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <!--  <el-form-item label="游戏：">
          <el-select v-model="formInline.game"
                     placeholder="请选择游戏类型">
            <el-option :label="items.name"
                       v-for="items in gameData"
                       :key="items.id"
                       :value="items.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间：">
          <el-select v-model="formInline.room"
                     placeholder="请选择房间">
            <el-option :label="items.name"
                       v-for="items in roomData"
                       :key="items.id"
                       :value="items.id"></el-option>
          </el-select>
        </el-form-item> -->
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
          <span>在线用户列表</span>
        </div>
        <el-table :data="tableData"
                  stripe
                  :empty-text="loadingText"
                  @cell-click="playerDetails"
                  :cell-style="cellStyle">
          <el-table-column type="index"
                           width="60px">
            <template slot-scope="scope">
              <span>{{scope.$index+(currentPage - 1) * pageSize + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="nick"
                           label="用户昵称"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="number"
                           label="用户ID"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="money"
                           label="金币"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="mobile"
                           label="手机"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="type"
                           label="用户类型"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="login_ip"
                           label="登录IP"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="login_time"
                           label="最后登录时间"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="reg_ip"
                           label="注册IP"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="reg_time"
                           label="注册时间"
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
        <el-form-item label="用户金币：">
          <el-input v-model="detailsData.money"
                    readonly
                    placeholder="金币"></el-input>
        </el-form-item>
        <el-form-item label="注册IP：">
          <el-input v-model="detailsData.reg_ip"
                    readonly
                    placeholder="注册IP"></el-input>
        </el-form-item>
        <el-form-item label="注册时间：">
          <el-input v-model="detailsData.reg_time"
                    readonly
                    placeholder="注册时间"></el-input>
        </el-form-item>
        <el-form-item label="最后登录IP：">
          <el-input v-model="detailsData.login_ip"
                    readonly
                    placeholder="最后登录IP"></el-input>
        </el-form-item>
        <el-form-item label="最后登录时间：">
          <el-input v-model="detailsData.login_time"
                    readonly
                    placeholder="最后登录时间"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

export default {
  name: 'OnlineUser',
  components: { Pagination },
  data() {
    return {
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      // 表单数据
      formInline: {
        accountId: '',
        game: '',
        room: ''
      },
      tableData: [],
      dialogVisible: false,
      // 玩家详情数据
      detailsData: {},
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
      let obj = {
        account: this.account,
        login_token: this.login_token,
        query_number: this.formInline.accountId.replace(/\s+/g, ''),
        page: this.currentPage - 1
      };
      this.$axios.postFormData(this.API.ONLINELIST_API, obj)
        .then((res) => {
          if (res.success === true) {
            if (res.data.length > 0) {
              res.data.forEach((items) => {
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
    // 玩家详情
    playerDetails(row, column, cell, event) {
      if (column.label === '用户昵称') {
        this.dialogVisible = true;
        this.detailsData = row;
      }
    },
    // 查询
    query() {
      this.tableDataList();
    },
    // 玩家平台账号字体颜色
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) { // 指定坐标
        return 'color: #0099cc;cursor: pointer;';
      }
      return '';
    },
    // pageSize/currentPage改变事件
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.tableDataList();
    },
    // 清空查询输入框
    clearInput() {
      this.formInline.accountId = '';
      this.formInline.game = '';
      this.formInline.room = '';
      this.currentPage = 1;
      this.tableDataList();
    }
  }
};
</script>
<style lang="scss" scoped>
.onlineUser {
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
.onlineUser {
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
}
</style>
