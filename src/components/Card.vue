<template>
  <div class="card br3">
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  box-shadow: var(--shadow-default);
  transform: translateY(0);

  transition:
    box-shadow var(--transition-slow),
    transform var(--transition-slow);
}

.card:hover,
.card:focus-within {
  box-shadow: var(--shadow-focus);
  transform: translateY(-3px);
}
</style>
