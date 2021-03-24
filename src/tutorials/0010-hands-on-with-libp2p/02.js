/* eslint quotes: ["error", "double"]  */

// #PRISTINE# This file was auto-generated. Please remove this line when updating the file manually.

// Question must be a string
const question = "How does a brand new libp2p peer get a Peer ID?"

// Choices must be an array of objects, each with the properties:
// `answer` (string), `correct` (boolean), and `feedback` (string)
// Only one answer can be correct.
const choices = [
  {
    answer: "They request an ID from the identity service.",
    correct: false,
    feedback: "Identity services work great in centralized systems, but we can't rely on them in a fully peer-to-peer network."
  },
  {
    answer: "They make up a random number and start using it as a Peer ID.",
    correct: false,
    feedback: "Almost! A completely random ID could be hijacked by another peer, unless there's a way to prove who it belongs to."
  },
  {
    answer: "They generate a private key and share the CID of its corresponding public key.",
    correct: true,
    feedback: "Exactly! A peer can use the private key to prove that they (and only they!) are the owner of the public key that the Peer ID is based on."
  }
]

export default {
  question,
  choices
}
