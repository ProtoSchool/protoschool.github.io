In this last lesson of this tutorial, let's try to do something a bit more challenging. We will use the `get` method we learned about to get all the files and directories from a directory structure.

The file structure has been created for us, and it looks like this: 

```
/root
/root/foo
/root/foo/file1.txt
/root/foo/file2.txt
/root/foo/file3.txt
/root/bar
/root/bar/file4.txt
```

In order to use the `get` function to obtain all the files and directories, we will need an IPFS path for the `/root` directory. The IPFS path is this `CID`:

```
QmZ7k62bCGUzhTMiuXxMLz7rVn4KyPuVPvJCDHYSNdZDqa
```

Here's the challenging part: we need to loop over the array of results of the `get` function and replace the value of `content` (if the `content` exists) with the string version of the content.

**Hints:**
* You can either check if `content` already exists in an object, or test if `type === "file"`.

* If you remember, we have talked about how to convert a `Buffer` to a string in a previous lesson, with `content.toString('utf-8').