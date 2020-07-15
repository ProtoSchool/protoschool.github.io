// Question must be a string
const question = 'Why does Filecoin use zk-SNARKs?'

// Choices must be an array of objects, each with the properties:
// `answer` (string), `correct` (boolean), and `feedback` (string)
// Only one answer can be correct.
const choices = [
  {
    answer: 'To increase the sarcasm factor of proofs',
    correct: false,
    feedback: 'Nope! Snark and SNARK are sadly unrelated. But this is our favorite wrong answer!'
  },
  {
    answer: 'To make it so a single peer can serve as a source of truth',
    correct: false,
    feedback: 'No, Filecoin requires multiple nodes to keep copies of the chain for verification purposes. But zk-SNARKs affect the size of the data that each verifier needs to store.'
  },
  {
    answer: 'To compress proofs to keep the chain smaller',
    correct: true,
    feedback: "That's right! zk-SNARKs keep the chain smaller and reduce the time needed for verification."
  },
  {
    answer: 'To encrypt the stored data',
    correct: false,
    feedback: "Nope, zk-SNARKs affect the chain's efficiency, but they don't encrypt the data stored on the network."
  }
]

export default {
  question,
  choices
}
