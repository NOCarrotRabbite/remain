<template>
  <div class="contentBox">
    <template>
      <el-breadcrumb class="app-breadcrumb"
                     separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item)  in levelList"
                            :key="item.path">
          <router-link v-if="item.meta.title"
                       :to="item.redirect||item.path">{{item.meta.title}}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      levelList: null,
    };
  },
  methods: {
    /**
     * 生成面包屑的方法
     */
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name);

      this.levelList = matched;
    }
  },
  mounted() {
    this.getBreadcrumb();
  },
  watch: {
    $route(to, from) {
      this.getBreadcrumb();
    }
  }
};
</script>
<style lang="scss">
.contentBox {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 30px 60px 20px 60px;
  overflow: scroll;
  .app-breadcrumb {
    margin-bottom: 30px;
  }
}
</style>
