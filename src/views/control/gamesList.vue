<template>
  <div class="gamesList">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>游戏列表</span>
      </div>
      <el-table :data="tableData"
                stripe
                :empty-text="loadingText">
        <el-table-column type="index"
                         width="60px">
          <!-- <template slot-scope="scope">
            <span>
              {{scope.$index+(currentPage - 1) * pageSize + 1 }}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="name"
                         align="center"
                         label="游戏名称"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="storage"
                         align="center"
                         label="库存"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="jackpot"
                         align="center"
                         label="奖池"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作"
                         width="200px"
                         align="center">
          <template slot-scope="scope">
            <el-button @click="editGame(scope.row)"
                       type="primary">修改库存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'gamesList',
  data() {
    return {
      tableData: [],
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      loadingText: '数据加载中...',
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
      };
      this.$axios.postFormData(this.API.GAMESLIST_API, obj)
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
    // 修改库存
    editGame(row) {
      let storage = parseInt(row.storage);
      this.$prompt('请输入增减的金币:', '设置', {
        /*  center: true, */
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'megBox',
        /* inputPattern: /^[1-9][0-9]*$/, */
        inputPlaceholder: '正数为增加，负数为减少！',
        inputValidator: (val) => {
          let newVal = parseInt(val);
          let addVal = storage + newVal;
          if (val === null) {
            this.reg = true;
            return false;
          }
          if (addVal > 99999999999999) {
            this.reg = true;
            return false;
          }
        },
        inputErrorMessage: '请输入修改的金币，库存总和不超过14位数!',
      }).then(({ value }) => {
        let obj = {
          account: this.account,
          login_token: this.login_token,
          game_name: row.name,
          increment: value
        };
        this.$axios.postFormData(this.API.MODIFYSTORAGE_API, obj)
          .then((res) => {
            if (res.success == true) {
              this.$message({
                message: '库存修改成功！',
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
    }
  }
};
</script>
<style lang="scss" scoped>
.gamesList {
}
</style>
<style lang="scss">
.gamesList {
}
</style>
