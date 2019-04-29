<template>
  <div class="nav-container">
    <div class="nav-left logo">
      <img src="@/assets/images/wusheng-logo.png"
           width="184"
           height="46px" />
    </div>
    <div class="nav-middle">
      <el-menu :default-active="currentNavActive"
               class="el-menu-demo"
               mode="horizontal"
               @select="handleSidebar"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b">
        <el-menu-item index="user"><span class="title">用户</span></el-menu-item>
        <el-menu-item index="charge"><span class="title">充值</span></el-menu-item>
        <el-menu-item index="operative"><span class="title">运营</span></el-menu-item>
        <el-menu-item index="spread"><span class="title">推广</span></el-menu-item>
        <el-menu-item index="control"><span class="title">控制</span></el-menu-item>
        <el-menu-item index="permission"><span class="title">权限</span></el-menu-item>
      </el-menu>
    </div>
    <div class="nav-right">
      <i class="iconfont icon-yonghu2"
         @click="userSet"></i>
      <span class="username"
            @click="userSet">{{userName}}</span>
      <span class="separate">|</span>
      <i class="iconfont icon-tuichu4"
         @click="logOut"></i>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { sidebar } from '@/store/sidebar-nav.js'
export default {
  data () {
    return {
      userName: localStorage.getItem('currentUser_name')
    }
  },
  computed: {
    currentNavActive () {
      if (this.$route.path.split('/').reverse()[0] === 'dashboard') {
        return 'permission';
      }
      return this.$route.path.split('/').reverse()[1];
    }
  },
  created () {
  },
  methods: {
    handleSidebar (key) {
      this.$root.$emit('changeSidebar', key);
      this.$router.push({ path: sidebar[key][0].route_link });
    },
    //退出登录
    logOut () {
      this.$confirm('您确定退出登录吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: '',
        center: true
      }).then(() => {
        this.$store.commit('LOGOUT');
        this.$router.push('/');
      }).catch((error) => {
        console.log(error);
      });
    },
    userSet () {
      this.$router.push({ path: '/permission/account_set' });
    }
  }
}
</script>
<style lang="scss" scoped>
.nav-container {
  width: 100%;
  height: 60px;
  position: absolute;
  left: 0;
  top: 0;
  background-color: #545c64;
  color: #fff;
  line-height: 60px;
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-wrap: nowrap;
  justify-content: space-between;
  .el-menu {
    .el-menu-item {
      .title {
        color: #ccc;
      }
    }
  }
  .el-menu {
    .is-active {
      border-bottom-color: #c23531 !important;
    }
  }
  .nav-left {
    font-size: 1.2em;
    font-weight: bold;
    width: 210px;
    min-width: 210px;
    padding-left: 14px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  .nav-right {
    width: 200px;
    display: flex;
    align-items: center;
    .line {
      font-size: 1.5em;
    }
    .iconfont {
      font-size: 28px;
      padding-right: 10px;
    }
    /* .icon-tuichu4, */
    .username,
    .icon-yonghu2 {
      /*  color: rgba($color: #ccc, $alpha: 0.8); */
      cursor: pointer;
    }
    .icon-tuichu4 {
      color: rgba($color: #ccc, $alpha: 0.8);
      cursor: pointer;
    }
    .separate {
      padding: 0 16px;
      font-size: 20px;
      color: rgba($color: #ccc, $alpha: 0.8);
    }
  }
  .nav-middle {
    flex-grow: 2;
    padding-left: 50px;
    min-width: 340px;
  }
}
</style>
