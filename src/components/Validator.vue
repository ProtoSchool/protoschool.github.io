<template>
  <div class="mw7 center">
    <!-- Coding lesson -->
    <div v-if="challenge" :class="{'fixed bottom-0 right-0': expandChallenge}" class="coding-challenge-container pr4 pb4 tr">
      <div v-if="!nextLessonIsResources && (lessonPassed && (lessonNumber === lessonsInTutorial)) || isResources">
        <ButtonLink
          class="bg-navy white"
          data-cy="more-tutorials"
          text="More Tutorials"
          link="Tutorials"
        />
      </div>
      <div v-else-if="lessonPassed && !isSubmitting">
        <span class="disabled-btn-wrapper">
          <span v-if="isFileLesson && uploadedFiles.length === 0" class="mr2 red lh-copy o-0" data-cy="need-new-files-msg">
            You must upload a file before submitting.
          </span>
          <Button v-if="(isFileLesson && !output) || (isFileLesson && uploadedFiles.length ===0)"
            :disabled="uploadedFiles.length === 0"
            :click="run"
            class="mr2 bg-navy white"
            style="minWidth: 90px"
            data-cy="submit-needs-new-files"
            text="Submit"
          />
        </span>
        <Button
          :click="next"
          class="bg-navy white"
          data-cy="next-lesson-code"
          text="Next"
        />
      </div>
      <div v-else>
        <span v-if="(isFileLesson && uploadedFiles.length === 0) || isSubmitting" class="disabled-btn-wrapper">
          <span v-if="isFileLesson && uploadedFiles.length === 0" class="mr2 red lh-copy o-0" data-cy="need-files-msg">
            You must upload a file before submitting.
          </span>
          <Button
            :click="next"
            :loading="isSubmitting"
            :disabled="isFileLesson && uploadedFiles.length === 0"
            class="bg-navy white"
            data-cy="submit-disabled"
            text="Submit"
          />
        </span>
        <Button v-else
          :click="run"
          class="bg-navy white"
          data-cy="submit-answer"
          text="Submit"
        />
      </div>
    </div>
    <!-- Multiple choice lesson -->
    <div v-else-if="isMultipleChoiceLesson" class="coding-challenge-container pr4 pb4 tr">
      <div v-if="!nextLessonIsResources && (lessonPassed && (lessonNumber === lessonsInTutorial)) || isResources">
        <ButtonLink
          class="bg-navy white"
          data-cy="more-tutorials"
          text="More Tuturials"
          link="Tutorials"
        />
      </div>
      <span v-else class="disabled-btn-wrapper">
        <span v-if="!lessonPassed" class="mr2 red lh-copy o-0">
          Oops, you haven't selected the right answer yet!
        </span>
        <Button
          :click="next"
          class="bg-navy white"
          :disabled="!lessonPassed"
          data-cy="next-lesson-mult-choice"
          text="Next"
        />
      </span>
    </div>
    <!-- Text only lesson -->
    <div v-else class="mb3 ph2 tr">
      <div v-if="!nextLessonIsResources && ((lessonNumber === lessonsInTutorial) || isResources)">
        <ButtonLink
          data-cy="more-tutorials"
          class="bg-navy white"
          text="More Tutorials"
          link="Tutorials"
        />
      </div>
      <div v-else>
        <Button
          :click="next"
          class="bg-navy white"
          data-cy="next-lesson-text"
          text="Next"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Button from './buttons/Button.vue'
import ButtonLink from './buttons/ButtonLink.vue'

export default {
  components: {
    Button,
    ButtonLink
  },
  props: {
    challenge: String,
    isFileLesson: Boolean,
    isMultipleChoiceLesson: Boolean,
    uploadedFiles: Array,
    lessonPassed: Boolean,
    output: [Object, Error],
    isResources: Boolean,
    nextLessonIsResources: Boolean,
    lessonNumber: Number,
    lessonsInTutorial: Number,
    isSubmitting: Boolean,
    next: Function,
    run: Function,
    expandChallenge: Boolean
  }
}
</script>

<style scoped>
.coding-challenge-container {
  background: #F6F7F9;
}

.disabled-btn-wrapper:hover > span {
  opacity: 1;
  transition: opacity .2s ease-in;
}

</style>
