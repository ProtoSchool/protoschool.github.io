<template>
  <div class="lesson-blog-03">
    <Lesson v-bind:text="text" v-bind:code="code" :validate="validate"
            lessonTitle="Adding a tag cloud">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './03.md'
const CID = require('cids')

const code = `/* globals ipfs */

const run = async () => {
  const natCid = await ipfs.dag.put({author: "Nat"})
  const samCid = await ipfs.dag.put({author: "Sam"})
  const treePostCid = await ipfs.dag.put({
    content: "trees",
    author: {"/": samCid.toBaseEncodedString()},
    tags: ["nature", "outdoor", "hobby"]
  })
  const computerPostCid = await ipfs.dag.put({
    content: "computers",
    author: {"/": natCid.toBaseEncodedString()},
    tags: ["hardware", "hobby"]
  })

  return [treePostCid, computerPostCid]
}

return run`

const validate = async (result, ipfs) => {
  if (!result) {
    return {fail: 'You forgot to return a result :)'}
  }
  // TODO vmx 2018-07-25 proper validation:
  //  - Test if array contains four elements
  //  - Look if the return objects have
  //    - an `tag` field
  //    - an `posts` field and that it is an array of links
  //    - that the posts link to the correct ones (and have the right number of links)
  //  - Sort expected array and check if those are the expected CIDs
  return {success: 'All works!'}
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
