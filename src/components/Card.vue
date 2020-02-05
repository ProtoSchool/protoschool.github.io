<template>
  <div class="card br3">
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0px 2px 8px 0 rgba( 0, 0, 0, .2 );
  transform: translateY(0);

  transition:
    box-shadow 400ms,
    transform 400ms;
}

.card:hover,
.card:focus-within {
  box-shadow: 0px 2px 16px 0 rgba( 0, 0, 0, .2 );
  transform: translateY(-3px);
}
</style>
