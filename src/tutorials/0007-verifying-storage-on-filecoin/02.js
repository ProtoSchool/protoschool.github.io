// Question must be a string
const question = 'At what point are a storage client and storage miner committed to a deal proposal?'

// Choices must be an array of objects, each with the properties:
// `answer` (string), `correct` (boolean), and `feedback` (string)
// Only one answer can be correct.
const choices = [
  {
    answer: "When the client selects a miner based on the storage price they're offering.",
    correct: false,
    feedback: "Nope! The process of negotiating the storage price happens early in the process, but the deal hasn't yet been made."
  },
  {
    answer: 'As soon as the deal proposal is created.',
    correct: false,
    feedback: "No, the deal proposal is created before data transfer, and the miner can't commit to storing data they haven't received."
  },
  {
    answer: "When the deal proposal is published to Filecoin's blockchain, after confirmation that the correct data has been transferred.",
    correct: true,
    feedback: "That's right!"
  },
  {
    answer: 'As soon as the data is prepared and transferred.',
    correct: false,
    feedback: 'Nope, first the parties need to check that the CID of the transferred data matches the piece CID noted in the deal proposal.'
  }
]

export default {
  question,
  choices
}
