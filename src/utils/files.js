
export const logFiles = (files) =>
  files.map(file => {
    let obj = {}
    for (let k in file) {
      if (typeof file[k] !== 'function') {
        obj[k] = file[k]
      }
    }
    return obj
  })
