<template>
  <div class="pt2 lh-copy">
    <span v-if="showUploadInfo">
      You've passed this lesson previously, but the cached files are no longer available.
      Upload files and
      <strong>Submit</strong> to see the output again.
    </span>
    <span v-else-if="showLessonChangedInfo">
      You've passed this lesson previously, but we've since updated the content of this tutorial. Check out the updated lesson content and give the code challenge another try... it might require a new solution!
    </span>
    <span v-else-if="isFileLesson">Upload file(s) and update the code to complete the challenge.</span>
    <span v-else>
      Update the code to complete the challenge.
      Click
      <strong>Submit</strong> to check your answer.
    </span>
  </div>
</template>

<script>
export default {
  props: {
    showUploadInfo: Boolean,
    showLessonChangedInfo: Boolean,
    isFileLesson: Boolean
  }
}
</script>
