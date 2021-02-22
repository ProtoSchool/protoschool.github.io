const validate = async (result, ipfs) => {
  if (result) {
    return { success: 'Happy Message!' }
  } else {
    return { fail: 'Sad but useful message :(' }
  }

  /*
    There are some additional options you can find useful:

    If you want to show some data or result to the user, it's possible to add an additional step after submitting the code:
    https://github.com/ProtoSchool/protoschool.github.io/blob/main/README.md#display-results-to-the-user-optional

    If you want to catch external errors and override them to display a more user-friendly error message:
    https://github.com/ProtoSchool/protoschool.github.io/blob/main/README.md#override-external-error-messages-optional
  */
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
