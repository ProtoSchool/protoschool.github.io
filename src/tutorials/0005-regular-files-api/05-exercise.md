Add one or more files to your IPFS node, using `{ wrapWithDirectory: true }` to put them in a directory. Because you're targeting the top-level directory, not a subdirectory, the `path` of each file should just be its name.

**Hints:**
- Be sure to reference the examples above for the object structure needed to indicate the desired path of each file, as well as how to pass in multiple files as an array.
- Try the [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) or [`forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) array methods to loop through each file in the `files` array and access its name as `file.name`.
