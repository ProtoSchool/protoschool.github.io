const validate = async (result, ipfs) => {
  return { success: 'Validation coming soon!' }
}

const code = `/* global ipfs, all, toBuffer */
  const run = async () => {
  // Your code here
}
return run
`

const solution = `/* global ipfs, all, toBuffer */
  const run = async () => {
  // Your solution here
}
return run
`

// for more on the available options:
// https://github.com/ProtoSchool/protoschool.github.io/blob/main/DEVELOPING_TUTORIALS.md#lesson-file
const options = {
  overrideErrors: false,
  createTestFile: false,
  createTestTree: false
}

export default {
  validate,
  code,
  solution,
  options
}
