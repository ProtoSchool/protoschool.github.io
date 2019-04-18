<template>
  <div>
    <Header/>
    <div class="center mw7 ph2">
      <div class="flex-l items-start  center mw7 ph2">
        <section class="pv3 mt3">
            <div class="lh-solid v-mid f4">
              <span class="green v-mid"><span class="b">{{workshopShortname}}</span> | Lesson {{lessonNumber}} of {{lessonsInWorkshop}}</span>
              <span class="pl1"><img v-if="lessonPassed" src="../static/images/complete.svg" alt="complete" style="height: 1.2rem;" class="v-mid"/></span>
            </div>
            <h1>{{lessonTitle}}</h1>
          <div class="lesson-text lh-copy" v-html="parsedText"></div>
        </section>
        <section v-if="concepts" class='dn db-ns ba border-green ph4 ml3 ml5-l mt5 mb3 mr3 measure' style="background: rgba(105, 196, 205, 10%)">
          <h2 class="f5 fw2 green mt0 nb1 pt3">Useful concepts</h2>
          <div class='f6 lh-copy' v-html="parsedConcepts"></div>
        </section>
      </div>
      <section v-if="exercise" v-bind:class="{expand: expandExercise}" class="exercise pb4 pt3 ph3 ph4-l mb3 mr5 flex flex-column" style="background: #F6F7F9;">
        <div class="flex-none">
          <h2 class="mt0 mb2 green fw4 fill-current">
            <span style='vertical-align:-1px'>
              <img v-if="lessonPassed" src="../static/images/complete.svg" alt="complete" style="height: 1rem;"/>
              <img v-else-if="cachedCode" src="../static/images/in-progress.svg" alt="complete" style="height: 1rem;"/>
              <img v-else src="../static/images/not-started.svg" alt="not yet started" style="height: 1rem;"/>
            </span>
            <span class="green ttu f6 pl2 pr1 fw7 v-mid">
              <span v-if="lessonPassed">You did it!</span>
              <span v-else-if="cachedCode">Keep working.</span>
              <span v-else>Try it!</span>
            </span>
            <span class="green f6 fw5 v-mid">
              <span v-if="cachedCode && !lessonPassed">{{cachedStateMsg}}</span>
            </span>
            <div class="fr">
              <button
                v-if="expandExercise"
                title="go smol"
                v-on:click="toggleExpandExercise"
                class='b--transparent bg-transparent green hover-green-muted pointer focus-outline'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 32 32"><path d="M16 4 L28 4 L28 16 L24 12 L20 16 L16 12 L20 8z M4 16 L8 20 L12 16 L16 20 L12 24 L16 28 L4 28z"></path></svg>
              </button>
              <button
                v-else
                v-on:click="toggleExpandExercise"
                title='embiggen the exercise'
                class='b--transparent bg-transparent charcoal-muted hover-green pointer focus-outline'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 32 32"><path d="M16 4 L28 4 L28 16 L24 12 L20 16 L16 12 L20 8z M4 16 L8 20 L12 16 L16 20 L12 24 L16 28 L4 28z"></path></svg>
              </button>

            </div>
          </h2>
          <div v-if="exercise" v-html="parsedExercise" class='lh-copy'></div>
          <div v-if="isFileLesson">
            <div class="f5 fw7 mt4 mb2"> Step 1: Upload file(s)
              <span class="pl1"><img v-if="uploadedFiles" src="../static/images/complete.svg" alt="complete" style="height: 1.2rem;" class="v-mid"/></span>
            </div>
              <div id="drop-area" v-if="!uploadedFiles" v-on:drop="onFileDrop"
                v-on:click="onFileClick"
                @dragenter="dragging=true" @dragend="dragging=false" @dragleave="dragging=false"
                @dragover.prevent v-bind:class="{dragging: dragging}" class="dropfile mb2 pa2 w-100 br3 shadow-4 bg-white color-navy">
                <div class="o-80 glow">
                  <label for="add-files" class="flex items-center h4 pointer">
                    <svg viewBox="0 0 100 100" class="fill-aqua" height="60px" alt="Add"><path d="M71.13 28.87a29.88 29.88 0 1 0 0 42.26 29.86 29.86 0 0 0 0-42.26zm-18.39 37.6h-5.48V52.74H33.53v-5.48h13.73V33.53h5.48v13.73h13.73v5.48H52.74z"></path></svg>
                    <div class="f5 charcoal">
                        <p><strong>Drop one or more files here or click to select.</strong> Folder upload is not supported, but you may select multiple files using Ctrl+Click or Command+Click.</p>
                    </div>
                  </label>
                </div>
              </div>
              <div v-else class="mt2">
                <span v-on:click="resetFileUpload" class="textLink fr pb1">Start Over</span>
                <div class="mb2 pl3 pa2 w-100 br3 h4 shadow-4 bg-white color-navy flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="fill-aqua" height="60px"><path d="M55.94 19.17H30a4 4 0 0 0-4 4v53.65a4 4 0 0 0 4 4h40.1a4 4 0 0 0 4-4V38.06zm5.28 21.08c-4.33 0-7.47-2.85-7.47-6.77V21l18.13 19.25z"/></svg>
                  <ul class="list pl0">
                    <li v-for="(file, idx) in uploadedFiles" :key="`file-${idx}`">{{file.name}}</li>
                  </ul>
                </div>
              </div>
            <div class="f5 fw7 mt4 mb2">Step 2: Update code
              <span class="pl1"><img v-if="cachedCode" src="../static/images/complete.svg" alt="complete" style="height: 1.2rem;" class="v-mid"/></span>
            </div>
          </div>
        </div>
        <div>
          <span v-if="cachedCode" v-on:click="resetCode" class="textLink fr pb1">Reset Code</span>
        </div>
        <div class="bg-white flex-auto" style='height:100%;'>
          <MonacoEditor
            class="editor"
            srcPath="."
            :height="editorHeight"
            :options="options"
            :code="code"
            theme="vs"
            language="javascript"
            @mounted="onMounted"
            @codeChange="onCodeChange">
          </MonacoEditor>
        </div>
        <div class='flex-none'>
          <div class="pv2">
            <div v-if="output.test && cachedCode" v-bind="output.test">
              <div class="lh-copy pv2 ph3 bg-red white" v-if="output.test.error">
                Error: {{output.test.error.message}}
              </div>
              <div class="lh-copy pv2 ph3 bg-red white" v-if="output.test.fail">
                {{output.test.fail}}
              </div>
              <div class="lh-copy pv2 ph3 bg-green white" v-if="output.test.success && lessonPassed">
                {{output.test.success}}
                <a v-if="output.test.cid"
                class="link fw7 underline-hover dib ph2 mh2 white"  target='explore-ipld' :href='exploreIpldUrl'>
                  View in IPLD Explorer
                </a>
              </div>
            </div>
            <div class="lh-copy pv2 ph3" v-else>
              <div v-if="isFileLesson">
                Upload file(s) and update the code to complete the exercise. Click <strong>Submit</strong> to check your answer.
              </div>
              <div v-else>
                Update the code to complete the exercise. Click <strong>Submit</strong> to check your answer.
              </div>
            </div>
          </div>
          <div class="pt3 ph2 tr">
            <div v-if="lessonPassed && (lessonNumber === lessonsInWorkshop)">
              <Button v-bind:click="tutorialMenu" class="bg-aqua white">More Tutorials</Button>
            </div>
            <div v-else-if="lessonPassed">
              <Button v-bind:click="next" class="bg-aqua white">Next</Button>
            </div>
            <div v-else>
              <span v-if="isFileLesson && !uploadedFiles" class="disabledButtonWrapper"><Button v-bind:click="next" class="bg-aqua white" disabled>Submit</Button></span>
              <Button v-else v-bind:click="run" class="bg-aqua white">Submit</Button>
              <div v-if="isFileLesson && !uploadedFiles" class="red lh-copy pt2 o-0">
                You must upload a file before submitting.
              </div>
            </div>
          </div>
        </div>
      </section>
      <section v-else >
        <div class="pt3 ph2 tr mb3">
          <div v-if="lessonNumber === lessonsInWorkshop">
            <Button v-bind:click="tutorialMenu" class="bg-aqua white">More Tutorials</Button>
          </div>
          <div v-else>
            <Button v-bind:click="next" class="bg-aqua white">Next</Button>
          </div>
        </div>
      </section>
    </div>
    <footer class="bg-navy white ph2 ph3-ns mt4 flex items-center justify-around">
      <div class="mw7">
        <p>Feeling stuck? We'd love to hear what's confusing so we can improve
        this lesson. Please <a :href="issueUrl" target="_blank">share your questions and feedback</a>.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import 'highlight.js/styles/github.css'
