<template>
  <label
    class="form-checkbox flex flex-row items-start f7 outline-focus"
    tabindex="0"
    :data-disabled="disabled"
    @keypress="$emit('change', !checked)"
  >
    <input
      class="input-reset br1 ph3 f5 b--light-gray navy fw6"
      :checked="checked"
      :disabled="disabled"
      :data-error="error"
      @change="$emit('change', $event.target.checked)"
      type="checkbox"
      tabindex="-1"
    />
    {{label}}
  </label>
</template>

<script>
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean,
    disabled: Boolean,
    label: String,
    error: Boolean
  },
  methods: {
    onChange: function ($event) {
      this.$emit('change', $event.target.checked)
    }
  }
}
</script>

<style scoped>
.form-checkbox {
  user-select: none;
  line-height: 1rem;

  transition:
    color var(--transition-fast),
    opacity var(--transition-fast);
}

.form-checkbox input {
  /* more input reset styles */
  padding: 0;
  margin: 0 .5rem 0 0;

  min-height: 1rem;
  min-width: 1rem;

  background: white;
  border: var(--border-default);
  outline: none;

  transition:
    background var(--transition-fast),
    border var(--transition-fast);
}

/* states */

.form-checkbox[data-error] {
  color: var(--color-red);
}

.form-checkbox[data-error] input {
  border-color: var(--color-red);
}

.form-checkbox input:checked  {
  background: var(--color-navy);
}

.form-checkbox[data-disabled] {
  opacity: 0.5;
}
</style>
