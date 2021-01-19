<template>
  <div>
    <h3>{{this.question}}</h3>
    <div class="input-wrapper" v-for="(choice, idx) in this.choices" :key="`choice-${idx}`">
      <input type="radio"
      :id="idx" :value="idx"
      v-model="selected"
      @change="handleRadioClick">
      <span class="radio-button" :data-selected="selected">
      </span>
      <label :for="idx" v-html='parse(choice.answer)' data-cy="choice">
      </label>
    </div>
  </div>
</template>

<script>
import marked from 'marked'

export default {
  name: 'Quiz',
  props: {
    question: String,
    choices: Array,
    selected: String
  },
  mounted: function () {
    this.handleRadioClick(true)
  },
  computed: {
    correctChoice: function () {
      // assumes there is only ONE correct answer in the list,
      // which is a limitation we'll put on authors but will need to test for somehow
      return this.choices.findIndex(choice => choice.correct === true)
    },
    feedback: function () {
      if (this.selected === '') {
        return ''
      } else {
        return this.choices[this.selected].feedback
      }
    }
  },
  methods: {
    handleRadioClick (auto = false) {
      let result = null
      if (this.selected !== '') {
        if (parseInt(this.selected) === this.correctChoice) {
          result = { success: this.choices[this.selected].feedback, selected: this.selected, auto: auto }
        } else {
          result = { fail: this.choices[this.selected].feedback, selected: this.selected, auto: auto }
        }
        this.$emit('handleChoice', result)
      }
    },
    parse (answer) {
      return marked(answer || '')
        .replace('<p>', '').replace('</p>', '') // remove unnecessary <p> tags
    }
  }
}
</script>

<style scoped>
.input-wrapper {
  position: relative;
}

input[type=radio] {
  display: none;
}

label {
  display: inline-block;
  cursor: pointer;
  position: relative;
  margin-bottom: 0.5rem;
  padding-left: 25px;
}

.radio-button {
  --size: 1rem;
  --border-width: 1px;

  position: absolute;
  top: 0;
  left: 0;

  height: var(--size);
  width: var(--size);

  border-radius: 100%;
  background-color: var(--color-white);
  border: var(--border-width) solid var(--color-navy);
}

.radio-button:after {
  content: "";
  position: absolute;
  top: calc(var(--size) / 2 - var(--border-width));
  right: 0;
  bottom: 0;
  left: calc(var(--size) / 2 - var(--border-width));
  height: calc(var(--size) / 2);
  width: calc(var(--size) / 2);
  border-radius: var(--size);
  background-color: var(--color-navy);
  transform: translate(-50%, -50%) scale(0);

  transition: transform 200ms;
}

input[type=radio]:checked + .radio-button:after  {
  transform: translate(-50%, -50%) scale(1);
}

</style>
