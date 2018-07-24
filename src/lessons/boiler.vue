<template>
  <div class="lesson-REPLACEME">
    <Lesson v-bind:text="text" v-bind:code="code"
            :validate="validate"
            :modules="modules"
    >
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../components/Lesson'
import text from './REPLACEME.md'

const validate = async (result, ipfs) => {
  if (result) {
    return {'success': 'Happy Message!'}
  } else {
    return {'fail': 'Sad but useful message :('}
  }
}

const code = `const CID = require('cids')

const run = async () => {
  /* your code here */
}
return run
`

const modules = {cids: require('cids')}

export default {
  components: {
    Lesson
  },
  data: () => {
    return {
      text, validate, code, modules
    }
  }
}
</script>
