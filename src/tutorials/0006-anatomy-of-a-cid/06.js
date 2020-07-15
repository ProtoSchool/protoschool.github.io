/* eslint quotes: ["error", "double"]  */

const question = "If we have two different CIDs pointing to the same content, doesn't that break the 'uniqueness' rule specified in the first lesson?"

const choices = [
  {
    answer: "Yes, because CIDv0 and CIDv1 are not compatible.",
    correct: false,
    feedback: "Actually, all CIDs in Version 0 can be converted to be represented in Version 1, and both versions would have something important in common."
  },
  {
    answer: "No, because the two CIDs are just two different version representations of the same hash. The hash is still unique to the data it represents.",
    correct: true,
    feedback: "That's correct!"
  },
  {
    answer: "Yes, because the hashes are no longer unique.",
    correct: false,
    feedback: "The relationship between the CID and the hash isn't unique, but what about the relationship between the hash and the data it represents?"
  }
]

export default {
  question,
  choices
}
