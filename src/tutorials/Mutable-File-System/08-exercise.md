Move only the files (no directories) from your root directory into the `some/stuff` directory.

First, create an array called `filesToMove` which contains only the files to be moved. Remember that each object in IPFS has a `type` property that you can use to determine whether it's a file or a directory. For files it's the number `0` and for directories it's the number `1`. (Hint: Try the [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) or [`forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) array methods.)

Since `files.mv` needs paths, not filenames, create a `filepathsToMove` array from your `filesToMove` array. (Hint: Try the [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) or [`forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) array methods.)

Remember that you can pass an array into `files.mv` as the `from` value. This is useful because it allows you to run the async function only once. Be sure to use the `await` keyword so that the move action completes before the contents of your `/some/stuff` directory are evaluated.

If you experience lag time after hitting "Submit", please try again, uploading smaller files to work with.
