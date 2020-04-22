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
  transition:
    color var(--transition-fast),
    opacity var(--transition-fast);
  user-select: none;
}

.form-checkbox input {
  min-height: 1rem;
  max-height: 1rem;
  min-width: 1rem;
  max-width: 1rem;

  background: white;
  border: var(--border-default);
  outline: none;

  transition:
    background var(--transition-fast),
    border var(--transition-fast);

  /* more input reset styles */
  padding: 0;
  margin: 0 .5rem 0 0;
}

.form-checkbox[data-error] {
  color: var(--color-red);
}

.form-checkbox[data-error] input {
  border-color: var(--color-red);
}

/* states */

.form-checkbox input:checked  {
  background: var(--color-navy);
}

.form-checkbox[data-disabled] {
  opacity: 0.5;
}
</style>
