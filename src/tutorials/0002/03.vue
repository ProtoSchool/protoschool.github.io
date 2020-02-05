<template>
  <Lesson
    :lessonId="lessonId"
    :tutorialId="tutorialId"
    :text="text"
    :validate="validate"
    :modules="modules"
    :exercise="exercise"
    :solution="solution"
    :code="code" />
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './03.md'
import exercise from './03-exercise.md'

const validate = async (result, ipfs) => {
  if (!result) {
    return { fail: 'No result was returned. Perhaps you tried to access the `value` of the object returned by `ipfs.dag.get` without waiting for the promise to be completed (wrapping the `await` statement in parentheses)?' }
  }

  if (result === 1) {
    return { success: 'Great job! You\'ve completed this series of lessons!' }
  } else if (result.value === 1 && result.remainderPath === '') {
    return {
      fail: 'Be sure to return only the `value` of `test`.',
      logDesc: 'Remember that `ipfs.dag.get` returns an object with a `value` property. Your function returned:',
      log: JSON.stringify(result)
    }
  } else {
    const got = JSON.stringify(result)

    return { fail: `Was expecting \`1\` but got \`${got}\`.` }
  }
}

const code = `/* globals ipfs */

const run = async () => {
  let cid = await ipfs.dag.put({ test: 1 })
  let cid2 = await ipfs.dag.put({ bar: cid })
  // your code goes here
}

return run
`

const solution = `/* globals ipfs */

const run = async () => {
  let cid = await ipfs.dag.put({ test: 1 })
  let cid2 = await ipfs.dag.put({ bar: cid })
  let node = await ipfs.dag.get(cid2, '/bar/test')
  return node.value
}

return run
`

const modules = { cids: require('cids') }

export default {
  components: {
    Lesson
  },
  data: self => {
    return {
      lessonId: self.$attrs.lessonId,
      tutorialId: self.$attrs.tutorialId,
      text,
      exercise,
      solution,
      validate,
      modules,
      code
    }
  }
}
</script>
