<template>
  <div class="select-input mw5">
    <label for="id" class="mr3 fw5">{{label}}</label>
    <v-select
      :name="name"
      :id="id"
      :options="options"
      :value="value"
      @input="value => $emit('input', value)"
      label="name"
      :searchable="false"
      :clearable="false"
      :data-cy="dataCy"
    />
  </div>
</template>

<script>
export default {
  name: 'SelectInput',
  props: {
    id: String,
    name: String,
    value: Object,
    options: Array,
    label: String,
    dataCy: String
  }
}
</script>

<style>

.select-input {
  display: flex;
  border-radius: 10px;
  justify-content: flex-start;
  align-items: center;
}

label {
  text-align: left;
}

.v-select {
  min-width: 180px;

  font-weight: 500;
  color: var(--color-navy-muted);
}

.vs__dropdown-toggle {
  padding-left: 0.4rem;
  padding-right: 0.4rem;
}

.vs__search::placeholder,
.vs__dropdown-toggle,
.vs__dropdown-menu {
  background: var(--color-snow);
  border: none;
}

.vs__selected {
  color: var(--color-navy-muted);

  transition:
    opacity var(--transition-fast);
}

.vs__open-indicator {
  fill: var(--color-navy);
}

.vs__dropdown-menu {
  padding: 0;
}

.vs__dropdown-option {
  padding: 0.6rem 1rem;
  background: var(--color-snow-muted);
  color: var(--color-navy-muted);

  transition:
    background var(--transition-default),
    color var(--transition-default);
}

.vs__dropdown-option--highlight {
  background: var(--color-snow);
  color: var(--color-navy);
}
</style>
