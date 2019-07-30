<script>
import Lesson from './Lesson.vue'

export default {
  extends: Lesson,
  beforeCreate: function () {
    this.isMultipleChoiceLesson = true
  },
  methods: {
    doSomething: function () {
      console.log('in doSomething function')
    }
  }
}
</script>
