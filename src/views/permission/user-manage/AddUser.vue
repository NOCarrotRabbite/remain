<template>
  <div class="addUser">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>新增用户</span>
      </div>
      <el-form :model="userForm"
               status-icon
               :rules="rules"
               ref="userForm"
               label-width="120px"
               class="demo-ruleForm">
        <el-form-item label="创建用户名："
                      prop="username">
          <el-input type="text"
                    clearable
                    v-model="userForm.username"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择角色："
                      prop="roleName">
          <el-select v-model="userForm.roleName"
                     placeholder="请选择角色">
            <el-option :label="items.name"
                       v-for="items in roleData"
                       :key="items.id"
                       :value="items.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建密码："
                      prop="newPass">
          <el-input type="password"
                    clearable
                    v-model="userForm.newPass"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码："
                      prop="checkPass">
          <el-input type="password"
                    clearable
                    v-model="userForm.checkPass"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="">
          <el-button @click="submitForm('userForm')"
                     class="submitBtn">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AddUser',
  data() {
    return {
      userForm: {
        username: '',
        roleName: '',
        newPass: '',
        checkPass: ''
      },
      roleData: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        newPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: this.checkNewPass, trigger: 'blur' }
        ]
      },
      account: localStorage.getItem('currentUser_name'),
      login_token: localStorage.getItem('currentUser_token')
    };
  },
  created() {
    this.tableDataList();
  },
  methods: {
    // 获取角色
    tableDataList() {
      this.tableData = [];
      let obj = {
        account: this.account,
        login_token: this.login_token
      };
      this.$axios.postFormData(this.API.LIST_ROLE_API, obj)
        .then((res) => {
          if (res.success === true) {
            this.roleData = res.data;
          } else {
            this.$message.error(res.message);
            return false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
            manager_account: this.userForm.username,
            role: this.userForm.roleName,
            password: this.userForm.newPass
          };
          this.$axios.postFormData(this.API.ADDMANAGER_API, obj)
            .then((res) => {
              if (res.success === true) {
                this.$message({
                  message: '新增用户成功！',
                  type: 'success'
                });
                this.$router.push({ path: '/permission/user_manage' });
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
.addUser {
  .el-form {
    width: 400px;
    padding-top: 100px;
  }
}
</style>
<style lang="scss">
.addUser {
  height: 100%;
  .el-card {
    .el-card__body {
      height: calc(100% - 40px);
      background: #f0f0f0;
      //background: url("../../assets/images/bg.jpg");
      display: flex;
      justify-content: center;
      .el-form {
        .el-form-item__content {
          text-align: center;
        }
        .el-select {
          width: 100%;
        }
      }
    }
  }
}
</style>
