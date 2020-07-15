/* eslint quotes: ["error", "double"]  */

const question = "Which version of CIDs include the actual version number of the CID?"

const choices = [
  {
    answer: "None. The version number is inferred by detecting whether the IPLD format multicodec is present.",
    correct: false,
    feedback: "It's true that CIDv0 doesn't have a multicodec, but CIDv1 _does_ have a version prefix."
  },
  {
    answer: "All CIDs contain the version prefix, otherwise there would be no way to determine which version was used.",
    correct: false,
    feedback: "Actually, CIDv0 only had a multihash, with no multicodec or version prefix."
  },
  {
    answer: "Only CIDv1 includes the version prefix, since CIDv0 didn't have that specification.",
    correct: true,
    feedback: "That's correct!"
  }
]

export default {
  question,
  choices
}
