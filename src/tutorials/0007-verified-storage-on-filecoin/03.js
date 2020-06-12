// Question must be a string
const question = 'When are Proofs of Replication run?'

// Choices must be an array of objects, each with the properties:
// `answer` (string), `correct` (boolean), and `feedback` (string)
// Only one answer can be correct.
const choices = [
  {
    answer: 'On a recurring basis over time, at regular intervals',
    correct: false,
    feedback: "Nope! We'll learn about other proofs that run multiple times, but a Proof of Replication only needs to run when the data is replicated."
  },
  {
    answer: 'On demand, whenever a challenge is requested to verify the data',
    correct: false,
    feedback: 'Oops! Try again. A Proof of Replication only needs to run when the data is replicated.'
  },
  {
    answer: 'Only once, at the time you make the storage deal',
    correct: true,
    feedback: "That's right!"
  }
]

export default {
  question,
  choices
}
