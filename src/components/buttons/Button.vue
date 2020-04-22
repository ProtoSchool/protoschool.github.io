<template>
  <button
    class="avenir dib v-mid fw7 nowrap lh-copy bn br1 pv2 ph3 pointer bg-navy white outline-focus"
    @click="click"
    @blur="blur"
    :data-type="type"
    :data-loading="loading"
    :type="type"
    :disabled="loading || disabled"
    >
    <router-link v-if="link" :to="{ name: link }">
      <slot>{{text}}</slot>
    </router-link>
    <span v-if="!link" class="loader"></span>
    <span v-if="!link" class="text">{{text}}</span>
  </button>
</template>

<script>
export default {
  props: {
    link: String,
    text: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'primary'
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    click: {
      type: Function,
      default: () => {}
    },
    blur: {
      type: Function,
      default: () => {}
    }
  }
}
</script>

<style scoped>
button {
  position: relative;
  opacity: 0.9;
  min-width: 120px;
  box-shadow: inset 0 0 8px rgb(0 0 0 / 0%);
  outline: none;

  transition:
    box-shadow var(--transition-default),
    opacity var(--transition-default),
    background-color var(--transition-default);
}

button .text {
  transition:
    opacity var(--transition-default),
    visibility var(--transition-default);
}

/* States */
button:hover {
  opacity: 1;
}

button:active {
  opacity: 0.95;
  box-shadow: inset 0 0 8px black;
  background-color: var(--color-navy-muted);
}

button:disabled {
  opacity: 0.95;
  box-shadow: initial;
  cursor: default;
  color: #b9c4cd;
  background-color: #8498a6;
}

button[data-loading="true"] {
  opacity: 0.6;
}

button[data-loading="true"] .text {
  opacity: 0;
  visibility: hidden;
}

/* Types */
button[data-type="secondary"] {
  background-color: var(--color-aqua);
}

button[data-type="secondary"]:active {
  box-shadow: inset 0 0 8px rgb(0 0 0 / 30%);
  background-color: var(--color-aqua-muted);
}

/*
  Loading animation
 */
.loader,
.loader::before,
.loader::after {
  width: 2em;
  height: 2em;
  border-radius: 50%;

  opacity: 0;
  visibility: hidden;
  background-color: transparent;

  animation-fill-mode: both;
  animation: loadAnim 1.5s infinite ease-in-out;
  animation-play-state: paused;

  transition:
    opacity var(--transition-default),
    visibility var(--transition-default);
}

button[data-loading="true"] .loader,
button[data-loading="true"] .loader::before,
button[data-loading="true"] .loader::after {
  opacity: 1;
  visibility: visible;
  animation-play-state: running;
}

.loader {
  position: absolute;
  display: block;
  top: calc(50% - 2em);
  left: 50%;

  transform: translate(-50%, -50%);

  margin: 0 auto;
  color: #ffffff;
  font-size: 5px;
  animation-delay: -0.15s;
  pointer-events: none;
}

.loader::before {
  content: '';
  position: absolute;
  left: -3.5em;
  animation-delay: -0.30s;
}

.loader::after {
  content: '';
  position: absolute;
  left: 3.5em;
}

@keyframes loadAnim {
  0%, 80%, 100% {
    box-shadow: 0 2em 0 -1.3em var(--color-snow-muted);
  }
  40% {
    box-shadow: 0 2em 0 0 var(--color-snow-muted);
  }
}
</style>
