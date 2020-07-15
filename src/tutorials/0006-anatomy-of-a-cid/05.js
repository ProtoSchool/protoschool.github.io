/* eslint quotes: ["error", "double"]  */

const question = "How can we determine the base encoding method used to represent a binary CID as a string?"

const choices = [
  {
    answer: "We have to guess, but it's easy because most implementations of IPFS encode CIDs with `base32`.",
    correct: false,
    feedback: "Most current implementations of IPFS use `base32`, but CIDv0 didn't. Is there a helpful clue in the string version of the CID?"
  },
  {
    answer: "We can check the initial characters of the CID. If it starts with `Qm`, it's `base58btc`. If it starts with `b` it's `base32`. In both cases the CID version is `CIDv1`.",
    correct: false,
    feedback: "Hmm, that first part is right, but are you sure both of those examples could be CIDv1?"
  },
  {
    answer: "We can check the initial characters of the CID. If it starts with `Qm`, it's `base58btc` and is `CIDv0`. If it starts with `b` it's `base32` and is `CIDv1`.",
    correct: true,
    feedback: "That's correct!"
  }
]

export default {
  question,
  choices
}
