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
      this.onFiles(Array.from(event.dataTransfer.files))
      return false
    },
    onFileClick: function (event) {
      event.preventDefault()
      event.stopPropagation()
      let elem = document.createElement('input')
      elem.setAttribute("type", "file")
      elem.setAttribute('multiple', true)
      elem.onchange = () => {
        this.onFiles(Array.from(elem.files))
      }
      elem.click()
    },
    onFiles: function (files) {
      this.uploadedFiles = files
      window.uploadedFiles = files
      console.log({uploadedFiles: this.uploadedFiles})
     }
    }
  }
</script>
