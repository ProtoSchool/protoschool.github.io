<template>
  <div id="app">
    <router-view :key="$route.path"></router-view>
  </div>
</template>

<script>
import './styles/index.css'

export default {
  name: 'app'
}
</script>

<style>

html {
  overflow-y: scroll;
}

html, body {
  min-height: 100%;
}

#app {
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app > div {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

pre {
  overflow: auto;
}

.focus-outline:focus {
  outline: 0;
  box-shadow: 0 0 0 .2rem rgba(201, 210, 215, .4);
}

.code, code {
  border-radius: 3px;
  background-color: rgba(27,31,35,0.05);
  padding: 0.1rem 0.3rem 0.15rem;
  margin: 0 -0.1rem;
  font-size: 85%;
  font-family: SFMono-Regular, Monaco, Consolas, "Liberation Mono", "Courier New", monospace
}

pre code {
  margin: 0.5rem 0;
  padding: 0.6rem 0.8rem;
  display: block;
  font-size: 12px;
  overflow: auto;
}

.fill-current {
  fill: currentColor;
}

* {
  outline-color: var(--color-teal-muted);
}
</style>
