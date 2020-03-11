export function isAsyncIterable (result) {
  return result && typeof result[Symbol.asyncIterator] === 'function'
}