import Vue from 'vue'
import MonacoEditor from 'vue-monaco-editor'
import Explorer from './Explorer.vue'
import Button from './Button.vue'
import Header from './Header.vue'
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
    MonacoEditor,
    Explorer,
    Button,
    Header
  },
  data: self => {
    return {
      text: self.$attrs.text,
      exercise: self.$attrs.exercise,
      concepts: self.$attrs.concepts,
      cachedCode: !!localStorage['cached' + self.$route.path],
      code: localStorage[self.cacheKey] || self.$attrs.code || self.defaultCode,
      overrideErrors: self.$attrs.overrideErrors,
      isFileLesson: self.isFileLesson,
      parsedText: marked(self.$attrs.text),
      parsedExercise: marked(self.$attrs.exercise || ''),
      parsedConcepts: marked(self.$attrs.concepts || ''),
      cacheKey: 'cached' + self.$route.path,
      cachedStateMsg: '',
      lessonKey: 'passed' + self.$route.path,
      lessonPassed: !!localStorage['passed' + self.$route.path],
      lessonTitle: self.$attrs.lessonTitle,
      output: self.output,
      expandExercise: false,
      dragging: false,
      uploadedFiles: window.uploadedFiles || false,
      options: {
        selectOnLineNumbers: false,
        lineNumbersMinChars: 3,
        scrollBeyondLastLine: false,
        automaticLayout: true
      }
    }
  },
  computed: {
    exploreIpldUrl: function () {
      let cid = this.output.test && this.output.test.cid && this.output.test.cid.toBaseEncodedString()
      cid = cid || ''
      return `https://explore.ipld.io/#/explore/${cid}`
    },
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
    issueUrl: function () {
      return `https://github.com/ProtoSchool/protoschool.github.io/issues/new?assignees=&labels=lesson-feedback&template=lesson-feedback.md&title=Lesson+Feedback%3A+${this.workshopShortname}+-+Lesson+${this.lessonNumber}+(${this.lessonTitle})`
    },
    lessonsInWorkshop: function () {
      let basePath = this.$route.path.slice(0, -2)
      let number = this.$route.path.slice(-2)
      while (this.$router.resolve(basePath + number).route.name !== '404') {
        number++
        number = number.toString().padStart(2, '0')
      }
      return parseInt(number) - 1
    },
    editorHeight: function () {
      if (this.expandExercise) {
        return undefined
      } else {
        const lineHeight = 18
        // In compact view show at least 12 lines, and at most 25 lines.
        const lines = Math.min(Math.max(this.code.split('\n').length, 12), 25)
        const height = lines * lineHeight
        return height
      }
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
    run: async function (...args) {
      if (oldIPFS) {
        oldIPFS.stop()
        oldIPFS = null
      }
      let output = this.output
      let ipfs = await this.createIPFS()
      let code = this.editor.getValue()
      let modules = {}
      if (this.$attrs.modules) modules = this.$attrs.modules
      if (this.isFileLesson) args.unshift(this.uploadedFiles)
      // Output external errors or not depending on flag
      let result = await _eval(code, ipfs, modules, args)
      if (!this.$attrs.overrideErrors && result && result.error) {
        Vue.set(output, 'test', result)
        this.lessonPassed = !!localStorage[this.lessonKey]
        return
      }
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
    },
    createIPFS: function () {
      if (this.$attrs.createIPFS) {
        return this.$attrs.createIPFS()
      } else {
        let ipfs = this.IPFSPromise.then(IPFS => {
          return new IPFS({repo: Math.random().toString()})
        })
        return ipfs
      }
    },
    resetCode: function () {
      // TRACK? User chose to reset code
      this.code = this.$attrs.code || defaultCode
      // this ^ triggers onCodeChange which will clear cache
      this.editor.setValue(this.code)
      this.clearPassed()
    },
    resetFileUpload: function () {
      this.uploadedFiles = false
      this.dragging = false
      console.log({uploadedFiles: this.uploadedFiles})
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
      if (this.cachedCode) {
        // TRACK? returned to lesson previously visited
        this.loadCodeFromCache()
        this.cachedStateMsg = "Pick up where you left off. We've saved your code for you!"
        if (this.lessonPassed) {
          this.run()
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
      let next = (parseInt(current) + 1).toString().padStart(2, '0')
      this.$router.push({path: next})
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
    }
  }
}
</script>

<style scoped>

button:disabled {
  cursor: not-allowed;
}

.disabledButtonWrapper:hover + div {
  opacity: 1;
  transition: opacity .2s ease-in;
}
.dragging {
  border: 5px solid #69c4cd;
}
.editor {
  height: 100%;
  min-height: 15rem;
}
.exercise {
  overflow: hidden;
  max-width: 100%;
  width: 900px;
}
.exercise.expand {
  height: 100vh;
  width: initial;
  margin: 0;
  width: auto;
  position: fixed;
  top:0;
  left: 0;
  right:0;
}
.indent-1 {
  margin-left: 1rem;
}
.mw-900 {
  max-width: 900px;
}
span.textLink {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}

footer a {
  color: aqua;
}

@media screen and (min-width: 60rem) {
  .indent-1 {
    margin-left: 93px;
  }
}

div.dropfile {
  cursor: pointer;
}
div.dropfile input {
  display: none;
}
div#drop-area * {
  pointer-events: none;
}
</style>
