<template>
  <div id="wrapper" class="mw5">
    <label for="id" class="mr3">{{label}}</label>
    <v-select
      :name="name"
      :id="id"
      :options="selectOptions"
      :value="value"
      @input="value => $emit('input', value)"
      label="name"
      :searchable="false"
    />
      <!-- <template v-slot:option="option">
        <option
          :value="option.name"
          v-bind:key="option.name"
        >
          {{option.name}} ({{option.count}})
        </option>
      </template>
    </v-select> -->
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
      return Object.values(this.options).map(option => ({
        key: option.key,
        name: `${option.name} (${option.count})`,
        count: option.count
      }))
    }
  }
}
</script>

<style scoped>

#wrapper {
  display: flex;
  border-radius: 10px;
  justify-content: flex-start;
  align-items: center;
}

label {
  text-align: left;
}

select {
  background-color: lightgray;
  border: none;
}

.v-select {
  min-width: 180px;
}

</style>
