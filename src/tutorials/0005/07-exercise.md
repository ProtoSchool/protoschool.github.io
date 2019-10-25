The goal of this exercise is to read the contents of a file named `success.txt`, present inside a root directory.

We will provide you the directory `CID`, so you will have to use it and the file path to access the file.

The root directory has the following `CID`:

`"QmbDyYL9SaWD2pYvN6JmGwetcDgzr466Z3WjigDmndZ6ea"`

And the file we are trying to read is called:

`success.txt`

Don't forget to return to convert the contents of the file into a string before returning it.

**Hints:**
* You can access the file by combining the `CID` of the directory it is in with the file name, like `"CID/file.txt"`
* If you remember, we have talked about how to convert a `Buffer` to a string in a previous lesson, with `content.toString('utf-8').