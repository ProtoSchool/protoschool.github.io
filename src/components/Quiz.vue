<template>
  <div>
    <h3>{{this.question}}</h3>
    <div v-for="(choice, idx) in this.choices" :key="`choice-${idx}`">
      <input type="radio" :id="idx" :value="idx" v-model="selected" @click="handleRadioClick">
      <label for="key">{{choice.answer}}</label>
    </div>
    <p v-if="selected !== ''" class="feedback" v-bind:class="answerStatus"> {{feedback}}</p>
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
    //can we pass this value to parent to use existing display in Lesson.vue?
    feedback: function () {
      if (this.selected === '') {
        return ''
      } else {
        return this.choices[this.selected].feedback
      }
    },
    //can we pass this value to parent to use existing display in Lesson.vue?
    answerStatus: function () {
      if (this.selected === '') {
        return "unanswered"
      } else if (this.isCorrect) {
        return "correct"
      } else {
        return "incorrect"
      }
    }
    },
    methods: {
      handleRadioClick () {
        this.$emit("handleChoice", {
          status: this.isCorrect ? "correct" : "incorrect",
          feedback: this.choices[this.selected].feedback
        })
      }
    }
  }

</script>

<style scoped>

.feedback {
  color: white;
  padding: 2px;
}
.feedback.correct {
  background-color: green;
}
.feedback.incorrect {
  background-color: red;
}


</style>
