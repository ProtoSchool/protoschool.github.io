<template>
  <button
    v-on:click="click"
    class="avenir dib v-mid fw7 nowrap lh-copy bn br1 pv2 ph3 pointer focus-outline">
    <slot>Submit</slot>
  </button>
</template>

<script>
export default {
  props: {
    click: {
      type: Function,
      required: true
    }
  }
}
</script>

<style scoped>
button {
  opacity: 0.9;
  min-width: 120px;
}

button:hover {
  opacity: 1;
}

button:active {
  opacity: 0.95;
  box-shadow: inset 0 0 8px rgba(0,0,0,0.3);
}

button:disabled {
  opacity: 0.95;
  box-shadow: initial;
  cursor: default;
  color: #b9c4cd;
  background-color: #8498a6;
}
</style>
