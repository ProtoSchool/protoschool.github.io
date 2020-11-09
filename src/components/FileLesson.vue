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
  mounted: function () {
    let elem = document.querySelector('input#file')
    elem.onchange = () => {
      this.onFiles(Array.from(elem.files))
    }
  },
  methods: {
    onFileDrop: function (event) {
      event.preventDefault()
      event.stopPropagation()
      let files = Array.from(event.dataTransfer.files)
      for (let f of Array.from(event.dataTransfer.items)) {
        let isFile = f.getAsEntry ? f.getAsEntry().isFile : (f.webkitGetAsEntry ? f.webkitGetAsEntry().isFile : true)
        if (!isFile) {
          return alert('Directory upload is not supported. Please select one or more files.')
        }
      }
      this.onFiles(files)
      return false
    },
    onFileClick: function (event) {
      event.preventDefault()
      event.stopPropagation()
      let elem = document.querySelector('input#file')
      elem.click()
    },
    onFilesReset: function () {
      let elem = document.querySelector('input#file')
      elem.value = ''
      delete elem.files
    },
    onFiles: function (files) {
      this.uploadedFiles = files
      window.uploadedFiles = files
    }
  }
}
</script>
