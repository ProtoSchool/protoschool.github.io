<template>
  <div id="app">
    <router-view :key="$route.path"></router-view>
    <portal-target name="modal"></portal-target>
  </div>
</template>

<script>
import './styles/index.css'
import head from './utils/head'

export default {
  name: 'app',
  head: head.root()
}
</script>

<style>

*,
*::before,
*::after {
    box-sizing: border-box;
}

/*
   Document

   1. Stretch <html> stretch to fill our screen height
   2. Make children of html (body) occupy at least 100% of the screen
   3. Viewport is scalable and occupies at least 320px (iPhone SE)
*/

html {
    min-width: 25em;
    height: 0; /* 3 */
    min-height: 100%; /* 1 */
    display: flex; /* 2 */
    flex-direction: column; /* 2 */
}

/*
   Body & #app

   1. Force scroll always to prevent scrollbars to appear/disappear based on the page contents
   2. Make sure that we occupy 100% of our parent and allow our child elements to do the same
   3. Disable rubber band scrolling
*/

body {
    overflow-y: scroll; /* 1 */
    display: flex; /* 2 */
    flex: 1 0 auto; /* 2 */
    flex-direction: column; /* 2 */
}

#app {
  display: flex; /* 2 */
  flex: 1 0 auto; /* 2 */
  flex-direction: column; /* 2 */

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app > div {
  display: flex; /* 2 */
  flex: 1 0 auto; /* 2 */
  flex-direction: column; /* 2 */
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
