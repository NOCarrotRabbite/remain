<template>
  <div class="login">
    <div class="loginFormBox">
      <p class="logo">
        <img src="../../assets/images/wusheng-logo.png"
             alt=""></p>
      <el-form :model="formData"
               :rules="rules"
               ref="loginForm">
        <el-form-item prop="account">
          <el-input v-model="formData.account"
                    @keyup.enter.native="submit"
                    placeholder="请输入用户名"
                    autofocus
                    clearable>
            <i slot="prefix"
               class="iconfont icon-yonghu1"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formData.password"
                    placeholder="请输入密码"
                    @keyup.enter.native="submit"
                    clearable
                    type="password">
            <i slot="prefix"
               class="iconfont icon-mima"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div class="loginBtn"
               @click="submit">登 录</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      formData: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' },
          /*  { validator: this.validatePass, trigger: 'blur' } */
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' },
          /*   { validator: this.validatePass, trigger: 'blur' } */
        ]
      }
    };
  },
  created() {
    console.log('500000', this.common.convertCurrency(500000));
  },
  methods: {
    /*  ...mapMutations(['tokenEdit']), */
    // 登录
    submit() {
      // 验证成功
      const that = this;
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$axios.postFormData(this.API.LOGIN_API, this.formData)
            .then((res) => {
              if (res.success === true) {
                this.$store.commit('LOGIN', res.login_token);
                this.$store.commit('SET_USER', res.account);
                this.$message({
                  message: '登录成功！',
                  type: 'success'
                });
                // 跳转到页面
                this.$router.push({ path: '/user/online_user' });
              } else {
                this.$message.error(res.message || '登录失败，请重试！');
              }
            });
        } else {
          this.$message.error('请正确填写表单！');
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss"  scoped>
div {
  box-sizing: border-box;
}
.login {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: /* rgba(84, 92, 100, 0.8); */ url("../../assets/images/bg.png");
  display: flex;
  justify-content: center;
  align-items: center;
  .loginFormBox {
    width: 360px;
    height: 320px;
    padding: 20px 40px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    .logo {
      padding: 10px 0 30px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      /* color: rgba(84, 92, 100, 0.8); */
    }
    .iconfont {
      font-size: 24px;
      padding-left: 4px;
      color: #fff;
    }
    .loginBtn {
      margin-top: 20px;
      text-align: center;
      font-size: 16px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }
    .loginBtn:hover {
      background: rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
<style lang="scss">
.login {
  .el-input__inner {
    padding-left: 40px;
    background: transparent;
    color: #fff;
  }
}
</style>
