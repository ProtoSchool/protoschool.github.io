In the previous exercise, we uploaded multiple files into a root directory. This time, let's check which files are, in fact, in the root directory of our IPFS node.

**Hint:** The IPFS path (`CID`) you need to call the `ls` function is stored in the `pathCID` variable.

**Note**: You may be wondering how we obtained the `CID` of the `/dir` directory. After you add files into the directory, any directories created will be part of the resulting array. Therefore we look through the array resulting from the `add` method for the element with the empty path (which corresponds to the root directory), whose `hash` will be the `CID` to the directory.