<template>
  <button
    class="close"
    :title="title"
    v-on:click="onDismiss"
    :aria-label="ariaLabel || title"
  >
    <CloseIcon :alt="imageAlt || ariaLabel || title" />
  </button>
</template>

<script>
import CloseIcon from '../../static/images/close.svg?inline'

export default {
  components: {
    CloseIcon
  },
  props: {
    title: String,
    imageAlt: String,
    ariaLabel: String,
    onDismiss: Function
  }
}
</script>

<style scoped>
/*
  Parent needs to have position != static
 */
button.close {
  --position: 0.4rem;

  position: absolute;
  top: var(--position);
  right: var(--position);
  transform: scale(0.95);

  padding: 0.5rem;
  background: none;
  border: none;
  line-height: 0;
  -webkit-tap-highlight-color: transparent; /* hide tap highlight on webkit browers */

  cursor: pointer;

  transition:
    transform var(--transition-default),
    opacity var(--transition-default);
}

button.close:hover,
button.close:focus,
button.close:active {
  opacity: 1;
  transform: scale(1);
}

button.close:active {
  transform: scale(0.95);
}

button.close {
  opacity: 0.2;
}

@media screen and (max-width: 30rem) {
  button.close {
    --position: 0.3rem;

    opacity: 0.8;
    transform: scale(0.8);
  }
}

</style>
