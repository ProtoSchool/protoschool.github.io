<template>
  <div>
    <h3>{{this.question}}</h3>
    <div v-for="(choice, idx) in this.choices" :key="`choice-${idx}`">
      <input type="radio" :id="idx" :value="idx" v-model="selected" @change="handleRadioClick">
      <label for="key">{{choice.answer}}</label>
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
      selected: ''
    }
  },
  computed: {
    correctChoice: function () {
      // assumes there is only ONE correct answer in the list,
      // which is a limitation we'll put on authors but will need to test for somehow
      return this.choices.findIndex(choice => choice.correct === true)
    },
    isCorrect: function () {
      return this.selected === this.correctChoice
    },
    // Can we pass this value to parent to use existing display in Lesson.vue?
    feedback: function () {
      if (this.selected === '') {
        return ''
      } else {
        return this.choices[this.selected].feedback
      }
    },
    // Can we pass this value to parent to use existing display in Lesson.vue?
    answerStatus: function () {
      if (this.selected === '') {
        return 'unanswered'
      } else if (this.isCorrect) {
        return 'correct'
      } else {
        return 'incorrect'
      }
    }
  },
  methods: {
    handleRadioClick () {
      let result = null
      if (this.selected !== '') {
        if (this.isCorrect) {
          result = { success: this.choices[this.selected].feedback }
        } else {
          result = { fail: this.choices[this.selected].feedback }
        }
      } else {
        console.log('not answered')
      }
      this.$emit('handleChoice', result)
    }
  }
}
</script>

<style scoped>

</style>
