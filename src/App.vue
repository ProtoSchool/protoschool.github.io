<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
}
pre {
  overflow: auto;
}

.focus-outline:focus {
  outline: 0;
  box-shadow: 0 0 0 .2rem rgba(201, 210, 215, .4);
}
</style>
