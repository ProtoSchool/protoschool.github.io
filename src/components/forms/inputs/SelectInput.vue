<template>
  <div class="select-input mw5">
    <label for="id" class="mr3">{{label}}</label>
    <v-select
      :name="name"
      :id="id"
      :options="selectOptions"
      :value="value"
      @input="value => $emit('input', value)"
      label="name"
      :searchable="false"
      :clearable="false"
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
    options: Object,
    label: String
  },
  computed: {
    selectOptions: function () {
      return Object.values(this.options)
    }
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

.select-input label {
  text-align: left;
}
/*
.select-input select {
  background-color: lightgray;
  border: none;
} */

.select-input .v-select {
  min-width: 180px;
}

.select-input .vs__search::placeholder,
.select-input .vs__dropdown-toggle,
.select-input .vs__dropdown-menu {
  background: var(--color-snow);
  border: none;
  color: var(--color-navy-muted);
}

.select-input .vs__clear,
.select-input .vs__open-indicator {
  fill: var(--color-navy);
}
</style>
