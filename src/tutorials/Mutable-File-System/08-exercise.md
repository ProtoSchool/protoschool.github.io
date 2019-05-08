Your root directory should currently contain one or more files that you uploaded, plus your `/some/stuff` directory. Move the files into the `some/stuff` directory.

**Hint:** Be sure to only move files, not directories. Remember that each object in IPFS has a `type` property that you can use to determine whether it's a file or a directory. For files it's the number `0` and for directories it's the number `1`. Be sure to use full paths in the `files.mv` function, not just filenames.
