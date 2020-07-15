<template>
<label
  :class="className"
  class="flex flex-row items-center"
  :for="computedId"
  tabindex="0"
  @keydown.space.prevent="keyToggle"
>
  <span class="external-label-left fw5" v-if="label">{{label}}</span>
  <div class="dib">
    <input
      type="checkbox"
      class="v-switch-input"
      :name="name"
      :checked="value"
      :disabled="disabled"
      @change.stop="toggle"
      :id="computedId"
    >
    <div
      class="v-switch-core"
      :style="coreStyle"
    >
      <div
        class="v-switch-button"
        :style="buttonStyle"
      />
    </div>
    <template v-if="labels">
      <span
        class="v-switch-label v-left"
        :style="labelStyle"
        v-if="toggled"
      >
        <slot name="checked">
          <template>{{labelChecked}}</template>
        </slot>
      </span>
      <span
        class="v-switch-label v-right"
        :style="labelStyle"
        v-else
      >
        <slot name="unchecked">
          <template>{{labelUnchecked}}</template>
        </slot>
      </span>
    </template>
  </div>
</label>
</template>

<script>

// adapted from https://github.com/euvl/vue-js-toggle-button/blob/master/src/utils.js

const isString = (value) => {
  return typeof value === 'string'
}

const isObject = (value) => {
  return typeof value === 'object'
}

const has = (object, key) => {
  return isObject(object) && object.hasOwnProperty(key)
}

const get = (object, key, defaultValue) => {
  return has(object, key) ? object[key] : defaultValue
}

const px = value => {
  return `${value}px`
}

const translate = (x, y) => {
  return `translate(${x}, ${y})`
}

// adapted from https://github.com/euvl/vue-js-toggle-button/blob/master/src/Button.vue

const DEFAULT_COLOR_CHECKED = '#75c791'
const DEFAULT_COLOR_UNCHECKED = '#bfcbd9'
const DEFAULT_LABEL_CHECKED = 'on'
const DEFAULT_LABEL_UNCHECKED = 'off'
const DEFAULT_SWITCH_COLOR = '#fff'

export default {
  name: 'ToggleButton',

  props: {
    label: {
      type: String
    },
    id: {
      type: String
    },
    value: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String
    },
    sync: {
      type: Boolean,
      default: false
    },
    speed: {
      type: Number,
      default: 300
    },
    color: {
      type: [String, Object],
      validator (value) {
        return isString(value) ||
          has(value, 'checked') ||
          has(value, 'unchecked') ||
          has(value, 'disabled')
      }
    },
    switchColor: {
      type: [String, Object],
      validator (value) {
        return isString(value) ||
          has(value, 'checked') ||
          has(value, 'unchecked')
      }
    },
    cssColors: {
      type: Boolean,
      default: false
    },
    labels: {
      type: [Boolean, Object],
      default: false,
      validator (value) {
        return typeof value === 'object'
          ? (value.checked || value.unchecked)
          : typeof value === 'boolean'
      }
    },
    height: {
      type: Number,
      default: 22
    },
    width: {
      type: Number,
      default: 50
    },
    margin: {
      type: Number,
      default: 3
    },
    fontSize: {
      type: Number
    },
    onClick: {
      type: Function
    }
  },
  computed: {
    computedId () {
      // associate HTML label to input using id if passed, name if passed or nothing if
      return (this.id || this.name || null)
    },
    className () {
      let { toggled, disabled } = this

      return ['vue-js-switch', {
        toggled,
        disabled
      }]
    },
    coreStyle () {
      return {
        width: px(this.width),
        height: px(this.height),
        backgroundColor: this.cssColors
          ? null
          : (this.disabled ? this.colorDisabled : this.colorCurrent),
        borderRadius: px(Math.round(this.height / 2))
      }
    },
    buttonRadius () {
      return this.height - this.margin * 2
    },
    distance () {
      return px(this.width - this.height + this.margin)
    },
    buttonStyle () {
      const transition = `transform ${this.speed}ms`
      const margin = px(this.margin)
      const transform = this.toggled
        ? translate(this.distance, margin)
        : translate(margin, margin)
      const background = this.switchColor
        ? this.switchColorCurrent
        : null
      return {
        width: px(this.buttonRadius),
        height: px(this.buttonRadius),
        transition,
        transform,
        background
      }
    },
    labelStyle () {
      return {
        lineHeight: px(this.height),
        fontSize: this.fontSize ? px(this.fontSize) : null
      }
    },
    colorChecked () {
      let { color } = this
      if (!isObject(color)) {
        return color || DEFAULT_COLOR_CHECKED
      }
      return get(color, 'checked', DEFAULT_COLOR_CHECKED)
    },
    colorUnchecked () {
      return get(this.color, 'unchecked', DEFAULT_COLOR_UNCHECKED)
    },
    colorDisabled () {
      return get(this.color, 'disabled', this.colorCurrent)
    },
    colorCurrent () {
      return this.toggled
        ? this.colorChecked
        : this.colorUnchecked
    },
    labelChecked () {
      return get(this.labels, 'checked', DEFAULT_LABEL_CHECKED)
    },
    labelUnchecked () {
      return get(this.labels, 'unchecked', DEFAULT_LABEL_UNCHECKED)
    },
    switchColorChecked () {
      return get(this.switchColor, 'checked', DEFAULT_SWITCH_COLOR)
    },
    switchColorUnchecked () {
      return get(this.switchColor, 'unchecked', DEFAULT_SWITCH_COLOR)
    },
    switchColorCurrent () {
      if (!isObject(this.switchColor)) {
        return this.switchColor || DEFAULT_SWITCH_COLOR
      }
      return this.toggled
        ? this.switchColorChecked
        : this.switchColorUnchecked
    }
  },
  watch: {
    value (value) {
      if (this.sync) {
        this.toggled = !!value
      }
    }
  },
  data () {
    return {
      toggled: !!this.value
    }
  },
  methods: {
    toggle (event) {
      const toggled = !this.toggled
      if (!this.sync) {
        this.toggled = toggled
      }
      this.onClick()
      this.$emit('input', toggled)
      this.$emit('change', {
        value: toggled,
        tag: this.tag,
        srcEvent: event
      })
    },
    keyToggle (event) {
      // the key event happens whether the control is disabled or not
      // nothing should be done if disabled is true
      if (this.disabled) {
        return
      }
      this.toggle(event)
    }
  }
}
</script>

<style scoped>
.vue-js-switch {
  position: relative;
  vertical-align: middle;
  user-select: none;
  font-size: 10px;
  cursor: pointer;
}

.vue-js-switch .external-label-left {
  font-size: 1rem;
  margin-right: 10px;
  height: 100%;
  display: inline-block;
}

.vue-js-switch .v-switch-input {
  opacity: 0;
  position: absolute;
  width: 1px;
  height: 1px;
}

.vue-js-switch .v-switch-label {
  position: absolute;
  top: 0;
  font-weight: 600;
  color: white;
  z-index: 1;
}

.vue-js-switch .v-switch-label.v-left {
  left: 10px;
}

.vue-js-switch .v-switch-label.v-right {
  right: 10px;
}

.vue-js-switch .v-switch-core {
  display: block;
  position: relative;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: border-color .3s, background-color .3s;
  user-select: none;
  }

.vue-js-switch .v-switch-core .v-switch-button {
  display: block;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  border-radius: 100%;
  background-color: #fff;
  z-index: 2;
}

.vue-js-switch.disabled {
  pointer-events: none;
  opacity: 0.6;
}

</style>
