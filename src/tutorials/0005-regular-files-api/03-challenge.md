Add the files in your browser (available in the `files` array below) to your IPFS node using the `addAll` method. Alternatively, you can also use the `add` method if you are uploading only one file.

**Hints:**
- You can pass either an array of `File` objects to the `addAll` method, or a single `File` object to the `add` method.
- When using the `addAll` method, you need to concatenate all the results into an array because the method returns an `Async Iterable`. You can use either the `for await...of` loop or the function `all` to do this.
- When uploading only one file and you want to use the `add` method, you need to pass the only file to the `add` method, instead of passing the whole `files` array.
