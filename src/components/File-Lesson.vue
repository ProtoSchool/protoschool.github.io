<script>
import Lesson from './Lesson.vue'

const defaultCode = `/* globals ipfs */

const run = async (files) => {
  // your code goes here!
  // be sure this function returns the requested value
}

return run

`

export default {
  extends: Lesson,
  beforeCreate: function () {
    this.isFileLesson = true
    this.defaultCode = defaultCode
  },
  methods: {
    onFileDrop: function (event) {
      event.preventDefault()
      event.stopPropagation()
      this.run(Array.from(event.dataTransfer.files))
      return false
    },
    onFileClick: function (event) {
      let elem = document.getElementById('fileInput')
      elem.onchange = () => {
        this.run(Array.from(elem.files))
      }
      elem.click()
    }
  }
}
</script>
