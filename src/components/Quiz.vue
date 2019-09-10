<template>
  <div>
    <h3>{{this.question}}</h3>
    <div v-for="(choice, idx) in this.choices" :key="`choice-${idx}`">
      <input type="radio" :id="idx" :value="idx" v-model="selected" @change="handleRadioClick">
      <label :for="idx">{{choice.answer}}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Quiz',
  data: self => {
    return {
      question: self.$attrs.question,
      choices: self.$attrs.choices,
      selected: self.$attrs.selected
    }
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
    }
  }
}
</script>

<style scoped>
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

label:before {
  content: "";
  position: absolute;
  display: inline-block;
  left: 0;
  width: 16px;
  height: 16px;
  background-color: #fff;
  border: 1px solid #0a3a52;
  border-radius: 50%;
}

input[type=radio]:checked + label:before {
  content: "\2022";
  color: #0a3a52;
  font-size: 1.45rem;
  text-align: center;
  line-height: 1.1rem;
}
</style>
