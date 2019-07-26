<template>
  <div :class="{'overflow-hidden': expandExercise}">
    <Header/>
    <div class="container center-l mw7-l ph2">
      <section class="mw7 center mt3 pa3">
        <Breadcrumbs
          :isResources="isResources"
          :workshopShortname="workshopShortname"
          :lessonNumber="lessonNumber"
          :lessonsInWorkshop="lessonsInWorkshop"
          :lessonPassed="lessonPassed" />
        <h1>{{lessonTitle}}</h1>
        <Concepts v-if="concepts" :parsedConcepts="parsedConcepts" />
        <Resources v-if="isResources" :data="resources" />
        <div v-else class="lesson-text lh-copy" v-html="parsedText"></div>
      </section>
      <section v-if="exercise" :class="{expand: expandExercise}" class="exercise center pa3 ph4-l flex flex-column">
        <div class="flex-none">
          <Progress
            :lessonPassed="lessonPassed"
            :cachedCode="cachedCode"
            :cachedStateMsg="cachedStateMsg"
            :expandExercise="expandExercise"
            :toggleExpandExercise="toggleExpandExercise" />
          <div v-html="parsedExercise" class='lh-copy' />
          <FileUpload
            v-if="isFileLesson"
            :onFileClick="onFileClick"
            :onFileDrop="onFileDrop"
            :resetFileUpload="resetFileUpload"
            :uploadedFiles="uploadedFiles" />
          <CodeEditor
            :editorReady="editorReady"
            :code="code"
            :solution="solution"
            :cachedCode="cachedCode"
            :onMounted="onMounted"
            :onCodeChange="onCodeChange"
            :resetCode="resetCode"
            :expandExercise="expandExercise"
            :cyReplaceWithSolution="cyReplaceWithSolution" />
        </div>
        <div class='flex-none'>
          <Output
            v-if="output.test"
            :output="output"
            :isFileLesson="isFileLesson"
            :lessonPassed="lessonPassed"
            :parseData="parseData" />
          <Info
            v-else-if="!isSubmitting"
            :showUploadInfo="showUploadInfo"
            :isFileLesson="isFileLesson" />
        </div>
      </section>
      <Validator
        :exercise="exercise"
        :isFileLesson="isFileLesson"
        :uploadedFiles="uploadedFiles"
        :lessonPassed="lessonPassed"
        :isResources="isResources"
        :nextLessonIsResources="nextLessonIsResources"
        :lessonNumber="lessonNumber"
        :lessonsInWorkshop="lessonsInWorkshop"
        :expandExercise="expandExercise"
        :isSubmitting="isSubmitting"
        :run="run"
        :next="next"
        :tutorialMenu="tutorialMenu" />
    </div>
    <footer class="mt4 ph2 ph3-ns bg-navy white">
      <div v-if="isResources" class="mw7 center">
        <p>How did you feel about this tutorial? We'd love to hear your thoughts and suggestions for improvement! Please <a :href="tutorialIssueUrl" target="_blank">share your feedback</a>.</p>
      </div>
      <div v-else class="mw7 center">
        <p>Feeling stuck? We'd love to hear what's confusing so we can improve this lesson. Please <a :href="lessonIssueUrl" target="_blank">share your questions and feedback</a>.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import 'highlight.js/styles/github.css'
import Vue from 'vue'
import Explorer from './Explorer.vue'
import Button from './Button.vue'
import Header from './Header.vue'
import Resources from './Resources.vue'
import Breadcrumbs from './Breadcrumbs.vue'
import Progress from './Progress.vue'
import Concepts from './Concepts.vue'
import FileUpload from './FileUpload.vue'
import CodeEditor from './CodeEditor.vue'
import Output from './Output.vue'
import Info from './Info.vue'
import Validator from './Validator.vue'
import CID from 'cids'
import marked from 'marked'

const hljs = require('highlight.js/lib/highlight.js')
hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript'))
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'))

marked.setOptions({
  highlight: code => {
    return hljs.highlightAuto(code).value
  }
})

const _eval = async (text, ipfs, modules = {}, args = []) => {
  await new Promise(resolve => ipfs.on('ready', resolve))

  let fn
  let result
  try {
    // eslint-disable-next-line
    fn = new Function('ipfs', 'require', text)
  } catch (e) {
    result = {error: e}
    return result
  }

  let require = name => {
    if (!modules[name]) throw new Error(`Cannot find modules: ${name}`)
    return modules[name]
  }
  try {
    result = await fn(ipfs, require)(...args)
  } catch (e) {
    result = {error: e}
  }
  return result
}

const defaultCode = `/* globals ipfs */

const run = async () => {
  // your code goes here!
  // be sure this function returns the requested value
}

return run
`
let oldIPFS

