/* eslint quotes: ["error", "double"]  */

const question = "How did libp2p managed to create a network stack that enables interoperability and easy upgrades?"

const choices = [
  {
    answer: "By creating all the necessary modules of a network stack so that developers do not need to develop everything from scratch.",
    correct: false,
    feedback: "Oops. That's not quite correct. How can we interop between each module?"
  },
  {
    answer: "By separating itself from IPFS.",
    correct: false,
    feedback: "Sorry, but that's not really how. Check again."
  },
  {
    answer: "By creating well defined interfaces that allow anyone to create modules that follow those interfaces.",
    correct: true,
    feedback: "That's it!"
  }
]

export default {
  question,
  choices
}
