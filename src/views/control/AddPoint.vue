<template>
  <div class="addPoint">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>设置玩家</span>
        <div>
          <el-button @click="reset"
                     type="primary">返回</el-button>
        </div>
      </div>
      <el-form :inline="true"
               class="demo-ruleForm seachInput">
        <el-form-item label="用户ID："
                      prop="userId">
          <el-input v-model="formInline.number"
                    :disabled="editDisabled"
                    placeholder="请输入用户ID"
                    @blur="checkIdIdentify"></el-input>
        </el-form-item>
        <el-form-item label="游戏名称："
                      prop="gameName">
          <template>
            <el-select v-model="formInline.game_name"
                       :disabled="editDisabled"
                       @change="gameChange"
                       class="selectGame"
                       placeholder="请选择">
              <el-option v-for="(item,index) in gameList"
                         :key="index"
                         :label="item"
                         :value="item">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <el-card class="boxCard">
        <div slot="header"
             class="clearfix">
          <span>设置任务</span>
        </div>
        <el-form :inline="true"
                 class="templateForm">
          <el-form-item label="MainSpin："
                        v-if="spinList.length>0">
            <template>
              <el-select v-model="spin"
                         :disabled="disabled"
                         class="selectGame"
                         placeholder="请选择">
                <el-option v-for="(item,index) in spinList"
                           :key="index"
                           :label="item.value"
                           :value="index">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="FreeSpin："
                        v-if="freeSpinList.length>0">
            <template>
              <el-select v-model="freeSpin"
                         :disabled="disabled"
                         class="selectGame"
                         placeholder="请选择">
                <el-option v-for="(item,index) in freeSpinList"
                           :key="index"
                           :label="item.value"
                           :value="index">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="MarySpin："
                        v-if="marySpinList.length>0">
            <template>
              <el-select v-model="marySpin"
                         :disabled="disabled"
                         class="selectGame"
                         placeholder="请选择">
                <el-option v-for="(item,index) in marySpinList"
                           :key="index"
                           :label="item.value"
                           :value="index">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item class="number">
            <el-input-number v-model="num1"
                             :disabled="disabled"
                             :min="0"
                             :max="200">
            </el-input-number>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="boxCard">
        <div slot="header"
             class="clearfix">
          <span>任务详情</span>
          <div>
            <el-button @click="resetTable"
                       type="danger">清空</el-button>
            <el-button @click="save"
                       type="success">保存</el-button>
          </div>
        </div>
        <el-table :data="tableData"
                  stripe>
          <el-table-column type="index"
                           align="center">
          </el-table-column>
          <el-table-column prop="spin"
                           align="center"
                           label="MainSpin"
                           v-if="spinList.length>0"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="free_spin"
                           align="center"
                           label="FreeSpin"
                           v-if="freeSpinList.length>0"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="mary_spin"
                           align="center"
                           label="MarySpin"
                           v-if="marySpinList.length>0"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作"
                           width="200px"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="editGame(scope.$index)"
                         type="primary">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import spinJson from '@/store/spin';