export default {
  components: {
    Explorer,
    Button,
    Header,
    Resources,
    Breadcrumbs,
    Progress,
    Concepts,
    FileUpload,
    CodeEditor,
    Output,
    Info,
    Validator
  },
  data: self => {
    return {
      isResources: self.$attrs.isResources,
      resources: self.$attrs.resources,
      text: self.$attrs.text,
      exercise: self.$attrs.exercise,
      concepts: self.$attrs.concepts,
      cachedCode: !!localStorage['cached' + self.$route.path],
      code: localStorage[self.cacheKey] || self.$attrs.code || self.defaultCode,
      solution: self.$attrs.solution,
      isSubmitting: false,
      viewSolution: false,
      overrideErrors: self.$attrs.overrideErrors,
      isFileLesson: self.isFileLesson,
      parsedText: marked(self.$attrs.text || ''),
      parsedExercise: marked(self.$attrs.exercise || ''),
      parsedConcepts: marked(self.$attrs.concepts || ''),
      cacheKey: 'cached' + self.$route.path,
      cachedStateMsg: '',
      lessonKey: 'passed' + self.$route.path,
      lessonPassed: !!localStorage['passed' + self.$route.path],
      lessonTitle: self.$attrs.lessonTitle,
      createTestFile: self.$attrs.createTestFile,
      output: self.output,
      showUploadInfo: false,
      expandExercise: false,
      uploadedFiles: window.uploadedFiles || false,
      editorReady: false
    }
  },
  computed: {
    lessonNumber: function () {
      return parseInt(this.$route.path.slice(this.$route.path.lastIndexOf('/') + 1), 10)
    },
    workshopShortname: function () {
      let shortname = this.$route.path.charAt(1).toUpperCase() + this.$route.path.slice(2, this.$route.path.lastIndexOf('/'))
      // // ADD THIS LATER IF WE DECIDE WE WANT ALL WORDS CAPITALIZED
      // if (shortname.includes("-")) {
      //   let shortnameArray = shortname.split("-")
      //   let shortnameArrayUpper = shortnameArray.map( word => {
      //     return (word.charAt(0).toUpperCase() + word.slice(1))
      //   })
      //   shortname = shortnameArrayUpper.join(" ")
      // }
      return shortname.split('-').join(' ')
    },
    lessonIssueUrl: function () {
      return `https://github.com/ProtoSchool/protoschool.github.io/issues/new?assignees=&labels=lesson-feedback&template=lesson-feedback.md&title=Lesson+Feedback%3A+${this.workshopShortname}+-+Lesson+${this.lessonNumber}+(${this.lessonTitle})`
    },
    tutorialIssueUrl: function () {
      return `https://github.com/ProtoSchool/protoschool.github.io/issues/new?assignees=&labels=tutorial-feedback&template=tutorial-feedback.md&title=Tutorial+Feedback%3A+${this.workshopShortname}`
    },
    lessonsInWorkshop: function () {
      const basePath = this.$route.path.slice(0, -2)
      let number = this.$route.path.slice(-2)
      while (this.$router.resolve(basePath + number).route.name !== '404') {
        number++
        number = number.toString().padStart(2, '0')
      }
      return parseInt(number) - 1
    },
    nextLessonIsResources: function () {
      const basePath = this.$route.path.slice(0, -2)
      const hasResources = this.$router.resolve(basePath + 'resources').route.name !== '404'
      return this.lessonNumber === this.lessonsInWorkshop && hasResources
    }
  },
  beforeCreate: function () {
    this.output = {}
    this.defaultCode = defaultCode
    this.IPFSPromise = import('ipfs').then(m => m.default)
    // doesn't work to set lessonPassed in here because it can't recognize lessonKey yet
  },
  updated: function () {
    // runs on page load AND every keystroke in editor AND submit
  },
  beforeUpdate: function () {
    // runs on every keystroke in editor, NOT on page load, NOT on code submit
  },
  methods: {
    run: async function (auto = false) {
      let args = []
      this.isSubmitting = true
      if (oldIPFS) {
        oldIPFS.stop()
        oldIPFS = null
      }
      let output = this.output
      let ipfs = await this.createIPFS()
      if (this.createTestFile) {
        await this.createFile(ipfs)
      }
      let code = this.editor.getValue()
      let modules = {}

      if (this.isFileLesson && this.uploadedFiles === false && auto === true) {
        this.showUploadInfo = true
        this.isSubmitting = false
        return
      } else {
        this.showUploadInfo = false
      }

      if (this.$attrs.modules) modules = this.$attrs.modules
      if (this.isFileLesson) args.unshift(this.uploadedFiles)
      // Output external errors or not depending on flag
      let result = await _eval(code, ipfs, modules, args)
      if (!this.$attrs.overrideErrors && result && result.error) {
        Vue.set(output, 'test', result)
        this.lessonPassed = !!localStorage[this.lessonKey]
        this.isSubmitting = false
        return
      }
      // Hide the solution
      this.viewSolution = false
      // Run the `validate` function in the lesson
      let test = await this.$attrs.validate(result, ipfs, args)
      Vue.set(output, 'test', test)
      if (CID.isCID(result)) {
        oldIPFS = ipfs
        Vue.set(output.test, 'cid', result)
      } else {
        ipfs.stop()
      }
      if (output.test.success) {
        localStorage[this.lessonKey] = 'passed'
      }
      this.lessonPassed = !!localStorage[this.lessonKey]
      this.isSubmitting = false
    },
    createIPFS: function () {
      if (this.$attrs.createIPFS) {
        return this.$attrs.createIPFS()
      } else {
        let ipfs = this.IPFSPromise.then(IPFS => {
          this.ipfsConstructor = IPFS
          return new IPFS({ repo: Math.random().toString() })
        })
        return ipfs
      }
    },
    createFile: function (ipfs) {
      /* eslint-disable no-new */
      new Promise((resolve, reject) => {
        ipfs.on('ready', async () => {
          await ipfs.add(this.ipfsConstructor.Buffer.from('You did it!'))
          resolve()
        })
      })
    },
    resetCode: function () {
      // TRACK? User chose to reset code
      this.code = this.$attrs.code || defaultCode
      // this ^ triggers onCodeChange which will clear cache
      this.editor.setValue(this.code)
      this.clearPassed()
      delete this.output.test
      this.showUploadInfo = false
    },
    resetFileUpload: function () {
      this.uploadedFiles = false
    },
    clearPassed: function () {
      delete localStorage[this.lessonKey]
      this.lessonPassed = !!localStorage[this.lessonKey]
    },
    loadCodeFromCache: function () {
      this.code = localStorage[this.cacheKey]
      this.editor.setValue(this.code)
    },
    onMounted: function (editor) {
      // runs on page load, NOT on every keystroke in editor
      this.editor = editor
      this.editorReady = true
      if (this.cachedCode) {
        // TRACK? returned to lesson previously visited
        this.loadCodeFromCache()
        this.cachedStateMsg = "Pick up where you left off. We've saved your code for you!"
        if (this.lessonPassed) {
          this.run(true)
        }
      } else {
        // TRACK? first time starting lesson
      }
    },
    onCodeChange: function () {
      if (this.editor.getValue() === (this.$attrs.code || defaultCode)) {
        // TRACK? edited back to default state by chance or by 'reset code'
        delete localStorage[this.cacheKey]
        this.cachedCode = !!localStorage[this.cacheKey]
      } else if (this.code === this.editor.getValue()) {
        // TRACK? returned to cached lesson in progress
      } else {
        localStorage[this.cacheKey] = this.editor.getValue()
        this.code = this.editor.getValue()
        this.cachedCode = !!localStorage[this.cacheKey]
        this.cachedStateMsg = "We're saving your code as you go."
        if (this.code !== this.solution) {
          this.clearPassed()
          delete this.output.test
        }
      }
    },
    next: function () {
      if (this.exercise) {
        Vue.set(this.output, 'test', null)
      } else {
        localStorage[this.lessonKey] = 'passed'
        this.lessonPassed = !!localStorage[this.lessonKey]
      }
      let current = this.lessonNumber

      let next = this.nextLessonIsResources
        ? 'resources'
        : (parseInt(current) + 1).toString().padStart(2, '0')

      this.$router.push({ path: next })
    },
    tutorialMenu: function () {
      if (this.exercise) {
        Vue.set(this.output, 'test', null)
      } else {
        localStorage[this.lessonKey] = 'passed'
        this.lessonPassed = !!localStorage[this.lessonKey]
      }
      this.$router.push({path: '/tutorials/'})
    },
    toggleExpandExercise: function () {
      this.expandExercise = !this.expandExercise
    },
    cyReplaceWithSolution: function () {
      this.editor.setValue(this.$attrs.solution)
    },
    parseData: (data) => marked(data)
  }
}
</script>

<style scoped>
.container {
  flex-grow: 1;
}

.exercise {
  overflow: hidden;
  background: #F6F7F9;
  max-width: 48rem;
}

.exercise.expand {
  height: 100vh;
  width: 100%;
  max-width: 100%;
  margin: 0;
  position: fixed;
  top: 0;
  right: 0;
  overflow: scroll;
}

.indent-1 {
  margin-left: 1rem;
}

span.textLink {
  color: blue;
  cursor: pointer;
}

footer a {
  color: aqua;
}

@media screen and (min-width: 60rem) {
  .indent-1 {
    margin-left: 93px;
  }
}
</style>
