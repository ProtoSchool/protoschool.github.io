<template>
  <div id="wrapper" class="mw5">
    <label for="id">{{label}}</label>
    <select
      :name="name"
      :id="id"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)">
      <option
        v-for="(option, optionName) in options"
        :value="optionName"
        v-bind:key="option.name"
      >
        {{option.name}} ({{option.count}})
      </option>
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
  }
}
</script>

<style scoped>

#wrapper {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
}

label {
  display: none;
}

select {
  background-color: lightgray;
  border: none;
}

</style>
