Let's add some files to IPFS using MFS. Since `files` is an array representing the files currently available to us in the browser, we'll need to loop through the array and `write()` each each file we find there to IPFS, adding the response we get to a new `addedFiles` array. (Only have a single file uploaded? No problem!) Once we're done, we'll return the `addedFiles` array to check that everything worked correctly.

Put your files in a directory called `/awesome`, and be sure to create new files if there aren't any already there.
