<template>
  <div class="systemMail">
    <el-card class="box-card cardPadding">
      <div slot="header"
           class="clearfix">
        <span>操作查询</span>
      </div>
      <el-form :inline="true"
               class="demo-ruleForm seachInput">
        <el-form-item label="生成时间："
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
          <el-input v-model="exchanged_user"
                    @clear="clear"
                    clearable
                    placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="新手卡号：">
          <el-input v-model="card_number"
                    @clear="clear"
                    clearable
                    placeholder="请输入新手卡号"></el-input>
        </el-form-item>
        <el-form-item label="card_status：">
          <el-select v-model="card_status"
                     @change="clear"
                     placeholder="请选择状态">
            <el-option v-for="(item,index) in cardStatus"
                       :key="index"
                       :label="item.label"
                       :value="item.value">
            </el-option>
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
          <span>新手卡列表</span>
          <div>
            <el-button @click="addCard('detailsData')"
                       type="success">生成新手卡</el-button>
            <el-button @click="exportCard"
                       element-loading-background="rgba(0, 0, 0, 0.1)"
                       :element-loading-text="loadText"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       type="danger">导出新手卡</el-button>
          </div>
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
          <el-table-column prop="card_number"
                           label="CD-KEY"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="exchanged_user"
                           label="兑换人ID"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="card_money"
                           label="金币数量"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="create_time"
                           label="生成时间"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="expire"
                           label="到期时间"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="exchanged_time"
                           label="兑换时间"
                           show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column prop="type"
                           label="类型"
                           show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column prop="card_status"
                           label="状态"
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
    <!-- 新增邮件弹框 -->
    <el-dialog title="新增新手卡"
               @close="cancel"
               :visible.sync="dialogVisible">
      <el-form :model="detailsData"
               :rules="rules"
               ref="detailsData"
               label-width="100px"
               class="demo-form mailInput">
        <el-form-item label="生成类型：">
          <el-select v-model="detailsData.type"
                     placeholder="请选择">
            <el-option v-for="(item,index) in options"
                       :key="index"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期 (天)："
                      prop="days">
          <el-input v-model="detailsData.days "
                    placeholder="请输入有效期"></el-input>
        </el-form-item>
        <el-form-item label="生成数量 (张)："
                      prop="count">
          <el-input v-model="detailsData.count "
                    placeholder="请输入金币数量"></el-input>
        </el-form-item>
        <el-form-item label="金币数量："
                      prop="card_money">
          <el-input v-model="detailsData.card_money "
                    placeholder="请输入金币数量"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   element-loading-background="rgba(0, 0, 0, 0.1)"
                   :element-loading-text="loadText"
                   v-loading.fullscreen.lock="fullscreenLoading"
                   @click="affirmAddMail('detailsData')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';

