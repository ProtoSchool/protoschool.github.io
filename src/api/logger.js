export const debug = (...args) => {
  console.log('⚙️ api', ...args)
}

export const createLogGroup = module => functionMethod => `[${module}.${functionMethod}()]`
