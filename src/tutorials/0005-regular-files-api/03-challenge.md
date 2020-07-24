Add the files in your browser (available in the `files` array below) to your IPFS node using the `addAll` method. Alternatively, you can use the `add` method to upload a single file. Return the results.

**Hints:**
- You can either pass an array of `File` objects to the `addAll` method or a single `File` object to the `add` method.
- When using the `addAll` method, you'll need to concatenate all the results into an array because the method returns an `Async Iterable`. You can use either the `for await...of` loop or the function `all` to do this.
- When uploading a single file via the `add` method, be sure to pass only the file to the `add` method, instead of passing the whole `files` array.
