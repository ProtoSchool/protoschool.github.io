<template>
  <div class="lesson-pw-02">
    <Lesson v-bind:text="text" v-bind:code="code" :validate="validate"
            lessonTitle="Your first link">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './02.md'
const CID = require('cids')

const code = `/* globals ipfs */

const run = async () => {
  const hello = {hello: "world!"}

  // Your code goes here

  const cid = await ipfs.dag.put(hello)
  return cid
}

return run
`

const validate = async (result, ipfs) => {
  if (!result) {
    return {fail: 'You forgot to return a result :)'}
  }
  if (!CID.isCID(result)) {
    return {fail: 'Did not return a valid CID instance.'}
  }
  // TODO vmx 2018-07-20: Use proper hash, this is the hash of `pic: "TODO"```:w
  const hash = 'zdpuAuVBsCVYPgtJu72kH6EnF3vs8ffKxobSchS8GdpkFJBWk'
  if (result.toBaseEncodedString() === hash) {
    return {success: 'All works!'}
  } else {
    const obj = await ipfs.dag.get(result)
    const expected = JSON.stringify({hello: 'world!', pic: 'TODO'})
    const got = JSON.stringify(obj.value)
    const fail = `Was expecting "${expected}" but got "${got}"`
    return {fail}
  }
}

export default {
  components: {
    Lesson
  },
  data: () => {
    return {
      code,
      text,
      validate
    }
  }
}
</script>
