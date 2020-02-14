<template>
  <div :class="{'overflow-hidden': expandExercise}">
    <Header/>
    <div class="container center-l mw7-l ph3">
      <section class="mw7 center mt3 pt2">
        <div class="flex flex-row justify-between green">
            <Breadcrumbs
              :isResources="isResources"
              :tutorial="tutorial"
              :lessonNumber="lessonId"
              :lessonsInTutorial="lessonsInTutorial"
              :lessonPassed="lessonPassed" />
            <TypeIcon
              :lessonId="isResources? 'resources' : lessonId"
              :tutorialId="tutorial.formattedId"
              class="h2 ml3" />
        </div>
        <CongratulationsCallout
            v-if="isResources && isTutorialPassed"
            :tutorial="tutorial"
            class="mv4"
        />
        <h1>{{isResources ? 'Resources' : lesson.title}}</h1>
        <Concepts v-if="concepts" :concepts="concepts" />
        <Resources v-if="isResources" :data="resources" />
        <div v-else class="lesson-text lh-copy" v-html="text"></div>
      </section>
      <section v-if="exercise || isMultipleChoiceLesson" :class="{expand: expandExercise}" class="exercise center pa3 ph4-l flex flex-column">
        <div class="flex-none">
          <Progress
            :isMultipleChoiceLesson="isMultipleChoiceLesson"
            :lessonPassed="lessonPassed"
            :cachedChoice="cachedChoice"
            :cachedCode="cachedCode"
            :cachedStateMsg="cachedStateMsg"
            :expandExercise="expandExercise"
            :toggleExpandExercise="toggleExpandExercise" />
          <div v-html="exercise" class='lh-copy' />
          <FileUpload
            v-if="isFileLesson"
            :onFileClick="onFileClick"
            :onFileDrop="onFileDrop"
            :resetFileUpload="resetFileUpload"
            :uploadedFiles="uploadedFiles" />
          <CodeEditor
            v-if="exercise"
            :isFileLesson="isFileLesson"
            :editorReady="editorReady"
            :code="editorCode"
            :solution="solution"
            :cachedCode="cachedCode"
            :onMounted="onMounted"
            :onCodeChange="onCodeChange"
            :resetCode="resetCode"
            :expandExercise="expandExercise"
            :cyReplaceWithSolution="cyReplaceWithSolution" />
          <Quiz
            v-if="isMultipleChoiceLesson"
            :question="this.question"
            :choices="this.choices"
            :selected="choice"
            @handleChoice="handleRadioChoice" />
        </div>
        <div class='flex-none'>
          <Output
            v-if="output.test"
            :output="output"
            :isFileLesson="isFileLesson"
            :lessonPassed="lessonPassed"
            :parseData="parseData" />
          <Info
            v-else-if="exercise && !isSubmitting"
            :showUploadInfo="showUploadInfo"
            :isFileLesson="isFileLesson" />
        </div>
      </section>
      <Validator
        :exercise="exercise"
        :isFileLesson="isFileLesson"
        :isMultipleChoiceLesson="isMultipleChoiceLesson"
        :uploadedFiles="uploadedFiles"
        :lessonPassed="lessonPassed"
        :output="output.test"
        :isResources="isResources"
        :nextLessonIsResources="nextLessonIsResources"
        :lessonNumber="lessonId"
        :lessonsInTutorial="lessonsInTutorial"
        :expandExercise="expandExercise"
        :isSubmitting="isSubmitting"
        :run="run"
        :next="next"
        :tutorialMenu="tutorialMenu" />
    </div>
    <footer class="mt4 ph3-ns bg-navy white">
      <div v-if="isResources" class="mw7 center ph3">
        <p>How did you feel about this tutorial? We'd love to hear your thoughts and suggestions for improvement! Please <a :href="tutorialIssueUrl" target="_blank">share your feedback</a>.</p>
      </div>
      <div v-else class="mw7 center ph3">
        <p>Feeling stuck? We'd love to hear what's confusing so we can improve this lesson. Please <a :href="lessonIssueUrl" target="_blank">share your questions and feedback</a>.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue'
import CID from 'cids'
import pTimeout from 'p-timeout'
import newGithubIssueUrl from 'new-github-issue-url'

import { getTutorialByUrl, isTutorialPassed, getLesson } from '../utils/tutorials'
import { EVENTS } from '../static/countly'
import marked from '../utils/marked'
import Header from './Header.vue'
import Quiz from './Quiz.vue'
import Resources from './Resources.vue'
import Breadcrumbs from './Breadcrumbs.vue'
import Progress from './Progress.vue'
import Concepts from './Concepts.vue'
import FileUpload from './FileUpload.vue'
import CodeEditor from './CodeEditor.vue'
import Output from './Output.vue'
import Info from './Info.vue'
import Validator from './Validator.vue'
import CongratulationsCallout from './CongratulationsCallout.vue'
import TypeIcon from './TypeIcon.vue'

