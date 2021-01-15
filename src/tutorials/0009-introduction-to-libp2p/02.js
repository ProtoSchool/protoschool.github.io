/* eslint quotes: ["error", "double"]  */

const question = "So, why do we need libp2p?"

const choices = [
  {
    answer: "Because all the current P2P protocols will expire one day and libp2p is the next great one to use.",
    correct: false,
    feedback: "Oops. That's not quite correct. P2P protocols will continue to work and have their specific use cases. But libp2p aims to go beyond that."
  },
  {
    answer: "Because libp2p is a new great P2P protocol that solves all of the networking issues before mentioned.",
    correct: false,
    feedback: "Sorry, but that's not really the solution that libp2p proposes. Go back and see what is the proposed solution."
  },
  {
    answer: "No P2P protocol will cover all the use cases that all the applications need. Instead, we need an easy way to interop between protocols seamlessly.",
    correct: true,
    feedback: "That's it! Go to the next lesson to find out how libp2p managed to do it."
  }
]

export default {
  question,
  choices
}
