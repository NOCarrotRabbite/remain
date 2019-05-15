<template>
  <div class="promoterList">
    <el-card class="box-card cardPadding">
      <div slot="header"
           class="clearfix">
        <span>推广列表</span>
      </div>
      <el-table :data="playerData"
                stripe
                :empty-text="loadingText">
        <el-table-column type="index"
                         width="60px">
          <template slot-scope="scope">
            <span>
              {{scope.$index+(currentPage - 1) * pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nick"
                         label="玩家ID"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="number"
                         label="玩家昵称"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="promote_score"
                         label="产生积分量"
                         show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <Pagination :total="total"
                  :currentPage="currentPage"
                  :pageSize="pageSize"
                  @currentPage="handleChange"
                  @sizeChange="handleChange" />
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

export default {
  name: 'promoterList',
  components: { Pagination },
  data() {
    return {
      // 表单数据
      formInline: {
        palyerId: '',
      },
      playerData: [],
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
      this.playerData = [];
      let param = {
        account: localStorage.getItem('currentUser_name'),
        login_token: localStorage.getItem('currentUser_token'),
        page: this.currentPage - 1,
        superior: this.$route.query.row.superior
      };
      this.$axios.postFormData(this.API.PROMOTER_DETAIL_API, param)
        .then((res) => {
          if (res.success == true) {
            this.loadingText = '数据加载中...';
            if (res.data.length > 0) {
              this.playerData = res.data;
              this.total = res.data_total;
            } else {
              this.loadingText = '暂无数据';
            }
          } else {
            this.$message.error(res.message || '请求失败，请重试！');
            this.loadingText = '请求失败，暂无数据';
            return false;
          }
        }).catch((error) => {
          console.log(error);
          this.loadingText = '请求失败，暂无数据';
        });
    },
    // pageSize/currentPage改变事件
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.tableDataList();
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
  .cardBox {
    margin-bottom: 40px;
  }
}
</style>