export default {
  name: 'AddPoint',
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
      spinList: [],
      freeSpinList: [],
      marySpinList: [],
      formInline: {
        number: '',
        game_name: '',
      },
      num1: '',
      spinData: {
        spin: '',
        free_spin: '',
        mary_spin: '',
      },
      spin: '',
      freeSpin: '',
      marySpin: '',
      spin1Temp: '',
      freeSpin1Temp: '',
      marySpin1Temp: '',
      disabled: true,
      tableData: [],
      rtp_buff: {
        list: []
      },
      editDisabled: false
    };
  },
  created() {
    this.tableData = [];
    if (this.$route.query.text == 'edit') {
      this.rtp_buff.list = this.$route.query.data.rtp_buff.list;
      this.formInline.game_name = this.$route.query.data.game_name;
      this.gameChange();
      this.queryData();
      this.editDisabled = true;
    } else {
      this.editDisabled = false;
    }
  },
  methods: {
    queryData() {
      this.tableData = [];
      this.disabled = false;
      this.formInline.number = this.$route.query.data.number;
      this.formInline.game_name = this.$route.query.data.game_name;
      // 获取每条数据游戏名
      /* let gameName = this.formInline.game_name.substring(0, this.formInline.game_name.length - 1); */
      let gameName = this.screenGame(this.formInline.game_name);
      // 通过游戏名获取对应静态配置数据
      let gameDataJson = spinJson.data[gameName];
      let list = [];
      let buffList = this.$route.query.data.rtp_buff.list;
      let data;
      for (let i in buffList) {
        if (gameDataJson.freeSpinData && gameDataJson.marySpinData) {
          data = {
            spin: gameDataJson.spinData[buffList[i].spin].value,
            free_spin: gameDataJson.freeSpinData[buffList[i].free_spin].value,
            mary_spin: gameDataJson.marySpinData[buffList[i].mary_spin].value
          };
        } else if (gameDataJson.freeSpinData && !gameDataJson.marySpinData) {
          data = {
            spin: gameDataJson.spinData[buffList[i].spin].value,
            free_spin: gameDataJson.freeSpinData[buffList[i].free_spin].value
          };
        } else {
          data = {
            spin: gameDataJson.spinData[buffList[i].spin].value
          };
        }
        this.tableData.push(data);
      }
      this.num1 = this.tableData.length;
    },
    // 选择游戏获取spin
    gameChange() {
      this.spinList = [];
      this.freeSpinList = [];
      this.marySpinList = [];
      this.tableData = [];
      this.num1 = 0;
      if (this.formInline.game_name) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
      let gameName = this.screenGame(this.formInline.game_name);
      /* let gameName = this.formInline.game_name.substring(0, this.formInline.game_name.length - 1); */
      let gameSpinData = spinJson.data[gameName];
      if (gameSpinData.spinData != null && gameSpinData.spinData != undefined) {
        this.spinList = gameSpinData.spinData.filter((item) => {
          let val = item.value;
          return val !== '0%';
        });
      }
      if (gameSpinData.freeSpinData != null && gameSpinData.freeSpinData != undefined) {
        this.freeSpinList = gameSpinData.freeSpinData.filter((item) => {
          let val = item.value;
          return val !== '0%';
        });
      }
      if (gameSpinData.marySpinData != null && gameSpinData.marySpinData != undefined) {
        this.marySpinList = gameSpinData.marySpinData.filter((item) => {
          let val = item.value;
          return val !== '0%';
        });
      }
    },
    // 保存
    save() {
      let data;
      this.$confirm('请确认是否进行本次任务设置？', '设置', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnHashChange: true,
        type: '',
        center: true,
      }).then(({ value }) => {
        let obj = {
          account: this.account,
          login_token: this.login_token,
          game: this.formInline.game_name,
          number: this.formInline.number,
          rtp_buff: JSON.stringify(this.rtp_buff)
        };
        this.$axios.postFormData(this.API.SETUSERRTP_API, obj)
          .then((res) => {
            if (res.success == true) {
              this.$message({
                message: res.message,
                type: 'success'
              });
              this.$router.push({ path: '/control/gm_control' });
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
    },
    // 删除
    editGame(index) {
      this.tableData.splice(index, 1);
      this.rtp_buff.list.splice(index, 1);
      this.num1--;
    },
    // 重置
    reset() {
      this.num1 = 0;
      this.spinData.spin = '';
      this.spinData.free_spin = '';
      this.spinData.mary_spin = '';
      this.$router.push({ path: '/control/gm_control' });
    },
    // 清空
    resetTable() {
      this.tableData = [];
      this.num1 = 0;
    },
    // 验证用户输入ID是否有此人
    checkIdIdentify() {
      if (this.formInline.number.replace(/\s+/g, '') != '' && this.formInline.number.replace(/\s+/g, '') != null) {
        let param = {
          account: this.account,
          login_token: this.login_token,
          query_number: this.formInline.number.replace(/\s+/g, ''),
          page: 0
        };
        this.$axios.postFormData(this.API.USERMESSAGE_API, param)
          .then((res) => {
            if (res.success == true) {
              if (res.data_total == 0) {
                this.$message.error('此ID无效，请重新输入！');
                this.formInline.number = '';
              }
            } else {
              this.$message.error(res.message || '请求失败，请重试！');
              return false;
            }
          }).catch((error) => {
            console.log(error);
          });
      }
    },
    screenGame(game) {
      let gameName;
      let editGame = game.split('/');
      switch (game) {
        case '兰桂坊1/传奇霸业1':
          gameName = editGame[0].substring(0, editGame[0].length - 1);
          break;
        case '兰桂坊2/传奇霸业2':
          gameName = editGame[0].substring(0, editGame[0].length - 1);
          break;
        case '兰桂坊3/传奇霸业3':
          gameName = editGame[0].substring(0, editGame[0].length - 1);
          break;
        case '时代巨星1/夜戏貂蝉1':
          gameName = editGame[0].substring(0, editGame[0].length - 1);
          break;
        case '时代巨星2/夜戏貂蝉2':
          gameName = editGame[0].substring(0, editGame[0].length - 1);
          break;
        case '时代巨星3/夜戏貂蝉3':
          gameName = editGame[0].substring(0, editGame[0].length - 1);
          break;
        default:
          gameName = this.formInline.game_name.substring(0, this.formInline.game_name.length - 1);
      }
      return gameName;
    }
  },
  watch: {
    spin(newValue, oldValue) {
      this.spin1Temp = '';
      this.spin1Temp = newValue + 1;
    },
    freeSpin(newValue, oldValue) {
      this.freeSpin1Temp = '';
      this.freeSpin1Temp = newValue + 1;
    },
    marySpin(newValue, oldValue) {
      this.marySpin1Temp = '';
      this.marySpin1Temp = newValue + 1;
    },
    num1(newValue, oldValue) {
      // num 减小，循环删除减少的渲染列
      if (newValue < oldValue) {
        let decrement = oldValue - newValue;
        this.tableData.splice(newValue, decrement);
        this.rtp_buff.list.splice(newValue, decrement);
      }
      let i;
      if (this.tableData.length) {
        i = this.tableData.length;
      } else {
        i = 0;
      }
      // 获取每条数据游戏名
      /* let gameName = this.formInline.game_name.substring(0, this.formInline.game_name.length - 1); */
      let gameName = this.screenGame(this.formInline.game_name);
      // 通过游戏名获取对应静态配置数据
      let gameDataJson = spinJson.data[gameName];
      let data;
      let buff;
      if (gameDataJson.freeSpinData && gameDataJson.marySpinData) {
        data = {
          spin: gameDataJson.spinData[this.spin1Temp].value,
          free_spin: gameDataJson.freeSpinData[this.freeSpin1Temp].value,
          mary_spin: gameDataJson.marySpinData[this.marySpin1Temp].value,
        };
        buff = {
          spin: this.spin1Temp,
          free_spin: this.freeSpin1Temp,
          mary_spin: this.marySpin1Temp
        };
      } else if (gameDataJson.freeSpinData && !gameDataJson.marySpinData) {
        data = {
          spin: gameDataJson.spinData[this.spin1Temp].value,
          free_spin: gameDataJson.freeSpinData[this.freeSpin1Temp].value
        };
        buff = {
          spin: this.spin1Temp,
          free_spin: this.freeSpin1Temp
        };
      } else if (gameDataJson.marySpinData && !gameDataJson.freeSpinData) {
        data = {
          spin: gameDataJson.spinData[this.spin1Temp].value,
          mary_spin: gameDataJson.marySpinData[this.marySpin1Temp].value,
        };
        buff = {
          spin: this.spin1Temp,
          mary_spin: this.marySpin1Temp
        };
      } else {
        data = {
          spin: gameDataJson.spinData[this.spin1Temp].value
        };
        buff = {
          spin: this.spin1Temp
        };
      }
      for (i; i < this.num1; i++) {
        this.tableData.push(data);
        this.rtp_buff.list.push(buff);
      }
    },
  },
  // 过滤掉'0%'数据项
  computed: {

  }
};
</script>
<style lang="scss" scoped>
.addPoint {
  .boxCard {
    margin: 0;
    .templateForm {
      padding-top: 20px;
    }
  }
}
</style>
<style lang="scss">
.addPoint {
}
</style>
