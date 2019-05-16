<template>
  <div class="millionaireRecords">
    <el-card class="box-card cardPadding">
      <div slot="header"
           class="clearfix">
        <span>操作查询</span>
      </div>
      <el-form :inline="true"
               class="demo-ruleForm seachInput">
        <!--<el-form-item label="游戏期数：">
          <el-input v-model="formInline.accountId"
                    clearable
                    placeholder="请输入游戏期数"></el-input>
        </el-form-item>
        <el-form-item label="玩家ID：">
          <el-input v-model="formInline.id"
                    clearable
                    placeholder="请输入玩家ID"></el-input>
        </el-form-item>-->
        <el-form-item label="时间："
                      class="dateInput">
          <el-date-picker v-model="queryDate"
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
          <span>游戏开奖记录</span>
        </div>
        <el-table :data="tableData"
                  stripe
                  :empty-text="loadingText"
                  :cell-style="cellStyle">
          <el-table-column type="index"
                           width="60px">
            <template slot-scope="scope">
              <span>{{scope.$index+(currentPage - 1) * pageSize + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="term_id"
                           label="游戏期数"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="record_time"
                           label="开奖时间"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="winner"
                           label="中奖ID"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="nick"
                           label="中奖用户昵称"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="win_part"
                           label="中奖号码"
                           show-overflow-tooltip>
          </el-table-column>
          <!--  <el-table-column prop="gain"
                           label="购买数量"
                           show-overflow-tooltip>
          </el-table-column>
         <el-table-column prop="manage"
                           label="手续费"
                           show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column prop="gain"
                           label="中奖金额"
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
  name: 'MillionaireRecords',
  components: { Pagination },
  data() {
    return {
      // 表单数据
      queryDate: '',
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loadingText: '数据加载中...',
      time_begin: null,
      time_end: null
    };
  },
  created() {
    this.tableDataList(this.getParams());
  },
  methods: {
    // 列表数据
    tableDataList(param) {
      this.tableData = [];
      this.$axios.postFormData(this.API.MILLIONAIRE_RECORDS_API, param)
        .then((res) => {
          if (res.success === true) {
            this.loadingText = '数据加载中...';
            if (res.data.length > 0) {
              let result = [];
              for (let i = 0; i < res.data.length; i++) {
                let temp = res.data[i].data;
                temp.record_time = res.data[i].record_time;
                result.push(temp);
              }
              this.tableData = result;
              this.total = res.data_total;
            } else {
              this.loadingText = '暂无数据';
            }
          } else {
            this.$message.error(res.message || '请求失败，请重试！');
          }
        });
    },
    // 查询
    query() {
      this.currentPage = 1;
      this.tableDataList(this.getParams());
    },
    // 高亮列
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) { // 指定坐标
        return 'color: rgba(0, 153, 51, 0.7);';
      } else if (columnIndex === 6) {
        return 'color: rgb(236, 85, 98);';
      }
      return '';
    },
    // pageSize/currentPage改变事件
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.tableDataList(this.getParams());
    },
    // 清空查询输入框
    clearInput() {
      this.queryDate = '';
      this.time_begin = null;
      this.time_end = null;
      this.currentPage = 1;
      this.tableDataList(this.getParams());
    },
    // 获取查询参数
    getParams() {
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token'),
        page: this.currentPage - 1
      };
      let startDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
      let endDate = new Date();
      param.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', startDate);
      param.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', endDate);
      if (this.time_begin != null && this.time_end != null) {
        param.time_begin = this.time_begin;
        param.time_end = this.time_end;
      }
      return param;
    },
    // 日期改变事件
    setQueryDate() {
      this.time_begin = null;
      this.time_end = null;
      if (this.queryDate != null) {
        this.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.queryDate[0]);
        this.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', this.queryDate[1]);
      }
    },
  }
};
</script>
<style lang="scss">
.millionaireRecords {
  .demo-ruleForm {
    text-align: left;
    padding: 10px;
    .el-form-item {
      padding-right: 20px;
    }
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
