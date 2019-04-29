<template>
  <div class="addRank">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>添加{{ rank_table == 'rank1'?'财富总榜':'每日金榜'}}排行</span>
      </div>
      <el-form :model="userForm"
               status-icon
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="上榜名次："
                      prop="rank_num">
          <el-input type="text"
                    clearable
                    v-model="userForm.rank_num"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户ID："
                      prop="number">
          <el-input type="text"
                    clearable
                    v-model="userForm.number"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称："
                      prop="nick">
          <el-input type="text"
                    clearable
                    v-model="userForm.nick"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="金额值："
                      prop="rank_value">
          <el-input type="text"
                    clearable
                    v-model="userForm.rank_value"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户头像："
                      prop="icon">
          <el-select v-model="userForm.icon"
                     placeholder="请选择">
            <el-option v-for="(item,index) in 10"
                       :key="index"
                       :label="index"
                       :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm"
                     class="submitBtn">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'AddRank',
  data() {
    return {
      userForm: {
        rank_num: '',
        number: '',
        nick: '',
        icon: '',
        rank_value: '',
      },
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      rank_table: '',
      /*  rules: {
         rank_num: [
           { required: true, message: '请输入旧密码', trigger: 'blur' },
           { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' },
           { validator: this.checkOldPass, trigger: 'blur' }
         ],
         newPass: [
           { required: true, message: '请输入新密码', trigger: 'blur' },
           { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
         ],
         checkPass: [
           { required: true, message: '请确认新密码', trigger: 'blur' },
           { validator: this.checkNewPass, trigger: 'blur' }
         ]
       } */
    };
  },
  created() {
    this.rank_table = this.$route.query.rank_table;
  },
  methods: {
    // 保存账户修改
    submitForm() {
      let obj = {
        account: this.account,
        login_token: this.login_token,
        rank_num: this.userForm.rank_num,
        number: this.userForm.number,
        nick: this.userForm.nick,
        icon: this.userForm.icon,
        rank_value: this.userForm.rank_value,
        rank_table: this.rank_table
      };
      this.$axios.postFormData(this.API.ADDRANK_API, obj)
        .then((res) => {
          if (res.success === true) {
            this.$message({
              message: res.message,
              type: 'success'
            });
            if (this.rank_table == 'rank1') {
              this.$router.push({ path: '/control/treasure_rank' });
            } else {
              this.$router.push({ path: '/control/glod_rank' });
            }
          } else {
            this.$message.error(res.message);
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.addRank {
  .el-form {
    width: 400px;
    padding-top: 100px;
  }
}
</style>
<style lang="scss">
.addRank {
  height: 100%;
  .el-card {
    .el-card__body {
      height: calc(100% - 40px);
      background: #f0f0f0;
      display: flex;
      justify-content: center;
      .el-form {
        .el-form-item__content {
          text-align: center;
          .el-input__inner {
            width: 300px;
          }
        }
      }
    }
  }
}
</style>
