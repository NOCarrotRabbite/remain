<template>
  <el-menu router
           :default-active="currentActive"
           class="el-menu-vertical-demo sidebar"
           @open="handleOpen"
           @close="handleClose"
           background-color="#545c64"
           text-color="#fff"
           active-text-color="#ffd04b">
    <template v-for="item in sideitem">
      <el-menu-item :key="item.name"
                    :index="item.route_link">
        <i :class="item.icon"></i>
        <span slot="title"
              class="title">{{item.title}}</span>
      </el-menu-item>
    </template>
  </el-menu>

</template>

<script>
/* eslint-disable */
import { sidebar } from '@/store/sidebar-nav.js'
export default {
  created () {
    this.$root.$on('changeSidebar', value => {
      if (!!value) {
        this.key = value;
        this.sideitem = sidebar[value];
      }
    });
    this.refreshConsole();
  },
  data () {
    return {
      key: null,
      sideitem: null,
      routeLast: this.$route.path.split('/').reverse()[0]
    }
  },
  computed: {
    currentActive () {
      /* if (this.routeLast === 'dashboard') {
        return '/permission/permission_set'
      } */
      return '/' + this.$route.path.split('/').reverse()[1] + '/' + this.$route.path.split('/').reverse()[0];
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath);
    },
    refreshConsole () {
      if (this.routeLast !== 'dashboard') {
        let param = this.$route.path.split('/').reverse()[1];
        this.sideitem = sidebar[param];
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 200px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 60px;
  i {
    padding-left: 6px;
  }
  .title {
    color: #ccc;
    padding-left: 11px;
  }
  .iconfont {
    font-size: 20px;
  }
}
</style>
