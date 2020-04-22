For this challenge, we've added a plain text file to your IPFS node for you, and its CID is the following string:

```
QmWCscor6qWPdx53zEQmZvQvuWQYxx1ARRCXwYVE4s9wzJ
```

Using the `cat` function, retrieve the file's contents and return them as a string.

**Hints:**

- The `CID` we provide is a string, so it needs to be placed inside quotes. Also, don't forget to convert the buffered contents of the text file to a string using `.toString()` before returning your result.
- You need to concatenate all the chunks of data because the `ipfs.cat` method returns an `Async Iterable`. You can use the package `it-to-buffer` to achieve this.