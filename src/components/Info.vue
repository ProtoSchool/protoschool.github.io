<template>
  <div v-if="showUploadInfo" class="pt2 lh-copy">
    You've passed this lesson previously, but the cached files are no longer available.
    Upload files and
    <strong>Submit</strong> to see the output again.
  </div>
  <div v-else class="pt2 lh-copy">
    <span v-if="isFileLesson">Upload file(s) and update the code to complete the exercise.</span>
    <span v-else>Update the code to complete the exercise.</span>
    Click
    <strong>Submit</strong> to check your answer.
  </div>
</template>

<script>
export default {
  props: {
    showUploadInfo: Boolean,
    isFileLesson: Boolean
  }
}
</script>
