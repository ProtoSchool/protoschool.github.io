<script>
import Lesson from './Lesson.vue'

export default {
  extends: Lesson,
  beforeCreate: function () {
    this.isMultipleChoiceLesson = true
  }
}
</script>
