Using the `cat` method, return the text contents of a file named `success.txt`, stored inside a `fun` directory which lives directly within another directory.

The CIDs associated with these directories are:

* top-level directory: `QmcmnUvVV31txDfAddgAaNcNKbrtC2rC9FvkJphNWyM7gy`
* `fun` directory: `QmPT14mWCteuybfrfvqas2L2oin1Y2NCbwzTh9cc33GM1r`

Since you don't know the CID of the file itself, you'll need to define its IPFS path by combining a directory's CID and the file's path relative to that directory.

Based on our file structure, the path could be expressed as:

* `fun/success.txt`, relative to the top-level directory
* `success.txt`, relative to the `fun` subdirectory

There are two valid ways to solve this challenge. Take your pick!

**Hint:** In the code below we've already taken care of converting the `bufferedContents` to a string before returning the result, as you did yourself previously using `.toString()`.

Don't forget to prepend `/ipfs/` to the IPFS Path string
