/* eslint quotes: ["error", "double"]  */

// #PRISTINE# This file was auto-generated. Please remove this line when updating the file manually.

// Question must be a string
const question = "What is the name for a single participant in a p2p network?"

// Choices must be an array of objects, each with the properties:
// `answer` (string), `correct` (boolean), and `feedback` (string)
// Only one answer can be correct.
const choices = [
  {
    answer: "Peer",
    correct: true,
    feedback: "Great job! Peer-to-peer networks are made of, well, peers!"
  },
  {
    answer: "Protocol",
    correct: false,
    feedback: "A **protocol** tells us _how_ to talk to each other. But what do we call _who_ we're talking to?"
  },
  {
    answer: "Host",
    correct: false,
    feedback: "So close! The `Host` is one of the most important interfaces in go-libp2p though!"
  }
]

export default {
  question,
  choices
}