let exportData = [];
let i = 0;
export default {
  name: 'SystemMail',
  components: { Pagination },
  data() {
    return {
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      // 表单数据
      exchanged_user: '',
      card_number: '',
      card_status: '-1',
      timeVal: '',
      tableData: [],
      dialogVisible: false,
      detailsData: {
        type: '',
        card_money: '',
        days: '',
        count: ''
      },
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loadingText: '数据加载中...',
      time_begin: null,
      time_end: null,
      options: [
        {
          value: '游戏金币卡',
          label: '游戏金币卡'
        }
      ],
      cardStatus: [
        {
          value: '-1',
          label: '全部'
        },
        {
          value: '0',
          label: '未兑换'
        },
        {
          value: '1',
          label: '已兑换'
        }
      ],
      fullscreenLoading: false,
      loadText: '',
      rules: {
        card_money: [
          { required: true, message: '请输入金币数量', trigger: 'blur' },
          { validator: this.validatePass, trigger: 'blur' }
        ],
        days: [
          { required: true, message: '请输入有效期', trigger: 'blur' },
          { validator: this.validatePass, trigger: 'blur' }
        ],
        count: [
          { required: true, message: '请输入生成数量', trigger: 'blur' },
          { validator: this.validatePass, trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.tableDataList();
  },
  methods: {
    // 列表数据
    tableDataList() {
      this.tableData = [];
      if (!this.isSeach) {
        this.time_begin = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', new Date(new Date().getTime() - 3 * 60 * 60 * 1000 * 24));
        this.time_end = this.common.dateFtt('yyyy-MM-dd hh:mm:ss', new Date());
      }
      let obj = {
        account: this.account,
        login_token: this.login_token,
        time_begin: this.time_begin,
        time_end: this.time_end,
        page: this.currentPage - 1,
        card_number: this.card_number.replace(/\s+/g, ''),
        card_status: this.card_status,
        exchanged_user: this.exchanged_user.replace(/\s+/g, '')
      };
      this.$axios.postFormData(this.API.LIST_CARD_API, obj)
        .then((res) => {
          if (res.success == true) {
            if (res.data.length > 0) {
              res.data.forEach((item) => {
                item.card_status == 0 ? item.card_status = '未兑换' : item.card_status = '已兑换';
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
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 查询
    query() {
      if (this.timeVal || this.card_number || this.card_status || this.exchanged_user) {
        this.isSeach = true;
      }
      this.currentPage = 1;
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
    // 新增新手卡
    addCard(formName) {
      this.dialogVisible = true;
      this.$refs[formName].resetFields();
    },
    // 确认新增新手卡
    affirmAddMail(formName) {
      let obj = {
        account: this.account,
        login_token: this.login_token,
        card_money: this.detailsData.card_money,
        days: this.detailsData.days,
        count: this.detailsData.count
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loadText = '拼命生成中，请稍后...';
          this.fullscreenLoading = true;
          this.$axios.postFormData(this.API.ADD_CARD_API, obj)
            .then((res) => {
              if (res.success == true) {
                this.fullscreenLoading = false;
                this.$message({
                  message: res.message,
                  type: 'success'
                });
                this.$refs[formName].resetFields();
                this.dialogVisible = false;
                this.currentPage = 1;
                this.tableDataList();
              } else {
                this.fullscreenLoading = false;
                this.$message.error(res.message || '请求失败，请重试！');
                return false;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 新增整数验证
    validatePass(rule, value, callback) {
      if (Number(value) && Number(value) > 0 && (value) % 1 === 0) {
        callback();
      } else if (Number(value) == 0) {
        callback();
      } else {
        callback(new Error('请输入正整数'));
      }
    },
    // 导出新手卡
    exportCard() {
      let param = this.getParams();
      this.$axios.postFormData(this.API.LIST_CARD_API, this.getParams())
        .then((res) => {
          this.loadText = '拼命导出中，请稍后...';
          this.fullscreenLoading = true;
          if (res.success == true) {
            i++;
            if (res.data.length > 0 && exportData.length != res.data_total) {
              for (let j = 0; j < res.data.length; j++) {
                res.data[j].card_status == 0 ? res.data[j].card_status = '未兑换' : res.data[j].card_status = '已兑换';
                exportData.push(res.data[j]);
              }
              this.exportCard();
            } else {
              i = 0;
              this.tableToExcel(exportData);
              return true;
            }
          } else {
            this.fullscreenLoading = false;
            this.$message.error(res.message || '请求失败，请重试！');
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取请求参数
    getParams() {
      let obj = {
        account: this.account,
        login_token: this.login_token,
        time_begin: '1887-01-01 00:00:00',
        time_end: this.time_end,
        page: i,
        card_number: '',
        card_status: '-1',
        exchanged_user: ''
      };
      return obj;
    },
    // 取消新增新手卡
    cancel() {
      this.detailsData = {
        type: '',
        card_money: '',
        days: '',
        count: ''
      };
      this.dialogVisible = false;
      this.currentPage = 1;
      this.tableDataList();
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
      this.timeVal = '';
      this.exchanged_user = '';
      this.card_number = '';
      this.card_status = '-1';
      this.timeVal = '';
      this.currentPage = 1;
      this.tableDataList();
    },
    clear() {
      this.currentPage = 1;
      this.tableDataList();
    },
    // 下载函数
    tableToExcel(jsonData) {
      // 列标题
      let str = '<tr><td>生成时间</td><td>CD-KEY</td><td>状态</td><td>金币数量</td><td>到期时间</td><td>兑换人ID</td><td>兑换时间</td></tr>';
      // 循环遍历，每行加入tr标签，每个单元格加td标签
      for (let m = 0; m < jsonData.length; m++) {
        str += '<tr>';
        for (let item in jsonData[m]) {
          // 增加\t为了不让表格显示科学计数法或者其他格式
          str += `<td>${jsonData[m][item] + '\t'}</td>`;
        }
        str += '</tr>';
      }
      // Worksheet名
      let worksheet = '新手卡明细表';
      let uri = 'data:application/vnd.ms-excel;base64,';

      // 下载的表格模板数据
      let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body><table>${str}</table></body></html>`;
      // 下载模板
      window.location.href = uri + this.base64(template);
      exportData = [];
      this.fullscreenLoading = false;
    },
    base64(s) { return window.btoa(unescape(encodeURIComponent(s))); }
  }
};
</script>
<style lang="scss" scoped>
.systemMail {
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
.systemMail {
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
  .el-dialog {
    .el-dialog__header {
      display: flex;
    }
    .el-dialog__body {
      padding: 20px 50px 20px 20px;
    }
    .el-form {
      font-size: 0;
      .el-form-item__label {
        width: 120px !important;
      }
      .el-form-item__content {
        display: flex;
        align-items: center;
        .checkBtn {
          height: 28px;
          margin-left: 10px;
          color: #fff;
          background-color: #409eff;
          border-color: #409eff;
        }
      }
      .el-form-item {
        padding: 0 0 20px 0;
      }
    }
  }
  .mailInput {
    .el-form-item {
      margin: 0;
      padding: 20px 0;
      input {
        border: 1px solid #e4e6eb;
        border-radius: 4px;
        height: 30px;
      }
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
