<template>
  <el-pagination @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
                 :current-page="currentPage"
                 :page-size="pageSize"
                 layout="total, prev, pager, next,jumper"
                 :total="total"
                 class="paginationBox">
  </el-pagination>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
    };
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('sizeChange', {
        currentPage: this.currentPage,
        pageSize: val
      });
    },
    handleCurrentChange(val) {
      this.$emit('currentPage', {
        currentPage: val,
        pageSize: this.pageSize
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.paginationBox {
  width: calc(100%-220px);
  background: #fff;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 200px;
  right: 20px;
  padding: 20px 0px;
  z-index: 99;
}
</style>
