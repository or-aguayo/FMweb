<template>
  <div id="app" v-if="$screen.width >= 960">
    <router-view/>
  </div>
  <div v-else>
    Your screen is not compatible with FMweb - Vari::Ation.
  </div>
</template>

<script>
  import Vue from 'vue';

  Vue.prototype.$screen = Vue.observable({
      width: window.innerWidth,
      height: window.innerHeight
  });

  window.addEventListener('resize', () => {
      Vue.prototype.$screen.width = window.innerWidth;
      Vue.prototype.$screen.height = window.innerHeight;
  });

  export default({
    mounted(){
      localStorage.clear();
    }
  })
</script>

<style>
  #app {
    height: 100%;
    width: 100%;
    font-family: Arial, Helvetica, sans-serif;
  }

  html, body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }
</style>
