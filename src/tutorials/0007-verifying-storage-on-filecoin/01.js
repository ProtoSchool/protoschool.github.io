// Question must be a string
const question = 'How can we trust that data is being stored correctly on the Filecoin network?'

// Choices must be an array of objects, each with the properties:
// `answer` (string), `correct` (boolean), and `feedback` (string)
// Only one answer can be correct.
const choices = [
  {
    answer: 'We place our trust in the specific entity storing the data.',
    correct: false,
    feedback: "No, Filecoin's decentralized protocol doesn't require placing trust in a single, centralized storage provider."
  },
  {
    answer: "Storage miners undergo background checks to prove they're trustworthy before joining the network.",
    correct: false,
    feedback: "No, we don't need to know anything about the storage miner themselves to prove that they're storing data as promised."
  },
  {
    answer: 'We place our trust in the protocol design and consensus mechanisms, in which all participants work together to verify activity.',
    correct: true,
    feedback: "That's right! We'll learn more about how storage deals are verified in upcoming lessons."
  }
]

export default {
  question,
  choices
}
