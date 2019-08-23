Move only the files (no directories) from your root directory into the `some/stuff` directory.

Remember that you can pass an array into `files.mv` as the `from` value. This is useful because it allows you to run the async function only once. Be sure to use the `await` keyword so that the `mv` call completes before the contents of your `/some/stuff` directory are evaluated.

When creating your array to pass in, ensure it only contains files, not directories. Remember that each object accessed through `files.ls` in IPFS has a `type` property that you can use to determine whether it's a file or a directory; its value is `0` for files and `1` for directories. (Hint: Try the [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) or [`forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) array methods.)

Remember that `files.mv` needs paths, not filenames, so you'll need to prepend each filename in your array with `/`. (Hint: Try the [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) or [`forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) array methods and incorporate the `name` property available through the `files.ls` method.)

If you experience lag time after hitting "Submit", please try again, uploading smaller files to work with.
