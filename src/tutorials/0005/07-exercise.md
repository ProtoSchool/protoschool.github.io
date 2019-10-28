Using the `cat` method, return the text contents of a file named `success.txt`, present inside a `dir` directory, which is inside a root directory. The `CID` associated with this directories are:

* root directory

`"QmX1rvLYrhqfnnjvrFqudYZgQyomZxS9U9p5e8Dn3ot4Jk"`

* `dir` directory
  
`"QmPT14mWCteuybfrfvqas2L2oin1Y2NCbwzTh9cc33GM1r"`

Since you don't know the CID of the file itself, you'll need to use the directory's `CID` and the file path together to define the file's IPFS path.

Note that the file path is relative to the directory for which yopu have a `CID`. The path of the file can be:

* `dir/success.txt`, relative to the root directory
* `success.txt`, relative to the `dir` subdirectory.

**Hint:** Remember to convert the `Buffer` returned by `cat` to a string, as you did previously, using `.toString('utf-8')`.
