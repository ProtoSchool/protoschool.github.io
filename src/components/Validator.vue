<template>
  <div class="mw7 center">
    <!-- Coding lesson -->
    <div v-if="exercise" :class="{'fixed bottom-0 right-0': expandExercise}" class="coding-exercise-container pr4 pb4 tr">
      <div v-if="!nextLessonIsResources && (lessonPassed && (lessonNumber === lessonsInWorkshop)) || isResources">
        <Button :click="tutorialMenu" class="bg-aqua white" data-cy="more-tutorials">More Tutorials</Button>
      </div>
      <div v-else-if="lessonPassed">
        <Button :click="next" class="bg-aqua white" data-cy="next-lesson">Next</Button>
      </div>
      <div v-else>
        <span v-if="(isFileLesson && !uploadedFiles) || isSubmitting" class="disabled-btn-wrapper">
          <span v-if="isFileLesson && !uploadedFiles" class="red lh-copy o-0">
            You must upload a file before submitting.
          </span>
          <Button :click="next" class="bg-aqua white" disabled>
            <span v-if="isSubmitting" class="loader"></span>
            <span v-else>Submit</span>
          </Button>
        </span>
        <Button v-else :click="run" class="bg-aqua white" data-cy="submit-answer">Submit</Button>
      </div>
    </div>
    <!-- Text only lesson -->
    <div v-else class="mb3 ph2 tr">
      <div v-if="!nextLessonIsResources && ((lessonNumber === lessonsInWorkshop) || isResources)">
        <Button :click="tutorialMenu" class="bg-aqua white">More Tutorials</Button>
      </div>
      <div v-else>
        <Button :click="next" class="bg-aqua white">Next</Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from './Button.vue'

export default {
  components: {
    Button
  },
  props: {
    exercise: String,
    isFileLesson: Boolean,
    uploadedFiles: [Boolean, Array],
    lessonPassed: Boolean,
    isResources: Boolean,
    nextLessonIsResources: Boolean,
    lessonNumber: Number,
    lessonsInWorkshop: Number,
    isSubmitting: Boolean,
    next: Function,
    run: Function,
    tutorialMenu: Function,
    expandExercise: Boolean
  }
}
</script>

<style scoped>
.coding-exercise-container {
  background: #F6F7F9;
}

.disabled-btn-wrapper:hover > span {
  opacity: 1;
  transition: opacity .2s ease-in;
}

button:disabled {
  cursor: not-allowed;
}

.loader,
.loader:before,
.loader:after {
  border-radius: 50%;
  width: 2em;
  height: 2em;
  animation-fill-mode: both;
  animation: loadAnim 1.5s infinite ease-in-out;
}

.loader {
  display: block;
  margin: 7px auto;
  color: #ffffff;
  font-size: 5px;
  top: -10px;
  position: relative;
  animation-delay: -0.15s;
  pointer-events: none;
}

.loader:before {
  content: '';
  position: absolute;
  left: -3.5em;
  animation-delay: -0.30s;
}

.loader:after {
  content: '';
  position: absolute;
  left: 3.5em;
}

@keyframes loadAnim {
  0%, 80%, 100% {
    box-shadow: 0 2em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2em 0 0;
  }
}
</style>
