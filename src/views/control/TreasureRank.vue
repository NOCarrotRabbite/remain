<template>
  <div class="cardBox">
    <div class="treasureRank"
         v-if="viewShow">
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>财富总榜</span>
          <el-button @click="addRank"
                     type="success">新增排行</el-button>
        </div>
        <el-table :data="tableData"
                  stripe
                  :empty-text="loadingText">
          <el-table-column prop="rank_num"
                           width="60px"
                           label="排行"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="number"
                           label="用户ID"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="nick"
                           label="玩家昵称"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="rank_value"
                           label="玩家金币"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="icon"
                           label="玩家头像号"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作"
                           width="100px"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="delRank(scope.row)"
                         type="danger">删除排行</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

export default {
  name: 'TreasureRank',
  components: { Pagination },
  data() {
    return {
      tableData: [],
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
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
        rank_table: 'rank1'
      };
      this.$axios.postFormData(this.API.TREASURELISTRANK_API, obj)
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
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 新增排行
    addRank() {
      this.$router.push({ path: '/control/add_rank', query: { rank_table: 'rank1' } });
    },
    // 删除排行
    delRank(row) {
      let obj = {
        account: this.account,
        login_token: this.login_token,
        number: row.number,
        rank_table: 'rank1',
      };
      this.$axios.postFormData(this.API.DELRANK_API, obj)
        .then((res) => {
          if (res.success == true) {
            this.tableDataList();
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
          } else {
            this.$message.error('删除失败！');
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  computed: {
    // 控制二级路由页面的显示和隐藏
    viewShow() {
      if (this.$route.path.split('/').reverse()[0] === 'add_rank') {
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
.cardBox {
  height: calc(100% - 50px);
  .treasureRank {
    .el-card {
      padding-bottom: 44px;
    }
  }
}
</style>
