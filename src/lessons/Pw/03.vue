<template>
  <div class="lesson-pw-03">
    <Lesson v-bind:text="text" v-bind:code="code" :validate="validate">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './03.md'
const CID = require('cids')

const code = `/* globals ipfs */

const run = async () => {
  const hello = {hello: "world!", pic: "TODO"}

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
  const expected = 'zdpuAuVBsCVYPgtJu72kH6EnF3vs8ffKxobSchS8GdpkFJBWk'
  const obj = await ipfs.dag.get(result)
  const gotAuthorCid = new CID(obj.value.author['/'])
  const got = gotAuthorCid.toBaseEncodedString()
  if (got === expected) {
    return {success: 'All works!'}
  } else {
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
