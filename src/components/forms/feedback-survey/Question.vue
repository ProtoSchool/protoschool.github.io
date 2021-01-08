<template>
  <transition
    name="state-view-transition"
  >
    <div
      v-if="selected === -1"
      data-state-view-active="true"
      data-state-view-transition-function="slide"
      data-state-view-transition-delay-leave="default"
      class="question state-view"
    >
      <p>{{question.text}}<p/>
      <div class="answers dib">
        <div
          class="answers-list dib"
        >
          <label
            class="answer inline-flex items-center justify-center"
            v-for="answerNr in nrAnswers"
            :key="answerNr"
            :for="`response-${answerNr}`"
            :data-number="answerNr"
            :data-selected="selected === answerNr"
          >
            <input
              type="radio"
              class="input-reset"
              :value="answerNr"
              :name="`response-${answerNr}`"
              v-on:change="onSelect(answerNr)"
              v-model="selected"
            />
            <AnswerOneIcon v-if="answerNr === 1" :alt="`Rate as ${answerNr} on scale of 1 to 5`" />
            <AnswerTwoIcon v-else-if="answerNr === 2" :alt="`Rate as ${answerNr} on scale of 1 to 5`" />
            <AnswerThreeIcon v-else-if="answerNr === 3" :alt="`Rate as ${answerNr} on scale of 1 to 5`" />
            <AnswerFourIcon v-else-if="answerNr === 4" :alt="`Rate as ${answerNr} on scale of 1 to 5`" />
            <AnswerFiveIcon v-else-if="answerNr === 5" :alt="`Rate as ${answerNr} on scale of 1 to 5`" />
          </label>
        </div>
        <br />
        <div class="answers-legend w-100 inline-flex justify-between">
          <div class="lowest">{{labels.lowest}}</div>
          <div class="highest">{{labels.highest}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import AnswerOneIcon from '../../../static/images/icons/survey/1.svg?inline'
import AnswerTwoIcon from '../../../static/images/icons/survey/2.svg?inline'
import AnswerThreeIcon from '../../../static/images/icons/survey/3.svg?inline'
import AnswerFourIcon from '../../../static/images/icons/survey/4.svg?inline'
import AnswerFiveIcon from '../../../static/images/icons/survey/5.svg?inline'
import translations from '../../../static/translations'

export default {
  name: 'Question',
  components: {
    AnswerOneIcon,
    AnswerTwoIcon,
    AnswerThreeIcon,
    AnswerFourIcon,
    AnswerFiveIcon
  },
  props: {
    question: Object,
    onSelect: Function,
    answerSelected: {
      type: Number,
      default: -1
    },
    active: {
      type: String,
      default: 'on'
    }
  },
  data: self => ({
    nrAnswers: 5,
    selected: self.answerSelected
  }),
  computed: {
    labels: function () {
      return this.question.answers || translations.feedbackSurvey.form.defaultAnswers
    }
  },
  beforeDestroy () {
    if (this.selected === -1 || !this.$el.querySelector) {
      return
    }

    this.$el
      .querySelector(`.answer[data-number="${this.selected}"]`)
      .setAttribute('data-selected', 'true')
  }
}
</script>
<style scoped>
.answers {
  --inner-size: 1.5625rem;
  --padding: .625rem;
  --size: calc(var(--inner-size) + var(--padding) * 2);
}

.answers-list {
  height: var(--inner-size);
}

.answer {
  position: relative;

  height: var(--inner-size);
  width: var(--size);
  opacity: 1;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent; /* hide tap highlight on webkit browers */

  transition: opacity var(--transition-default);
}

.answer input {
  position: absolute;
  opacity: 0;
  height: var(--size);
  width: var(--size);
  padding: var(--padding);
  cursor: pointer;
  user-select: none;
}

.answer svg {
  top: 0;
  height: var(--inner-size);
  width: var(--inner-size);
  transform: scale(0.95);
  pointer-events: none;

  transition:
    transform var(--transition-default);
}

.answer:first-child {
  margin-left: calc(var(--padding) * -1); /* hit area padding compensation for the first element */
}
.answer:last-child {
  margin-right: calc(var(--padding) * -1); /* hit area padding compensation for the first element */
}

.question[data-selected="true"] .answer,
.answers-list:focus-within .answer:not(:focus),
.answers-list:hover .answer:not(:hover) {
  opacity: 0.5;
}

.answer:focus svg,
.answer:focus-within svg,
.answer:hover svg {
  transform: scale(1);
}

.answer:active svg {
  transform: scale(0.95);
}

.answer:active,
.answer:focus,
.answer:focus-within {
  opacity: 1 !important;
}

/*
  Selected state: when the answer is selected
  This animation makes the answer images pop when the user selects it
 */
.answer[data-selected="true"] {
  opacity: 1 !important;
}
.answer[data-selected="true"] svg {
  transition-timing-function: cubic-bezier(1, -10, 0, 10);
  transform: scale(1.08) rotateZ(1deg);
}

.answers-legend {
  font-size: 0.7rem;
  transform: translateY(-.3125rem);
}

.answers-legend .lowest {
  color: #A81700;
}
.answers-legend .highest {
  color: var(--color-navy);
}
</style>
