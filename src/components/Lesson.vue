<template>
  <div :class="{'overflow-hidden': expandChallenge}">
    <TutorialRedirectModal :tutorial="tutorial" :lesson="lesson" />
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
              :lessonId="isResources ? 'resources' : lessonId"
              :tutorialId="tutorial.formattedId"
              class="h2 ml3" />
        </div>
        <TutorialCompletionCallout
            v-if="isResources && isTutorialPassed"
            :tutorial="tutorial"
            class="mv4"
        />
        <h1 v-if="!isResources">{{lesson.title}}</h1>
        <Concepts v-if="concepts" :concepts="concepts" />
        <Resources v-if="isResources"
          :data="resources"
          :tutorialId="tutorial.formattedId"
          :project="tutorial.project.id"
        />
        <!--
          only add the text on data-cy-text when not in production
          otherwise the html document will be bigger than it needs to in production
         -->
        <div
          v-else class="lesson-text lh-copy"
          v-html="text"
          :data-cy-text="!isProduction && text"
        >
        </div>
      </section>
      <section v-if="challenge || isMultipleChoiceLesson" :class="{expand: expandChallenge}" class="challenge center pa3 ph4-l flex flex-column">
        <div class="flex-none">
          <Progress
            :isMultipleChoiceLesson="isMultipleChoiceLesson"
            :lessonPassed="lessonPassed"
            :cachedChoice="cachedChoice"
            :cachedCode="cachedCode"
            :cachedStateMsg="cachedStateMsg"
            :expandChallenge="expandChallenge"
            :toggleExpandChallenge="toggleExpandChallenge" />
          <div v-html="challenge" class='lh-copy' />
          <FileUpload
            v-if="isFileLesson"
            :onFileClick="onFileClick"
            :onFileDrop="onFileDrop"
            :resetFileUpload="resetFileUpload"
            :uploadedFiles="uploadedFiles" />
          <CodeEditor
            v-if="challenge"
            :isFileLesson="isFileLesson"
            :editorReady="editorReady"
            :code="editorCode"
            :solution="solution"
            :cachedCode="cachedCode"
            :onMounted="onMounted"
            :onCodeChange="onCodeChange"
            :resetCode="resetCode"
            :expandChallenge="expandChallenge"
            :cyReplaceWithSolution="cyReplaceWithSolution"
            :cyClearDefaultCode="cyClearDefaultCode"
            :trackingData="trackingData"
          />
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
            :parseData="parseData"
            :trackingData="trackingData"
          />
          <Info
            v-if="(challenge && !isSubmitting && !output.test) || (output.test && output.test.fail && showLessonChangedInfo)"
            :showUploadInfo="showUploadInfo"
            :showLessonChangedInfo="showLessonChangedInfo"
            :isFileLesson="isFileLesson"
          />
        </div>
      </section>
      <Validator
        :challenge="challenge"
        :isFileLesson="isFileLesson"
        :isMultipleChoiceLesson="isMultipleChoiceLesson"
        :uploadedFiles="uploadedFiles"
        :lessonPassed="lessonPassed"
        :output="output.test"
        :isResources="isResources"
        :nextLessonIsResources="nextLessonIsResources"
        :lessonNumber="lessonId"
        :lessonsInTutorial="lessonsInTutorial"
        :expandChallenge="expandChallenge"
        :isSubmitting="isSubmitting"
        :run="run"
        :next="next" />
    </div>
    <div class="mt4 ph3-ns bg-aqua navy">
      <div v-if="isResources" class="mw7 center ph3">
        <p>How did you feel about this tutorial? We'd love to hear your thoughts and suggestions for improvement! Please <a :href="tutorialIssueUrl" target="_blank">share your feedback</a>.</p>
      </div>
      <div v-else class="mw7 center ph3">
        <p><strong>Feeling stuck?</strong> We'd love to hear what's confusing so we can improve this lesson. Please <a :href="lessonIssueUrl" target="_blank">share your questions and feedback</a>.</p>
      </div>
    </div>
    <Footer
      noTopMargin
    />
  </div>
</template>

<script>
import Vue from 'vue'
import CID from 'cids'
import pTimeout from 'p-timeout'
import all from 'it-all'
import toBuffer from 'it-to-buffer'
import newGithubIssueUrl from 'new-github-issue-url'

