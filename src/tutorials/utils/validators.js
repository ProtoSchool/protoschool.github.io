/*
  Tests if a result of code challenge is an async iterable
 */
export function isAsyncIterable (result) {
  return result && typeof result[Symbol.asyncIterator] === 'function'
}
