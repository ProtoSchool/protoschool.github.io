import all from 'it-all'

import utils from '../utils'

async function validateMultipleFiles (result, uploadedFiles, { ipfs }) {
  const iterable = ipfs.addAll(window.uploadedFiles)
  const expectedResult = await all(iterable)

  if (result.length > uploadedFiles.length) {
    return {
      fail: 'The array you returned has more items than the number of files you uploaded. Be sure to add each file to IPFS just once, which you can do most easily by passing the whole array to the `add` method.'
    }
  }

  if (result.length < uploadedFiles.length) {
    return {
      fail: 'The array you returned has fewer items than the number of files you uploaded. Be sure to add each file to IPFS, which you can do most easily by passing the whole array to the `add` method.'
    }
  }

  const fileText = result.length > 1 ? `these files` : 'this file'
  const valueText = result.length > 1 ? `values` : 'value'
  const thatText = result.length > 1 ? `them` : 'it'

  if (JSON.stringify(expectedResult) === JSON.stringify(result)) {
    return {
      success: utils.validationMessages.SUCCESS,
      logDesc: [
        "You returned the array of objects below. The output is very long because the CID is represented as an `Object` internally, but if you scroll down we'll offer you a more condensed view.",
        `<pre class="code-highlight"><code class="hljs json">${JSON.stringify(result, null, 2)}</code></pre>`,
        'To simplify the output, we can use the `toString()` method on the `cid` property to get the CID in string format: `QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn`. In future lessons we\'ll always show this simplified version to make it easier to read, as shown below. <br/> <br/>',
        'You returned the array of objects below. Notice in particular the `cid` ' + valueText + ", since we'll need " + thatText + ' to access ' + fileText + ' again later. The `path` matches the `cid` for ' + fileText + ", but we'll see in future lessons that that's not always true."
      ].join(' '),
      log: result.map(utils.format.ipfsObject)
    }
  } else {
    return { fail: `Something seems to be wrong. Please click "Reset Code" and try again, taking another look at the instructions and editing only the portion of code indicated. Feeling really stuck? You can click "View Solution" to see our suggested code.` }
  }
}

async function validateSingleFile (result, uploadedFiles, { ipfs }) {
  const expectedResult = await ipfs.add(uploadedFiles[0])

  if (uploadedFiles.length > 1) {
    return {
      fail: 'You uploaded multiple files, but you returned only one single file. To upload a single file with `add`, click "Reset Files" to upload a single file to the code editor. To upload multiple files with `addAll`, be sure to concatenate the Async Iterable result from `addAll` into an array.'
    }
  }

  if (JSON.stringify(expectedResult) === JSON.stringify(result)) {
    return {
      success: utils.validationMessages.SUCCESS,
      logDesc: [
        "You returned the object bellow. The output is very long because the CID is represented as an `Object` internally, but if you scroll down we'll offer you a more condensed view.",
        `<pre class="code-highlight"><code class="hljs json">${JSON.stringify(result, null, 2)}</code></pre>`,
        'To simplify the output, we can use the `toString()` method on the `cid` property to get the CID in string format: `QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn`. In future lessons we\'ll always show this simplified version to make it easier to read, as shown below. <br/> <br/>',
        "You returned the object below. Notice in particular the `cid` value, since we'll need it to access this file again later. The `path` matches the `cid` for this file, but we'll see in future lessons that that's not always true."
      ].join(' '),
      log: utils.format.ipfsObject(result)
    }
  } else {
    return { fail: `Something seems to be wrong. Please click "Reset Code" and try again, taking another look at the instructions and editing only the portion of code indicated. Feeling really stuck? You can click "View Solution" to see our suggested code.` }
  }
}

const validate = async (result, ipfs) => {
  const uploadedFiles = window.uploadedFiles || []

  if (!result) {
    return {
      fail: utils.validationMessages.NO_RESULT
    }
  }

  if (result.error) {
    return { error: result.error }
  }

  if (utils.validators.isAsyncIterable(result)) {
    return {
      fail: utils.validationMessages.VALUE_IS_ASYNC_ITERABLE_ALL
    }
  }

  if (Array.isArray(result)) {
    return validateMultipleFiles(result, uploadedFiles, { ipfs })
  } else {
    return validateSingleFile(result, uploadedFiles, { ipfs })
  }
}

const code = `/* global ipfs, all */

const run = async (files) => {
  const result = // Place your code to add a file or files here

  return result
}
return run
`

const solution = `/* global ipfs, all */

const run = async (files) => {
  const result = await all(ipfs.addAll(files))

  // or using for await...of loop
  //const result = []
  //
  //for await (const resultPart of ipfs.addAll(files)) {
  //  result.push(resultPart)
  //}

  // or when uploading one file
  // const result = await ipfs.add(files[0])

  return result
}
return run
`

const options = {
  overrideErrors: true
}

export default {
  validate,
  code,
  solution,
  options
}
