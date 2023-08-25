// ** SNAPSHOT FILTERING ***
// prevent snapshots for logs that change on each instance, such as shuffled quiz options

const excludedPhrases = [
  "Cool! Here's what we get when we mix up the order of the answer choices:"
]

// returns true if log includes a string from the excludedPhrases array
function isExcluded (log) {
  return excludedPhrases.some(phrase => log.includes(phrase))
}

// add log to snapshot UNLESS it contains an excluded phrase
export function assertLogSnapshot (log) {
  if (!isExcluded(log)) {
    expect(log).toMatchSnapshot() // expect if log isn't excluded from assertion
  }
  // do nothing if log is excluded from assertion
}
