/* eslint quotes: ["error", "double"]  */

const question = "How can we identify the encoding method used on specific data when using CIDv1?"

const choices = [
  {
    answer: "CIDv1 includes a multicodec prefix that specifies which encoding method was used.",
    correct: true,
    feedback: "That's right!"
  },
  {
    answer: "CIDv1 always uses `dag-pb` as its encoding method.",
    correct: false,
    feedback: "Nope! The `dag-pb` codec is used commonly in IPFS and IPLD, but not all CIDs use it."
  },
  {
    answer: "The codec used on CIDv1 is always `base58btc`.",
    correct: false,
    feedback: "Nope! CIDv0 always used `base58btc` to convert binary data to a string, but in CIDv1 we have a more flexible way to determine the encoding method used."
  }
]

export default {
  question,
  choices
}
