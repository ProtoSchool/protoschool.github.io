/*
  Error messages to show to the use on the output UI
 */
export default {
  SUCCESS: 'Success! You did it!',
  NO_RESULT: 'Oops! You forgot to return a result :(',
  VALUE_IS_ASYNC_ITERABLE_ALL: 'The returned value is an Async Iterable. Did you forget to put all the results together using either `for await...of` or with `all`?',
  VALUE_IS_ASYNC_ITERABLE_TOBUFFER: 'The returned value is an Async Iterable. Did you forget to concatenate all the data using `toBuffer`?'
}
