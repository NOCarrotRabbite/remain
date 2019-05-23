<template>
  <div class="pointControl">
    <div v-if="viewShow">
      <el-card class="box-card cardPadding">
        <div slot="header"
             class="clearfix">
          <span>操作查询</span>
          <div class="btn">
            <el-button @click="addPlayer"
                       type="success">新增配置</el-button>
          </div>
        </div>
        <el-form :inline="true"
                 class="demo-ruleForm seachInput">
          <el-form-item label="玩家ID：">
            <el-input v-model="query_number"
                      @clear="clearInput"
                      clearable
                      placeholder="请输入用户玩家ID"></el-input>
          </el-form-item>
          <el-form-item label="游戏：">
            <el-select v-model="query_game"
                       placeholder="请选择游戏名">
              <el-option :label="items"
                         v-for="(items,index) in gameList"
                         :key="index"
                         :value="items"></el-option>
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
            <span>控制条目</span>
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
            <el-table-column prop="number"
                             align="center"
                             label="玩家ID"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="game_name"
                             align="center"
                             label="任务房间"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="rtp_buff"
                             align="center"
                             label="剩余次数"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.rtp_buff.list.length}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             width="200px"
                             align="center">
              <template slot-scope="scope">
                <el-button @click="editGame(scope.row)"
                           type="primary">修改</el-button>
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

    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import spinJson from '@/store/spin';

export default {
  name: 'pointControl',
  components: { Pagination },
  data() {
    return {
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      gameList: [
        '水果连连看1', '水果连连看2', '水果连连看3',
        '兰桂坊1/传奇霸业1', '兰桂坊2/传奇霸业2', '兰桂坊3/传奇霸业3',
        '美人传奇1', '美人传奇2', '美人传奇3',
        '经典拉霸1', '经典拉霸2', '经典拉霸3',
        '生财有道1', '生财有道2', '生财有道3',
        '时代巨星1/夜戏貂蝉1', '时代巨星2/夜戏貂蝉2', '时代巨星3/夜戏貂蝉3',
        '王者传奇1', '王者传奇2', '王者传奇3',
        '小鸡快跑1', '小鸡快跑2', '小鸡快跑3'
      ],
      tableData: [],
      tableTempData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      query_game: '',
      query_number: '',
      isSeach: false,
      loadingText: '数据加载中...'
    };
  },
  created() {
    this.tableDataList();
  },
  methods: {
    // 获取玩家点控列表
    tableDataList() {
      this.tableData = [];
      if (!this.isSeach) {
        this.query_game = '';
        this.query_number = '';
      }
      let obj = {
        account: this.account,
        login_token: this.login_token,
        query_game: this.query_game,
        query_number: this.query_number.replace(/\s+/g, ''),
        page: this.currentPage - 1
      };
      this.$axios.postFormData(this.API.LISTUSERRTP_API, obj)
        .then((res) => {
          if (res.success == true) {
            this.loadingText = '数据加载中...';
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
        }).catch((error) => {
          console.log(error);
        });
    },
    // 新增玩家
    addPlayer() {
      this.$router.push({ path: '/control/AddPoint', query: { text: 'add' } });
    },
    // 修改点数
    editGame(row) {
      this.$router.push({ path: '/control/AddPoint', query: { data: row, text: 'edit' } });
    },
    // pageSize/currentPage改变事件
    handleChange(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.tableDataList();
    },
    // 查询
    query() {
      if (this.query_number || this.query_game) {
        this.isSeach = true;
      }
      this.currentPage = 1;
      this.tableDataList();
    },
    // 清空查询输入框
    clearInput() {
      this.isSeach = false;
      this.currentPage = 1;
      this.tableDataList();
    }
  },
  computed: {
    // 控制二级路由页面的显示和隐藏
    viewShow() {
      if (this.$route.path.split('/').reverse()[0] === 'AddPoint') {
        return false;
      }
      return true;
    }
  },
  watch: {
    // 如果路由有变化，刷新数据
    $route: 'tableDataList',
    tableData(newValue, oldValue) {
      /* this.dataFiltrate(newValue); */
      /*  this.tableData = newValue; */
    }
  }
};
</script>
<style lang="scss" scoped>
.pointControl {
  .tags {
    font-size: 0;
    .el-tag {
      margin-right: 4px;
    }
  }
}
</style>
<style lang="scss">
.pointControl {
  .el-form-item {
    padding-right: 20px;
  }
}
</style>
