In the previous exercise, we uploaded multiple files into a `/dir` directory. This time, let's check which files are, in fact, in the `/dir` directory of our ipfs node.

**Hint:** The ipfs path (`CID`) you need to call the `ls` function is stored in the `pathCID` variable.

**Note**: You may be wondering how we obtained the `CID` of the `/dir` directory. After you add files into the directory, any directories created will be part of the resulting array. Therefore we look through the `add` result array for the element with the path `dir`, whose `hash` will be the `CID` to the directory.