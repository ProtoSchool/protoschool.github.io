<template>
  <h2 class="mt0 mb2 green fw4 fill-current">
    <span style="vertical-align:-1px">
      <img v-if="lessonPassed" src="../static/images/complete.svg" alt="complete" />
      <img v-else-if="cachedCode || cachedChoice" src="../static/images/in-progress.svg" alt="in progress" />
      <img v-else src="../static/images/not-started.svg" alt="not yet started" />
    </span>
    <span class="green ttu f6 pl2 pr1 fw7 v-mid">
      <span v-if="lessonPassed">You did it!</span>
      <span v-else-if="cachedCode || cachedChoice">{{ isMultipleChoiceLesson ? 'Try again.' : 'Keep working.' }}</span>
      <span v-else>{{ isMultipleChoiceLesson ? 'Take the quiz!' : 'Try it!' }}</span>
    </span>
    <span class="green f6 fw5 v-mid">
      <span v-if="cachedCode && !lessonPassed">{{cachedStateMsg}}</span>
    </span>
    <div class="fr">
      <button v-if="expandExercise" @click="toggleExpandExercise" title="go smol" class="b--transparent bg-transparent green hover-green-muted pointer focus-outline">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 32 32">
          <path d="M16 4 L28 4 L28 16 L24 12 L20 16 L16 12 L20 8z M4 16 L8 20 L12 16 L16 20 L12 24 L16 28 L4 28z" />
        </svg>
      </button>
      <button v-else @click="toggleExpandExercise" title="embiggen the exercise" class="b--transparent bg-transparent charcoal-muted hover-green pointer focus-outline">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 32 32">
          <path d="M16 4 L28 4 L28 16 L24 12 L20 16 L16 12 L20 8z M4 16 L8 20 L12 16 L16 20 L12 24 L16 28 L4 28z" />
        </svg>
      </button>
    </div>
  </h2>
</template>

<script>
export default {
  props: {
    isMultipleChoiceLesson: Boolean,
    lessonPassed: Boolean,
    cachedChoice: Boolean,
    cachedCode: Boolean,
    cachedStateMsg: String,
    expandExercise: Boolean,
    toggleExpandExercise: Function
  }
}
</script>

<style scoped>
span img {
  height: 1rem;
}
</style>
