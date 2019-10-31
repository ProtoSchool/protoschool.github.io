Add one or more files to your IPFS node, using `{ wrapWithDirectory: true }` to put them in a directory. Because you're targeting the root of the directory, not a subdirectory, the `path` of each file should just be its name.

**Hints:** Be sure to reference the examples above for the object structure needed to indicate the desired path of each file, as well as how to pass in multiple files as an array. Remember, you can access the name of a file you uploaded with `file.name`.
