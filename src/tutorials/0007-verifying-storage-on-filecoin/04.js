// Question must be a string
const question = 'How does the Proof of Storage confirm that given data is stored over time?'

// Choices must be an array of objects, each with the properties:
// `answer` (string), `correct` (boolean), and `feedback` (string)
// Only one answer can be correct.
const choices = [
  {
    answer: 'It checks whether data with the right CommD is present on the Filecoin network.',
    correct: false,
    feedback: "Nope. Since a CommD is based only on the data and not on its location, a CommD can't help to confirm that a specific miner is honoring their agreement."
  },
  {
    answer: "It re-runs the Proof of Replication at regular intervals to ensure the miner's encoded data still matches the client's original data.",
    correct: false,
    feedback: "No. Once the Proof of Replication is complete, we've proven that the encoding is correct, allowing the Proof of Spacetime to rely only on encoded data."
  },
  {
    answer: 'It regularly checks that all encoded data in the CommR is still present on the Filecoin network.',
    correct: false,
    feedback: 'While the Proof of Storage does reference the CommR, it only samples a subset of the encoded data.'
  },
  {
    answer: 'It regularly checks to ensure that a random section of encoded data from the CommR is present in the right location.',
    correct: true,
    feedback: 'You got it!'
  }

]

export default {
  question,
  choices
}
