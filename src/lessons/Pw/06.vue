<template>
  <div class="lesson-pw-06">
    <Lesson v-bind:text="text" v-bind:code="code" :validate="validate"
            lessonTitle="Update the blog">
    </Lesson>
  </div>
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './06.md'
const CID = require('cids')

const code = `/* globals ipfs */

const run = async () => {
  const hello = {hello: "world!", pic: "TODO"}
  const helloCid = await ipfs.dag.put(hello)
  const blogPost = {contents: "some text", author: {"/": helloCid.toBaseEncodedString()}}
  const blogPostCid = await ipfs.dag.put(blogPost)
  const conferenceCid = await ipfs.dag.put({"speakers":
    [{"its you": {"photo": {"/": "zdpuAuVBsCVYPgtJu72kH6EnF3vs8ffKxobSchS8GdpkFJBWk"}}}]
  })
  hello.speakerAt = {'/': conferenceCid.toBaseEncodedString()}
  const updatedBioCid = await ipfs.dag.put(hello)

  // Your code geos here
}

return run
`

// There code that goes here is:
//  blogPost.author['/'] = updatedBioCid.toBaseEncodedString()
//  const updatedBlogPostCid = await ipfs.dag.put(blogPost)
//  return updatedBlogPostCid

const findLinks = (data) => {
  const links = []
  for (const [key, value] of Object.entries(data)) {
    if (key === '/') {
      links.push(value)
    } else if (Array.isArray(value)) {
      for (const item of value) {
        links.push(...findLinks(item))
      }
    } else if (typeof value === 'object') {
      links.push(...findLinks(value))
    }
  }
  return links
}

const validate = async (result, ipfs) => {
  if (!result) {
    return {fail: 'You forgot to return a result :)'}
  }
  if (!CID.isCID(result)) {
    return {fail: 'Did not return a valid CID instance.'}
  }
  const expected = 'zdpuAr8wjM6xrNr3dbgaU45bz1giGAU478mj5HCQqgqqcQGWc'
  const obj = await ipfs.dag.get(result)
  const links = findLinks(obj).map((link) => {
    return new CID(link).toBaseEncodedString()
  })
  if (links.includes(expected)) {
    return {success: 'All works!'}
  } else if (links.length === 0) {
    return {fail: 'You need to provide a link to the photo'}
  } else {
    return {fail: 'You provied a wrong link, not the one to the updated bio. ' +
      `Was expecting "${expected}" but got "${links[0]}"dfdsfsdf`}
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