const MAX_EXEC_TIMEOUT = 5000

class SyntaxError extends Error {
  toString () {
    return `SyntaxError: ${this.message}`
  }
}

const _eval = async (text, ipfs, modules = {}, args = []) => {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return new Error('Please submit a solution.')
  }

  let fn
  try {
    // eslint-disable-next-line
    fn = new Function('ipfs', 'require', text)
  } catch (err) {
    return new SyntaxError(err.message, err)
  }

  const require = name => {
    if (!modules[name]) throw new Error(`Cannot find modules: ${name}`)
    return modules[name]
  }

  let result

  try {
    result = await pTimeout(fn(ipfs, require)(...args), MAX_EXEC_TIMEOUT).catch((err) => {
      if (err.name === 'TimeoutError') {
        err.message = 'Your code took too long to execute. This could be the result of trying to fetch data that\'s not available on the IPFS network. Take a close look at your code with this possiblity in mind. Still can\'t figure out what\'s wrong? Use the View Solution feature above to see our suggested approach to this challenge.'
      }
      throw err
    })
  } catch (error) {
    result = error
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
    Header,
    Quiz,
    Resources,
    Breadcrumbs,
    Progress,
    Concepts,
    FileUpload,
    CodeEditor,
    Output,
    Info,
    Validator,
    CongratulationsCallout,
    TypeIcon
  },
  props: {
    lessonId: Number,
    lessonTitle: String,
    isResources: Boolean,
    resources: Array,
    text: String,
    exercise: String,
    concepts: String,
    solution: String,
    modules: Object,
    validate: Function,
    code: String,
    overrideErrors: Boolean,
    isMultipleChoiceLesson: Boolean,
    question: String,
    choices: Array,
    createTestFile: Boolean,
    createTestTree: Boolean
  },
  data: self => {
    return {
      isSubmitting: false,
      lessonPassed: !!localStorage['passed' + self.$route.path],
      lessonKey: 'passed' + self.$route.path,
      cacheKey: 'cached' + self.$route.path,
      cachedCode: !!localStorage['cached' + self.$route.path],
      editorCode: localStorage[self.cacheKey] || self.code || self.defaultCode,
      viewSolution: false,
      cachedStateMsg: '',
      showUploadInfo: false,
      expandExercise: false,
      editorReady: false,
      isFileLesson: self.isFileLesson,
      uploadedFiles: window.uploadedFiles || false,
      choice: localStorage[self.cacheKey] || '',
      cachedChoice: !!localStorage['cached' + self.$route.path]
    }
  },
  computed: {
    tutorial: function () {
      return getTutorialByUrl(this.$route.params.tutorialUrl)
    },
    isTutorialPassed: function () {
      return isTutorialPassed(this.tutorial)
    },
    lesson: function () {
      return getLesson(this.tutorial.formattedId, this.lessonId)
    },
    lessonIssueUrl: function () {
      return encodeURI(`https://github.com/ProtoSchool/protoschool.github.io/issues/new?assignees=&labels=lesson-feedback&template=lesson-feedback.md&title=Lesson+Feedback%3A+${this.tutorial.shortTitle}+-+Lesson+${this.lessonId}+(${this.lesson.title})`)
    },
    tutorialIssueUrl: function () {
      return encodeURI(`https://github.com/ProtoSchool/protoschool.github.io/issues/new?assignees=&labels=tutorial-feedback&template=tutorial-feedback.md&title=Tutorial+Feedback%3A+${this.tutorial.shortTitle}`)
    },
    lessonsInTutorial: function () {
      return this.tutorial.lessons.length
    },
    nextLessonIsResources: function () {
      const basePath = this.$route.path.slice(0, -2)
      const hasResources = this.$router.resolve(basePath + 'resources').route.name !== '404'
      return this.lessonId === this.lessonsInTutorial && hasResources
    }
  },
  beforeCreate: function () {
    this.output = {}
    this.defaultCode = defaultCode
    this.IPFSPromise = import('ipfs').then(m => m.default)
  },
  beforeMount: function () {
    this.choice = localStorage[this.cacheKey] || ''
  },
  mounted: function () {
    if (this.isResources) {
      localStorage[this.lessonKey] = 'passed'
      this.trackEvent(EVENTS.LESSON_PASSED)
    }
  },
  methods: {
    setEditorCode (newCode) {
      localStorage[this.cacheKey] = newCode
      this.editorCode = newCode

      return newCode
    },
    validationIssueUrl: function (code, validationTimeout) {
      return newGithubIssueUrl({
        user: 'ProtoSchool',
        repo: 'protoschool.github.io',
        title: `Validation Error: ${this.tutorial.shortTitle} - Lesson ${this.lessonId} (${this.lesson.title})`,
        labels: ['lesson-feedback', 'validation-error'],
        body: `If you submitted code for a lesson and received feedback indicating a validation error, you may have uncovered a bug in our lesson validation code. We've prepopulated the error type and the last code you submitted below as diagnostic clues. Feel free to add additional feedback about the lesson below before clicking "Submit new issue."

        \n**Before your code submission errored out, had you found anything about this lesson confusing?**\n
        \n**Any other feedback you'd like to share about this lesson?**\n
        \n**Any other feedback you'd like to share about ProtoSchool?**\n
        \nThank you for submitting your feedback to help us diagnose the problem!
        -----------------------------------------------------------------------
        Please do not edit the diagnostic information below this line.
        \n**Error type:**\n
        ${validationTimeout ? 'Validation timeout' : 'Missing validation case'}\n
        \n**The code that caused the error:**
        \n\`\`\`javascript\n${code}\n\`\`\`
        `
      })
    },
    run: async function (auto = false) {
      const args = []
      this.isSubmitting = true
      if (oldIPFS) {
        oldIPFS.stop()
        oldIPFS = null
      }
      const output = this.output
      const ipfs = await this.createIPFS()

      await ipfs.ready
      if (this.createTestFile) {
        await this.createFile(ipfs)
      }
      if (this.createTestTree) {
        await this.createTree(ipfs)
      }

      const code = this.editor.getValue()
      let modules = {}

      if (this.isFileLesson && this.uploadedFiles === false && auto === true) {
        this.showUploadInfo = true
        this.isSubmitting = false
        return
      } else {
        this.showUploadInfo = false
      }

      if (this.modules) modules = this.modules
      if (this.isFileLesson) args.unshift(this.uploadedFiles)
      // Output external errors or not depending on flag
      const result = await _eval(code, ipfs, modules, args)
      if (!this.overrideErrors && result instanceof Error) {
        Vue.set(output, 'test', result)
        this.lessonPassed = !!localStorage[this.lessonKey]
        this.isSubmitting = false
        this.clearPassed()
        if (auto !== true) {
          this.trackEvent(EVENTS.CODE_SUBMIT_WRONG)
        }
        return
      }
      // Hide the solution
      this.viewSolution = false

      let test

      // Run the `validate` function in the lesson
      try {
        test = await this.validate(result, ipfs, args)
      } catch (error) {
        console.error(error)
        // Something in our validation threw an error, it's probably a bug
        test = {
          fail: `You may have uncovered a bug in our validation code. Please help us improve this lesson by [**opening an issue**](${this.validationIssueUrl(code, true)}) noting that you encountered a validation timeout error. Then you can click **Reset Code** above the code editor, review the instructions, and try again. Still having trouble? Click **View Solution** below the code editor to see the approach we recommend for this challenge.`
        }
      }

      if (result instanceof Error) {
        if (test == null || !test.overrideError) {
          // In case of an error, if the author did not return anything or isn't sending an overriding error message, use the base error
          test = {
            fail: result.toString()
          }
        }
      } else if (test == null) {
        const validationErrorMessage = `You may have uncovered a bug in our validation code. Please help us improve this lesson by [**opening an issue**](${this.validationIssueUrl(code, false)}) noting that you encountered a validation case error. Then you can click **Reset Code**, review the instructions, and try again. Still having trouble? Click **View Solution** below the code editor to see the approach we recommend for this challenge.`
        // Our validation did not return anything and the original result is also not an error.
        // This may be the result of a missing validation case + not returning anything by default
        test = {
          fail: validationErrorMessage
        }
      }

      Vue.set(output, 'test', test)
      if (CID.isCID(result)) {
        oldIPFS = ipfs
        Vue.set(output.test, 'cid', result)
      } else {
        ipfs.stop()
      }
      if (output.test.success) {
        localStorage[this.lessonKey] = 'passed'
        if (auto !== true) {
          // track lesson passed if it has an exercise (incl file ones)
          this.trackEvent(EVENTS.LESSON_PASSED)
          this.updateTutorialState()
        }
      } else {
        this.clearPassed()
        if (auto !== true) {
          this.trackEvent(EVENTS.CODE_SUBMIT_WRONG)
        }
      }
      this.lessonPassed = !!localStorage[this.lessonKey]
      this.isSubmitting = false
    },
    createIPFS: function () {
      if (this.$attrs.createIPFS) {
        return this.$attrs.createIPFS()
      } else {
        const ipfs = this.IPFSPromise.then(IPFS => {
          this.ipfsConstructor = IPFS
          return new IPFS({ repo: Math.random().toString() })
        })
        return ipfs
      }
    },
    createFile: function (ipfs) {
      /* eslint-disable no-new */
      return ipfs.add(this.ipfsConstructor.Buffer.from('You did it!'))
    },
    createTree: function (ipfs) {
      /* eslint-disable no-new */
      return ipfs.add([
        {
          content: this.ipfsConstructor.Buffer.from('¯\\_(ツ)_/¯'),
          path: 'shrug.txt'
        },
        {
          content: this.ipfsConstructor.Buffer.from(':)'),
          path: 'smile.txt'
        },
        {
          content: this.ipfsConstructor.Buffer.from('You did it!'),
          path: 'fun/success.txt'
        }
      ], { wrapWithDirectory: true })
    },
    resetCode: function () {
      // TRACK? User chose to reset code
      this.editorCode = this.setEditorCode(this.code || defaultCode)
      // this ^ triggers onCodeChange which will clear cache
      this.editor.setValue(this.editorCode)
      this.clearPassed()
      delete this.output.test
      this.showUploadInfo = false
      this.trackEvent(EVENTS.CODE_RESET)
    },
    resetFileUpload: function () {
      this.uploadedFiles = false
      delete this.output.test
      this.clearPassed()
    },
    clearPassed: function () {
      delete localStorage[this.lessonKey]
      delete localStorage[`passed/${this.tutorial.url}`]
    },
    loadCodeFromCache: function () {
      this.editorCode = localStorage[this.cacheKey]
      this.editor.setValue(this.editorCode)
    },
    updateTutorialState: function () {
      for (let i = 1; i <= this.lessonsInTutorial; i++) {
        const lessonNr = i.toString().padStart(2, 0)
        const lsKey = `passed/${this.tutorial.url}/${lessonNr}`
        if (localStorage[lsKey] !== 'passed') {
          return false
        }
      }
      localStorage[`passed/${this.tutorial.url}`] = 'passed'
      this.trackEvent(EVENTS.TUTORIAL_PASSED)
      return true
    },
    trackEvent: function (event, opts = {}) {
      window.Countly.q.push(['add_event', {
        key: event,
        segmentation: {
          tutorial: this.tutorial.shortTitle,
          lessonNumber: this.lessonId,
          path: this.$route.path,
          ...opts
        }
      }])
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
      if (this.editor.getValue() === (this.code || defaultCode)) {
        // TRACK? edited back to default state by chance or by 'reset code'
        delete localStorage[this.cacheKey]
        this.cachedCode = !!localStorage[this.cacheKey]
      } else if (this.editorCode === this.editor.getValue()) {
        // TRACK? returned to cached lesson in progress
      } else {
        this.editorCode = this.setEditorCode(this.editor.getValue())
        this.cachedCode = !!localStorage[this.cacheKey]
        this.cachedStateMsg = "We're saving your code as you go."
        if (this.editorCode !== this.solution) {
          this.clearPassed()
          delete this.output.test
        }
      }
    },
    handleRadioChoice (result) {
      localStorage[this.cacheKey] = result.selected
      this.choice = localStorage[this.cacheKey]
      this.cachedChoice = !!localStorage[this.cacheKey]
      Vue.set(this.output, 'test', result)
      if (this.output.test.success) {
        localStorage[this.lessonKey] = 'passed'
        this.lessonPassed = !!localStorage[this.lessonKey]
        if (result.auto !== true) {
          // track multiple choice lesson passed if not on page load
          this.trackEvent(EVENTS.LESSON_PASSED)
          this.updateTutorialState()
        }
      } else {
        this.clearPassed()
        if (result.auto !== true) {
          this.trackEvent(EVENTS.CHOICE_SUBMIT_WRONG, { wrongChoice: result.selected })
        }
      }
    },
    next: function () {
      if (this.exercise) {
        Vue.set(this.output, 'test', null)
      } else {
        localStorage[this.lessonKey] = 'passed'
        // track passed lesson if text only
        if (!this.isMultipleChoiceLesson) {
          this.trackEvent(EVENTS.LESSON_PASSED)
          this.updateTutorialState()
        }
      }
      const current = this.lessonId

      const next = this.nextLessonIsResources
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
      this.$router.push({ path: '/tutorials/' })
    },
    toggleExpandExercise: function () {
      this.expandExercise = !this.expandExercise
    },
    cyReplaceWithSolution: function () {
      this.editor.setValue(this.solution)
    },
    parseData: (data) => marked(data).html
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
