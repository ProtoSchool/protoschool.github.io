/* eslint quotes: ["error", "double"]  */

const question = "Where does libp2p fit into the OSI Model?"

const choices = [
  {
    answer: "libp2p breaks the OSI Model apart and allows applications to mix and match freely without being restricted to rigid conceptual models.",
    correct: true,
    feedback: "That's correct!"
  },
  {
    answer: "libp2p had to adapt to the current web, so it only tackles the Network Layer and the Transport Layer, but still with good results.",
    correct: false,
    feedback: "Oops, that's not correct."
  },
  {
    answer: "libp2p tackles all the layers of the OSI Model at once, making it a better protocol than most.",
    correct: false,
    feedback: "Sorry, but that's not quite right."
  }
]

export default {
  question,
  choices
}
