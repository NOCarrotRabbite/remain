<template>
  <div class="chargeRecords">
    <el-card class="box-card cardPadding">
      <div slot="header"
           class="clearfix">
        <span>操作查询</span>
      </div>
      <el-form :inline="true"
               :model="formInline"
               class="demo-ruleForm seachInput">
        <el-form-item label="玩家ID：">
          <el-input v-model="formInline.accountId"
                    clearable
                    placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="充值类型：">
          <el-select v-model="formInline.game"
                     placeholder="请选择充值类型">
            <el-option :label="items.name"
                       v-for="items in gameData"
                       :key="items.id"
                       :value="items.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充值时间："
                      class="dateInput">
          <el-date-picker v-model="value13"
                          type="daterange"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['00:00:00', '23:59:59']">
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
          <span>充值数据</span>
        </div>
        <el-table :data="tableData"
                  :cell-style="cellStyle">
          <el-table-column type="index"
                           width="60px">
            <!-- <template slot-scope="scope">
            <span>{{scope.$index+(current - 1) * size + 1}} </span>
          </template> -->
          </el-table-column>
          <el-table-column prop="manage"
                           label="充值时间"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="manage"
                           label="充值ID"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="manage"
                           label="充值用户昵称"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="manage"
                           label="充值金额"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="manage"
                           label="充值类型"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="manage"
                           label="手续费"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="manage"
                           label="到账金额"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="manage"
                           label="累计充值额"
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
  name: 'ChargeRecords',
  components: { Pagination },
  data() {
    return {
      // 表单数据
      formInline: {
        accountId: '',
        game: '',
        room: ''
      },
      gameData: [
        {
          name: '充值类型1',
          id: '1'
        },
        {
          name: '充值类型2',
          id: '2'
        }, {
          name: '充值类型3',
          id: '3'
        }
      ],
      tableData: [
        {
          roleName: '超级管理员',
          manage: '王小虎',
          address: '备注信息'
        }, {
          roleName: '超级管理员',
          manage: '王小虎',
          address: '备注信息'
        }, {
          roleName: '超级管理员',
          manage: '王小虎',
          address: '备注信息'
        }, {
          roleName: '超级管理员',
          manage: '王小虎',
          address: '备注信息'
        }
      ],
      value13: '',
      total: 0,
      currentPage: 1,
      pageSize: 10
    };
  },
  created() {
    this.tableDataList();
  },
  methods: {
    // 列表数据
    tableDataList() {
      /* this.$axios.post(this.API.ADDEDIT_ROLE_API, this.multipleSelection)
        .then((res) => {
          if (res.success === true) {
            this.tableData = res.data;
          } else {
            this.$message.error('数据请求失败！');
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
        }); */
    },
    // 查询
    query() {
      /*  this.$axios.post(this.API.ADDEDIT_ROLE_API, this.formInline)
                .then((res) => {
                  } else {
                    this.$message.error('数据请求失败！')
                    return false
                  }
                })
                .catch((error) => {
                  console.log(error)
                }) */
    },
    // 高亮列
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4 || columnIndex === 8) { // 指定坐标
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
    },
    // 清空查询输入框
    clearInput() {
      this.formInline.accountId = '';
      this.formInline.game = '';
      this.value13 = '';
      /* this.currentPage = 1;
      this.tableDataList(); */
    }
  }
};
</script>
<style lang="scss" scoped>
.chargeRecords {
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
.chargeRecords {
  .demo-ruleForm {
    .dateInput {
      .el-form-item__content {
        width: 240px;
        .el-range-editor.el-input__inner {
          width: 240px;
          height: 35px;
          padding: 0 10px;
          margin-top: 3px;
          input {
            width: 90px;
            height: 28px;
          }
        }
      }
    }
  }
}
</style>
