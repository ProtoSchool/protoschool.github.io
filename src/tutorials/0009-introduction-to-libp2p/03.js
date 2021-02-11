/* eslint quotes: ["error", "double"]  */

const question = "How did libp2p manage to create a network stack that enables interoperability and easy upgrades?"

const choices = [
  {
    answer: "By creating all the necessary modules of a network stack so that developers don't need to develop everything from scratch.",
    correct: false,
    feedback: "Oops. That's not quite correct. How can we interop between each module?"
  },
  {
    answer: "By separating itself from IPFS.",
    correct: false,
    feedback: "Not quite. Separating from IPFS allowed libp2p to be adopted by other projects, but there's more to its success. Try again!"
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
