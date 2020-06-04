const log = {
  debug: (...args) => {
    console.log('⚙️ api', ...args)
  }
}

log.createLogGroup = module => functionMethod => `[${module}.${functionMethod}()]`

module.exports = log
