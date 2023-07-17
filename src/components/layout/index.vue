<template>
  <el-container class="layoutContainer">
    <SidebarComponent/>
    <el-container>
      
      <el-main>
        <transition name="fade-transform" mode="out-in">
          <keep-alive>
            <router-view/>
          </keep-alive>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SidebarComponent from '@/components/layout/sidebar';

export default {
  name: 'LayoutComponent',
  components: {
    SidebarComponent,
  }
}
</script>

<style lang="scss">
.layoutContainer {
  width: 100%;
  height: 100%;

  .el-header {
    padding: 0;
  }

  .el-menu {
    height: 100%;
  }

  .el-main {
    padding: 5px;
  }
}
</style>
