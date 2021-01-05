/* eslint quotes: ["error", "double"]  */

const question = "If we were to edit the tabby cat image in our file hierarchy and construct a new Merkle DAG along the same lines as before, how many nodes would the new Merkle DAG and previous Merkle DAG differ by?

const choices = [
  {
    answer: "3: the tabby cat node and each of its ancestors!",
    correct: true,
    feedback: "That's right! Modifying the tabby cat node means its CID would change, prompting changes in the nodes for the cats and pics directories as well."
  },
  {
    answer: "4: all the cat pictures and their parent nodes will change!",
    correct: false,
    feedback: "Not quite! While the tabby cat node would need a new CID, its sibling would not, because its content has not changed."
  },
  {
    answer: "8: the entire DAG needs to change!",
    correct: false,
    feedback: "Try again! None of the nodes representing the fish subdirectory would need to change, because the content of each would remain the same."
    },
]

export default {
  question,
  choices
}