import { isProduction } from '../utils/env'
import {
  getTutorialByUrl,
  isTutorialPassed,
  setTutorialPassed,
  setLessonPassed,
  getLesson,
  isLessonPassed,
  getTutorialType
} from '../utils/tutorials'
import countly from '../utils/countly'
import marked from '../utils/marked'
import Header from './layout/Header.vue'
import Footer from './layout/Footer.vue'
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
import TutorialCompletionCallout from './callouts/TutorialCompletion.vue'
import TutorialRedirectModal from './modals/TutorialRedirectModal.vue'
import TypeIcon from './TypeIcon.vue'

const MAX_EXEC_TIMEOUT = isProduction ? 10000 : 60000

class SyntaxError extends Error {
  toString () {
    return `SyntaxError: ${this.message}`
  }
}

const _eval = async (text, ipfs, args = []) => {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return new Error('Please submit a solution.')
  }

  const modules = {
    ipfs, all, toBuffer
  }

  let fn
  try {
    // eslint-disable-next-line
    fn = new Function(Object.keys(modules).join(','), text)
  } catch (error) {
    return new SyntaxError(error.message, error)
  }

  let result

  try {
    result = await pTimeout(fn.apply(null, Object.values(modules))(...args), MAX_EXEC_TIMEOUT).catch((err) => {
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

const defaultCode = `/* globals ipfs, all, toBuffer */

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
    TutorialCompletionCallout,
    TutorialRedirectModal,
    TypeIcon,
    Footer
  },
  props: {
    lessonId: Number,
    lessonTitle: String,
    isResources: Boolean,
    resources: Array,
    text: String,
    challenge: String,
    concepts: String,
    solution: String,
    validate: Function,
    code: String,
    overrideErrors: Boolean,
    question: String,
    choices: Array,
    createTestFile: Boolean,
    createTestTree: Boolean
  },
  data: self => {
    const routePath = self.$route.path.endsWith('/') ? self.$route.path.slice(0, self.$route.path.length - 1) : self.$route.path

    return {
      isSubmitting: false,
      lessonPassed: !!localStorage['passed' + routePath],
      lessonKey: 'passed' + routePath,
      cacheKey: 'cached' + routePath,
      cachedCode: !!localStorage['cached' + routePath],
      editorCode: localStorage[self.cacheKey] || self.code || self.defaultCode,
      viewSolution: false,
      cachedStateMsg: '',
      showUploadInfo: false,
      showLessonChangedInfo: false,
      expandChallenge: false,
      editorReady: false,
      isFileLesson: self.isFileLesson,
      isMultipleChoiceLesson: self.isMultipleChoiceLesson,
      uploadedFiles: window.uploadedFiles || [],
      choice: localStorage[self.cacheKey] || '',
      cachedChoice: !!localStorage['cached' + routePath],
      output: self.output,
      isProduction
    }
  },
  computed: {
    routePath: function () {
      return this.$route.path.endsWith('/') ? this.$route.path.slice(0, this.$route.path.length - 1) : this.$route.path
    },
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
      const basePath = this.routePath.slice(0, -2)
      const hasResources = this.$router.resolve(basePath + 'resources').route.name !== '404'
      return this.lessonId === this.lessonsInTutorial && hasResources
    },
    tutorialType: function () {
      return getTutorialType(this.tutorial.formattedId)
    },
    trackingData: function () {
      return {
        tutorial: this.tutorial.shortTitle,
        lessonNumber: this.isResources ? 'resources' : this.lessonId,
        path: this.routePath,
        lessonType: this.lesson.type,
        tutorialType: this.tutorialType,
        project: this.tutorial.project.name
      }
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
      setLessonPassed(this.tutorial, this.lesson)
      countly.trackEventOnce(countly.events.LESSON_PASSED, this.trackingData)
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

      if (this.isFileLesson && this.uploadedFiles.length === 0 && auto === true) {
        this.showUploadInfo = true
        this.isSubmitting = false
        return
      } else {
        this.showUploadInfo = false
        this.showLessonChangedInfo = false
      }

      if (this.isFileLesson) args.unshift(this.uploadedFiles)
      // Output external errors or not depending on flag
      const result = await _eval(code, ipfs, args)
      if (!this.overrideErrors && result instanceof Error) {
        Vue.set(output, 'test', result)
        this.lessonPassed = !!localStorage[this.lessonKey]
        this.isSubmitting = false
        this.clearPassed()
        if (auto !== true) {
          countly.trackEvent(countly.events.CODE_SUBMIT_WRONG, this.trackingData)
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
        setLessonPassed(this.tutorial, this.lesson)
        if (auto !== true) {
          // track lesson passed if it has a challenge (incl file ones)
          countly.trackEventOnce(countly.events.LESSON_PASSED, this.trackingData)
          this.updateTutorialState()
        }
      } else {
        if (isLessonPassed(this.tutorial, this.lesson)) {
          this.showLessonChangedInfo = true
        }
        this.clearPassed()
        if (auto !== true) {
          countly.trackEvent(countly.events.CODE_SUBMIT_WRONG, this.trackingData)
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
          return IPFS.create({ repo: Math.random().toString() })
        })
        return ipfs
      }
    },
    createFile: function (ipfs) {
      // create a sample file for the user to read from, acessible at this CID:
      // QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ
      /* eslint-disable no-new */
      return ipfs.add('You did it!')
    },
    createTree: function (ipfs) {
      // create a sample directory for the user to read from, acessible at these CIDs:
      // top-level directory: QmcmnUvVV31txDfAddgAaNcNKbrtC2rC9FvkJphNWyM7gy
      // `fun` directory: QmPT14mWCteuybfrfvqas2L2oin1Y2NCbwzTh9cc33GM1r
      /* eslint-disable no-new */
      return all(ipfs.addAll([
        {
          content: '¯\\_(ツ)_/¯',
          path: 'shrug.txt'
        },
        {
          content: ':)',
          path: 'smile.txt'
        },
        {
          content: 'You did it!',
          path: 'fun/success.txt'
        }
      ], { wrapWithDirectory: true }))
    },
    resetCode: function () {
      this.editorCode = this.setEditorCode(this.code || defaultCode)
      // this ^ triggers onCodeChange which will clear cache
      this.editor.setValue(this.editorCode)
      this.clearPassed()
      delete this.output.test
      this.showUploadInfo = false
      countly.trackEvent(countly.events.CODE_RESET, this.trackingData)
    },
    resetFileUpload: function () {
      this.uploadedFiles = []
      this.onFilesReset()
      delete this.output.test
    },
    clearPassed: function () {
      delete localStorage[this.lessonKey]
      delete localStorage[`passed/${this.tutorial.url}`]
      this.lessonPassed = !!localStorage[this.lessonKey]
    },
    loadCodeFromCache: function () {
      this.editorCode = localStorage[this.cacheKey]
      this.editor.setValue(this.editorCode)
    },
    updateTutorialState: function () {
      for (let i = 1; i <= this.lessonsInTutorial; i++) {
        const lessonNr = i.toString().padStart(2, 0)
        const lsKey = `passed/${this.tutorial.url}/${lessonNr}`

        if (!localStorage[lsKey]) {
          return false
        }
      }

      setTutorialPassed(this.tutorial)
      countly.trackEventOnce(countly.events.TUTORIAL_PASSED, {
        tutorial: this.trackingData.tutorial,
        tutorialType: this.trackingData.tutorialType,
        project: this.trackingData.project
      })

      return true
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
        setLessonPassed(this.tutorial, this.lesson)
        this.lessonPassed = !!localStorage[this.lessonKey]
        if (result.auto !== true) {
          // track multiple choice lesson passed if not on page load
          countly.trackEventOnce(countly.events.LESSON_PASSED, this.trackingData)
          this.updateTutorialState()
        }
      } else {
        this.clearPassed()
        if (result.auto !== true) {
          countly.trackEventOnce(countly.events.CHOICE_SUBMIT_WRONG, { ...this.trackingData, wrongChoice: result.selected })
        }
      }
    },
    next: function () {
      if (this.challenge) {
        Vue.set(this.output, 'test', null)
      } else {
        setLessonPassed(this.tutorial, this.lesson)
        // track passed lesson if text only
        if (!this.isMultipleChoiceLesson) {
          countly.trackEventOnce(countly.events.LESSON_PASSED, this.trackingData)
          this.updateTutorialState()
        }
      }

      const next = this.nextLessonIsResources
        ? `/${this.tutorial.url}/resources`
        : this.tutorial.lessons[this.tutorial.lessons.findIndex(lesson => lesson === this.lesson) + 1].url

      this.$router.push({ path: next })
    },
    toggleExpandChallenge: function () {
      this.expandChallenge = !this.expandChallenge
    },
    cyReplaceWithSolution: function () {
      this.editor.setValue(this.solution)
    },
    cyClearDefaultCode: function () {
      this.editor.setValue('  ')
    },
    parseData: (data) => marked(data).html
  }
}
</script>

<style scoped>
.container {
  flex-grow: 1;
}

.challenge {
  overflow: hidden;
  background: #F6F7F9;
  max-width: 48rem;
}

.challenge.expand {
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
