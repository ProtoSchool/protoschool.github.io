<template>
  <h2 class="mt0 mb2 green fw4 fill-current">
    <span style="vertical-align:-1px">
      <CompleteIcon v-if="lessonPassed" alt="complete" data-cy="progress-icon-passed" class="h1" />
      <InProgressIcon v-else-if="cachedCode || cachedChoice" alt="in progress" data-cy="progress-icon-in-progress" class="h1" />
      <NotStartedIcon v-else alt="not yet started" data-cy="progress-icon-not-yet-started" class="h1" />
    </span>
    <span class="green ttu f6 pl2 pr1 fw7 v-mid">
      <span v-if="lessonPassed" data-cy="progress-passed">You did it!</span>
      <span v-else-if="cachedCode || cachedChoice" data-cy="progress-in-progress">{{ isMultipleChoiceLesson ? 'Try again.' : 'Keep working.' }}</span>
      <span v-else data-cy="progress-not-yet-started">{{ isMultipleChoiceLesson ? 'Take the quiz!' : 'Try it!' }}</span>
    </span>
    <span class="green f6 fw5 v-mid">
      <span v-if="cachedCode && !lessonPassed">{{cachedStateMsg}}</span>
    </span>
    <div v-if="!isMultipleChoiceLesson" class="fr">
      <button v-if="expandChallenge" @click="toggleExpandChallenge" title="Shrink challenge box" class="b--transparent bg-transparent green hover-green-muted pointer focus-outline">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 32 32">
          <path d="M16 4 L28 4 L28 16 L24 12 L20 16 L16 12 L20 8z M4 16 L8 20 L12 16 L16 20 L12 24 L16 28 L4 28z" />
        </svg>
      </button>
      <button v-else @click="toggleExpandChallenge" title="Expand challenge box" class="b--transparent bg-transparent charcoal-muted hover-green pointer focus-outline">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 32 32">
          <path d="M16 4 L28 4 L28 16 L24 12 L20 16 L16 12 L20 8z M4 16 L8 20 L12 16 L16 20 L12 24 L16 28 L4 28z" />
        </svg>
      </button>
    </div>
  </h2>
</template>

<script>
import CompleteIcon from '../static/images/complete.svg?inline'
import InProgressIcon from '../static/images/in-progress.svg?inline'
import NotStartedIcon from '../static/images/not-started.svg?inline'

export default {
  components: {
    CompleteIcon,
    InProgressIcon,
    NotStartedIcon
  },
  props: {
    isMultipleChoiceLesson: Boolean,
    lessonPassed: Boolean,
    cachedChoice: Boolean,
    cachedCode: Boolean,
    cachedStateMsg: String,
    expandChallenge: Boolean,
    toggleExpandChallenge: Function
  }
}
</script>

<style scoped>
span img {
  height: 1rem;
}
</style>
