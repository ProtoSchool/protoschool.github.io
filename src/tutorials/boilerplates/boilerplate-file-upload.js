const validate = async (result, ipfs) => {
  // Learn about working with uploaded files:
  // https://github.com/ProtoSchool/protoschool.github.io/README.md#work-with-uploaded-files-for-file-upload-lessons-only
  let uploadedFiles = window.uploadedFiles

  if (!uploadedFiles) {
    return { fail: 'You need to upload some files first' }
  }
  if (result) {
    return { success: 'Happy Message!' }
  } else {
    return { fail: 'Sad but useful message :(' }
  }

  /*
    There are some additional options you can find useful:

    If you want to show some data or result to the user, it's possible to add an additional step after submitting the code:
    https://github.com/ProtoSchool/protoschool.github.io/blob/code/README.md#display-results-to-the-user-optional

    If you want to catch external errors and override them to display a more user-friendly error message:
    https://github.com/ProtoSchool/protoschool.github.io/blob/code/README.md#override-external-error-messages-optional
  */
}

const code = `/* global ipfs */
  const run = async (files) => {
  // Your code here
}
return run
`

const solution = `/* global ipfs */
  const run = async (files) => {
  // Your solution here
}
return run
`

const modules = { cids: require('cids') }

// for more on the available options:
// https://github.com/ProtoSchool/protoschool.github.io/blob/code/DEVELOPING_TUTORIALS.md#lesson-file
const options = {
  type: 'file-upload'
}

export default {
  validate,
  code,
  solution,
  modules,
  options
}
