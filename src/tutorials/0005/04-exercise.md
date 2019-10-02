Let's upload some files and add them to our IPFS node. This time, however, we will use the option `{ wrapWithDirectory: true }` to put all the files in the same directory!

We want to add the files into a directory called `/dir`. You can upload one or multiple files.

Don't forget, you can get the name of the file you uploaded with `file.name`.

**Hint:** Remember the `add` function from our previous lesson? It looks like `await ipfs.add(file, options)`. Dont forget you need to pass an array to file if you want to add multiple files, and the object structure to indicate the desired path of the file.