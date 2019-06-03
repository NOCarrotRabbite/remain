<template>
  <div class="promoterList">
    <el-card class="box-card cardPadding"
             v-if="viewShow">
      <div slot="header"
           class="clearfix">
        <span>推广员列表</span>
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
        <el-table-column prop="superior"
                         align="center"
                         label="推广员ID"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="promote_count"
                         align="center"
                         label="推广员人数"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="current_promote_score"
                         align="center"
                         label="当前积分"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="history_promote_score"
                         align="center"
                         label="历史积分"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="exchange_money"
                         align="center"
                         label="已兑换金币"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="money"
                         align="center"
                         label="账号金币数量"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="examine(scope.$index, scope.row)">详细数据</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="total"
                  :currentPage="currentPage"
                  :pageSize="pageSize"
                  @currentPage="handleChange"
                  @sizeChange="handleChange" />
    </el-card>
    <router-view></router-view>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

export default {
  name: 'promoterList',
  components: { Pagination },
  data() {
    return {
      // 表格数据
      tableData: [],
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
        page: this.currentPage - 1
      };
      this.$axios.postFormData(this.API.PROMOTER_LIST_API, param)
        .then((res) => {
          if (res.success == true) {
            this.total = res.data_total;
            if (res.data.length > 0) {
              for (let obj of res.data) {
                obj.exchange_money = obj.history_promote_score - obj.current_promote_score;
              }
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
    // pageSize/currentPage改变事件
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.tableDataList();
    },
    // 查看推广员详细数据
    examine(index, row) {
      this.$router.push({ path: './promoter_detailed_data', query: { row } });
    },
    // 清空查询输入框
    clearInput() {
      this.formInline.palyerId = '';
      /* this.currentPage = 1;
      this.tableDataList(); */
    }
  },
  computed: {
    // 控制二级路由页面的显示和隐藏
    viewShow() {
      if (this.$route.path.split('/').reverse()[0] === 'promoter_detailed_data') {
        return false;
      }
      return true;
    }
  }
};
</script>
<style lang="scss" scoped>
.promoterList {
  .demo-ruleForm {
    text-align: left;
    padding: 10px;
    .el-form-item {
      padding-right: 20px;
    }
  }
}
</style>
