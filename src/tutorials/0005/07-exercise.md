Using the `cat` method, return the text contents of a file named `success.txt`, present inside a root directory with the following CID:

`"QmbDyYL9SaWD2pYvN6JmGwetcDgzr466Z3WjigDmndZ6ea"`

Since you don't know the CID of the file itself, you'll need to use the directory's CID and the filename together to define the file's IPFS path.

**Hint:** Remember to convert the `Buffer` returned by `cat` to a string, as you did previously, using `.toString('utf-8')`.
