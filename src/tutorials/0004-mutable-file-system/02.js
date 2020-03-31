import utils from '../utils'

const validate = async (result, ipfs) => {
  if (!result) {
    return { fail: 'Oops! You forgot to return a result :(' }
  } else if (!!result & !result.cid) {
    return { fail: "That result doesn't look right. Are you sure you ran the `stat` method on your empty root directory?" }
  } else if (!!result && result.cid.toString() === 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn') {
    return {
      success: utils.validationMessages.SUCCESS,
      logDesc: [
        "Here's the status of your root directory (`/`).",
        `<pre class="code-highlight"><code class="hljs json">${JSON.stringify(result, null, 2)}</code></pre>`,
        'The output is very long because the CID is represented as an `Object` internally. To simplify, this we can use the `toString()` method on the `cid` property to get the CID in string format: `' + result.cid.toString() + '`. In future lessons we\'ll always show this simplified version to make it easier to read as shown bellow. <br/> <br/>',
        "Notice that it has a CID even though it doesn't have contents yet. Every empty IPFS node has this exact same CID, because their non-existent contents are identical!"
      ].join(' '),
      log: utils.format.ipfsObject(result)
    }
  }
}

const code = `/* global ipfs */

const run = async () => {
  // your code goes here
}

return run
`

const solution = `/* global ipfs */

const run = async () => {
  return await ipfs.files.stat('/')
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
