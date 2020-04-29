<template>
  <label
    class="form-input"
    :data-disabled="disabled"
    :data-error="error"
    :data-error-message="errorMessage"
    tabindex="-1"
  >
    <input
      :type="type || 'text'"
      :name="name"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('input', $event.target.value.trim())"
      @blur="onBlur"
      class="input-reset br1 ph3 f5 b--light-gray navy fw5"
    />
  </label>
</template>
<script>
export default {
  props: {
    type: String,
    name: String,
    value: String,
    placeholder: String,
    required: Boolean,
    disabled: Boolean,
    error: Boolean,
    customErrorMessage: String,
    input: Object,
    onBlur: Function
  },
  computed: {
    errorMessage: function () {
      if (this.required && !this.input.required) {
        return 'Field is required.'
      }

      return this.customErrorMessage || null
    }
  }
}
</script>
<style scoped>
.form-input {
  position: relative;
  outline: none;
}

.form-input input {
  width: 100%;
  height: 100%;
  background: white !important;
  border: var(--border-default);
  outline: none;

  transition:
    opacity var(--transition-default),
    border-color var(--transition-default),
    background-color var(--transition-default),
    box-shadow var(--transition-default),
    color var(--transition-default);
}

.form-input input::placeholder {
  color: var(--color-gray);
}

/* States */
.form-input input:hover {
  box-shadow: var(--shadow-light);
}

.form-input input:focus {
  border-color: var(--color-navy);
  box-shadow: var(--shadow-light);
}

.form-input[data-error] input {
  border-color: var(--color-red);
  color: var(--color-red);
}

.form-input input:disabled {
  opacity: 0.5;
  box-shadow: none;
}

/* Error message: ::before -> triangle, ::after -> message box */
.form-input {
  --arrow-size: 0.5rem;
  --arrow-left-spacing: 0.8rem;
  --animation-translate: 3px;
}

/* Error message box triangle */
.form-input::before {
  content: '';
  position: absolute;
  z-index: 1;

  top: calc(100% + var(--arrow-size) + 1px);
  left: 0;
  transform-origin: 0 0;
  transform: translate(var(--arrow-left-spacing), calc(var(--animation-translate))) rotateZ(-45deg);

  height: var(--arrow-size);
  width: var(--arrow-size);
  border-radius: var(--border-radius-default);

  opacity: 0;
  visibility: hidden;
  background: var(--color-red);

  transition:
    opacity var(--transition-fast),
    visibility var(--transition-fast),
    transform var(--transition-fast);
}

/* Error message box */
.form-input::after {
  content: attr(data-error-message);
  position: absolute;
  z-index: 1;

  top: calc(100% + var(--arrow-size));
  left: 0;
  transform: translateY(var(--animation-translate));

  padding: 0.3rem 0.6rem;
  border-radius: var(--border-radius-default);

  opacity: 0;
  visibility: hidden;
  background: var(--color-red);
  color: var(--color-snow-muted);

  font-size: 14px;

  transition:
    opacity var(--transition-fast),
    visibility var(--transition-fast),
    transform var(--transition-fast);
}

.debug .form-input::before,
.debug .form-input::after {
  opacity: 0.6;
  visibility: visible;
}

.form-input[data-error]::before,
.form-input[data-error]::after {
  opacity: 1;
  visibility: visible;
}

.form-input[data-error]::before {
  transform: translate(var(--arrow-left-spacing), 0) rotateZ(-45deg);
}

.form-input[data-error]::after {
  transform: translateY(0);
}

</style>
