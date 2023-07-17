<template>
  <el-aside :width="isCollapse ? '64px' : '200px'">
    <el-menu background-color="#263445" text-color="#bfcbd9" router
             :default-active="$route['name']"
             :collapse="isCollapse"
             :collapse-transition="true"
    >
      <a data-v-c28012ce="" class="sidebarLogo">
        <img :src="logo" class="sidebarLogoImg" :class="{sidebarLogoImgCollapse:isCollapse}" alt="logo">
        <h1 class="sidebarTitle" v-if="!isCollapse">FMweb</h1>
      </a>

      <template v-for="router in viewsRouter">
        <el-menu-item :key="router['name']" :index="router['name']">
          <img v-if="router['meta']['icon']" class="menuIcon" :src="router['meta']['icon']" alt=""/>
          <i v-else class="el-icon-menu"/>
          <template v-slot:title>
            <span>
              {{router['meta']['title']}}
            </span>
          </template>
        </el-menu-item>
      </template>
      
    </el-menu>
  </el-aside>
</template>

<script>
  import {viewsRouter} from '@/router'

  export default {
    name: 'SidebarComponent',
    data() {
      return {
        logo: require('@/assets/logo.png'),
      }
    },
    computed: {
      isCollapse() {
        return this.$store.getters.sidebarCollapse
      },
      viewsRouter: () => viewsRouter
    }
  }
</script>

<style lang="scss">
  .menuIcon {
    height: 20px;
    margin-right: 8px;
  }

  .sidebarLogo {
    display: inline-block;
    width: 100%;
    height: 50px;
    overflow: hidden;
    background-color: rgb(30, 42, 55);

    .sidebarLogoImg {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 5px;
      margin-left: 10px;
    }

    .sidebarLogoImgCollapse {
      margin-top: 9px;
      margin-left: 15px;
    }

    .sidebarTitle {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 18px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }
</style>
