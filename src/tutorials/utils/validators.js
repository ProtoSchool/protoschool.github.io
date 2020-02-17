export function isAsyncIterable (result) {
  return result && typeof result[Symbol.asyncIterator] === 'function'
}

export function allIsNotDefined (error) {
  return error instanceof ReferenceError &&
    error.name === 'ReferenceError' &&
    error.message.includes('all is not defined')
}
