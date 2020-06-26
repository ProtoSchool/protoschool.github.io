<template>
  <div>
    <label for="id">{{label}}</label>
    <select
      name="name"
      id="id"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)">
      <option v-for="(option, optionName) in options" :value="optionName">{{option.name}} ({{option.count}})</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'SelectInput',
  props: {
    id: String,
    name: String,
    value: String,
    options: Object,
    label: String
  },
}
</script>
