<template>
  <div class="accountSet">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>账户设置</span>
      </div>
      <el-form :model="userForm"
               status-icon
               :rules="rules"
               ref="userForm"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="用户名：">
          <el-input type="text"
                    clearable
                    disabled
                    v-model="account"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="旧密码："
                      prop="oldPass">
          <el-input type="password"
                    clearable
                    v-model="userForm.oldPass"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码："
                      prop="newPass">
          <el-input type="password"
                    clearable
                    v-model="userForm.newPass"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码："
                      prop="checkPass">
          <el-input type="password"
                    clearable
                    v-model="userForm.checkPass"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm('userForm')"
                     class="submitBtn">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'AccountSet',
  data() {
    return {
      userForm: {
        oldPass: '',
        newPass: '',
        checkPass: ''
      },
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token'),
      rules: {
        oldPass: [
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
      }
    };
  },
  methods: {
    // 认证旧密码
    checkOldPass(rule, value, callback) {
      callback();
      /* this.$axios.post(this.API.ROLECHECKNAME_API + '?id=' + (this.roleId ? this.roleId : '') + '&name=' + this.addForm.name)
        .then((res) => {
          if (res.data.body == true && this.addForm.name !== '') {
            callback(new Error('旧密码输入错误！'))
          } else {
            callback()
          }
        })
        .catch((error) => {
          console.log(error)
        }) */
    },
    // 确认两次新密码输入是否一致
    checkNewPass(rule, value, callback) {
      if (value !== this.userForm.newPass) {
        callback(new Error('两次密码输入不一致！'));
      } else {
        callback();
      }
    },
    // 保存账户修改
    submitForm(userData) {
      this.$refs[userData].validate((valid) => {
        if (valid) {
          let obj = {
            account: this.account,
            login_token: this.login_token,
            login_pwd: this.userForm.newPass
          };
          this.$axios.postFormData(this.API.SETMANAGEPWD_API, obj)
            .then((res) => {
              if (res.success === true) {
                this.$message({
                  message: res.message,
                  type: 'success'
                });
                this.$router.push({ path: '/' });
              } else {
                this.$message.error(res.message);
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
    }
  }
};
</script>
<style lang="scss" scoped>
.accountSet {
  height: calc(100% - 50px);
  .el-form {
    width: 400px;
    padding-top: 100px;
  }
}
</style>
<style lang="scss">
.accountSet {
  .el-card {
    .el-card__body {
      height: calc(100% - 40px);
      background: #f0f0f0;
      //background: url("../../assets/images/bg.jpg");
      display: flex;
      justify-content: center;
      /*  align-items: center; */
      .el-form {
        .el-form-item__content {
          text-align: center;
        }
      }
    }
  }
}
</style>
