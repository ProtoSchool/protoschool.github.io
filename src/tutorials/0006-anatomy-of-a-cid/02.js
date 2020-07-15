/* eslint quotes: ["error", "double"]  */

const question = "How do CIDs support multiple cryptographic algorithms?"

const choices = [
  {
    answer: "The length of the hash tells us which cryptographic algorithm was used. If the length is 256 bits (32 bytes) then the algorithm used was `sha2-256`. If the length is 512 bits (64 bytes) then the algorithm used was `sha2-512`.",
    correct: false,
    feedback: "It's true that the length of a `sha2-256` hash is 256 bits (32 bytes), but this isn't enough information to tell us what hashing algorithm was used. Check the information above and try again."
  },
  {
    answer: "They prefix the hash with a unique identifier that flags which algorithm was used to generate the hash.",
    correct: false,
    feedback: "You're almost there! There's something else that the hash gets prefixed with."
  },
  {
    answer: "They prefix the hash with a unique identifier that flags both the algorithm used to generate the hash and the length of the hash value.",
    correct: true,
    feedback: "That's right!"
  }
]

export default {
  question,
  choices
}
