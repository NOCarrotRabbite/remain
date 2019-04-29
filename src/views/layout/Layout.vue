<template>
  <div class="layout-container">
    <Navbar />
    <Sidebar />
    <Main-content />
  </div>
</template>

<script>
import { Navbar, Sidebar, MainContent } from '@/views/layout';

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    MainContent,
  },
};


</script>

<style lang="scss">
.layout-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 60px;
  padding-left: 200px;
}
</style>
