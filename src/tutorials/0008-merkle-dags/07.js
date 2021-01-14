/* eslint quotes: ["error", "double"]  */

const question = "Deduplication..."

const choices = [
  {
    answer: "Allows us to save space by eliminating repeated information in data.",
    correct: false,
    feedback: "This is correct, but at least one other answer is as well!"
  },
  {
    answer: "Has no tradeoffs, only benefits!",
    correct: false,
    feedback: "Oops! Deduplication does in fact have tradeoffs: it makes data more vulnerable to corruption, as it eliminates redundancy. However, this can be mitigated with other data management techniques."
  },
  {
    answer: "Can be implemented at multiple levels of granularity.",
    correct: false,
    feedback: "This one's true, but it's not the only correct answer!"
  },
  {
    answer: "A and C.",
    correct: true,
    feedback: "Yes! Both A and C are correct!"
  },
  {
    answer: "All of the above.",
    correct: false,
    feedback: "Not quite. If deduplication is used to shrink data by linking redundant sections to a single copy, what happens if that copy is corrupted?"
  }
]

export default {
  question,
  choices
}
