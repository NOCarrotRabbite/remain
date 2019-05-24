<template>
  <div class="winloseRecords">
    <el-card class="box-card cardPadding">
      <div slot="header"
           class="clearfix">
        <span>操作查询</span>
      </div>
      <el-form :inline="true"
               :model="formInline"
               class="demo-ruleForm seachInput">
        <el-form-item label="时间："
                      class="dateInput">
          <el-date-picker v-model="timeVal"
                          type="daterange"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['00:00:00', '23:59:59']"
                          @change="setQueryDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户ID：">
          <el-input v-model="formInline.query_number"
                    @clear="clear"
                    clearable
                    placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="游戏：">
          <el-select v-model="formInline.query_game"
                     placeholder="请选择游戏类型">
            <el-option :label="items.name"
                       v-for="(items,index) in gameData"
                       :key="index"
                       :value="items.name"></el-option>
          </el-select>
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
          <span>用户输赢数据</span>
        </div>
        <el-table :data="tableData"
                  :empty-text="loadingText"
                  stripe>
          <el-table-column type="index"
                           width="100px">
            <template slot-scope="scope">
              <span>{{scope.$index+(currentPage - 1) * pageSize + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="record_time"
                           label="时间"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="number"
                           label="用户ID"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="game_name"
                           label="游戏"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="room_id"
                           label="房间"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="profit"
                           label="金币输赢/局"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="money"
                           label="剩余携带金币"
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
  name: 'WinloseRecords',
  components: { Pagination },
  data() {
    return {
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      // 表单数据
      formInline: {
        query_number: '',
        query_game: ''
      },
      gameData: [
        {
          name: '游戏1',
          id: '1'
        },
        {
          name: '游戏2',
          id: '2'
        }, {
          name: '游戏3',
          id: '3'
        }
      ],
      tableData: [],
      timeVal: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loadingText: '数据加载中...',
      time_begin: null,
      time_end: null,
      isSeach: false
    };
  },
  created() {
    this.tableDataList();
    this.gameList();
  },
  methods: {
    // 获取游戏列表
    gameList() {
      let obj = {
        account: this.account,
        login_token: this.login_token,
      };
      this.$axios.postFormData(this.API.GAMESLIST_API, obj)
        .then((res) => {
          if (res.success == true) {
            if (res.data.length > 0) {
              this.gameData = res.data;
            } else {
              this.loadingText = '暂无数据';
            }
          } else {
            this.$message.error('游戏列表请求失败！');
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 列表数据
    tableDataList() {
      this.tableData = [];
      if (!this.isSeach || !this.timeVal) {
        this.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', new Date(new Date().getTime() - 3 * 60 * 60 * 1000 * 24));
        this.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', new Date());
      }
      let obj = {
        account: this.account,
        login_token: this.login_token,
        query_number: this.formInline.query_number.replace(/\s+/g, ''),
        query_game: this.formInline.query_game,
        time_begin: this.time_begin,
        time_end: this.time_end,
        page: this.currentPage - 1
      };
      this.$axios.postFormData(this.API.LISTUSERPLARGAMEPROFIT_API, obj)
        .then((res) => {
          if (res.success == true) {
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
    // 查询
    query() {
      this.currentPage = 1;
      if (this.formInline.query_number || this.timeVal || this.formInline.query_game) {
        this.isSeach = true;
      }
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
    // pageSize/currentPage改变事件
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.tableDataList();
    },
    // 清空查询输入框
    clearInput() {
      this.isSeach = false;
      this.formInline.query_number = '';
      this.timeVal = '';
      this.formInline.query_game = '';
      this.currentPage = 1;
      this.tableDataList();
    },
    clear() {
      this.currentPage = 1;
      this.tableDataList();
    }
  }
};
</script>
<style lang="scss" scoped>
.winloseRecords {
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
.winloseRecords {
  .demo-ruleForm {
    .dateInput {
      .el-range-editor.el-input__inner {
        width: 240px;
        height: 35px;
        padding: 0 10px;
        margin-top: 3px;
        input {
          width: 80px;
          height: 28px;
        }
      }
    }
  }
}
</style>
