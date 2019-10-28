Using the `cat` method, return the text contents of a file named `success.txt`, stored inside a `dir` directory which lives directly within a root directory.

The CIDs associated with these directories are:

* root directory: `"QmX1rvLYrhqfnnjvrFqudYZgQyomZxS9U9p5e8Dn3ot4Jk"`
* `dir` directory: `"QmPT14mWCteuybfrfvqas2L2oin1Y2NCbwzTh9cc33GM1r"`

Since you don't know the CID of the file itself, you'll need to define the its IPFS path by combining a directory's CID and the file's path relative to that directory.

Based on our file structure, the path could be expressed as:

* `dir/success.txt`, relative to the root directory
* `success.txt`, relative to the `dir` subdirectory

There are two valid ways to solve this challenge. Take your pick!

**Hint:** Remember to convert the `Buffer` returned by `cat` to a string, as you did previously, using `.toString('utf-8')`.
