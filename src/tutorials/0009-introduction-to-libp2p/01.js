/* eslint quotes: ["error", "double"]  */

const question = "What is the relationship between libp2p and IPFS?"

const choices = [
  {
    answer: "libp2p was not connected to IPFS at first, but with time, IPFS started using it.",
    correct: false,
    feedback: "No, libp2p started as a component of IPFS."
  },
  {
    answer: "libp2p started as a component of IPFS, but eventually grew out of IPFS and became an independent project. IPFS continues to be one of the main users of libp2p.",
    correct: true,
    feedback: "That's right!"
  },
  {
    answer: "IPFS grew a lot after adopting libp2p.",
    correct: false,
    feedback: "No, the functionality of libp2p always existed in IPFS. Try again!"
  }
]

export default {
  question,
  choices
}
