<template>
  <router-link
    v-if="!external"
    :to="link ? { name: link } : to"
    class="inline-flex justify-center avenir dib v-mid fw7 nowrap lh-copy bn br1 pointer bg-navy white outline-focus pv2 ph3"
    :disabled="disabled"
    @click.native="onClick"
    :data-cy="dataCy"
  >
    <slot>{{text}}</slot>
  </router-link>
  <a
    v-else
    :href="link || href"
    target="__blank"
    @click="onClick"
    class="inline-flex justify-center avenir dib v-mid fw7 nowrap lh-copy bn br1 pointer bg-navy white outline-focus pv2 ph3"
    :data-cy="dataCy"
  >
    <slot>{{text}}</slot>
  </a>
</template>

<script>
export default {
  props: {
    link: String,
    to: String,
    href: String,
    external: Boolean,
    text: String,
    type: {
      type: String,
      default: 'primary'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    onClick: {
      type: Function,
      default: () => {}
    },
    dataCy: String
  }
}
</script>

<style scoped>
a {
  position: relative;
  opacity: 0.9;
  min-width: 7.5rem;
  min-height: 2.5rem;
  box-shadow: inset 0 0 8px rgb(0 0 0 / 0%);
  outline: none;
  user-select: none;
  color: white;
  text-decoration: none;

  transition:
    box-shadow var(--transition-default),
    opacity var(--transition-default),
    background-color var(--transition-default);
}

/* States */
a:hover {
  opacity: 1;
}

a:active {
  opacity: 0.95;
  box-shadow: inset 0 0 8px black;
  background-color: var(--color-navy-muted);
}

a:disabled {
  opacity: 0.95;
  box-shadow: initial;
  cursor: not-allowed;
  color: #b9c4cd;
  background-color: #8498a6;
}

/* Types */
a[data-type="secondary"] {
  background-color: var(--color-aqua);
}

a[data-type="secondary"]:active {
  box-shadow: inset 0 0 8px rgb(0 0 0 / 30%);
  background-color: var(--color-aqua-muted);
}
</style>
