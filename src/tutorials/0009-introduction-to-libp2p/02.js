/* eslint quotes: ["error", "double"]  */

const question = "So, why do we need libp2p?"

const choices = [
  {
    answer: "All current P2P protocols will become obsolete one day and libp2p is the next great one to use.",
    correct: false,
    feedback: "Oops. That's not quite correct. P2P protocols will continue to work and have their specific use cases, but libp2p adds modularity and interoperability."
  },
  {
    answer: "libp2p is a great new P2P protocol that solves all of the networking issues previously mentioned.",
    correct: false,
    feedback: "Not quite. While libp2p solves many of these challenges, the way in which it does so is especially important. Try again!"
  },
  {
    answer: "No P2P protocol will cover all the use cases that all the applications need. Instead, we need an easy way to interop between protocols seamlessly.",
    correct: true,
    feedback: "That's it! Go to the next lesson to find out how libp2p tackles this challenge."
  }
]

export default {
  question,
  choices
}
