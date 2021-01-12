/* eslint quotes: ["error", "double"]  */

const question = "If we were to edit the tabby cat image in our file hierarchy and construct a new Merkle DAG containing the same elements, how many nodes would the new Merkle DAG and previous Merkle DAG differ by?"

const choices = [
  {
    answer: "1 - Only the tabby cat node would change.",
    correct: false,
    feedback: "Try again! Because each node's CID depends on the CIDs of its descendants, we can't change the tabby cat without affecting other nodes in the DAG."
  },
  {
    answer: "3 - The tabby cat node and each of its ancestors would change.",
    correct: true,
    feedback: "That's right! Modifying the tabby cat node means its CID would change, prompting changes in the nodes for the cats and pics directories (its ancestors) as well."
  },
  {
    answer: "4 - All of the cat pictures and their parent nodes would change.",
    correct: false,
    feedback: "Not quite! While the tabby cat node would need a new CID, its sibling would not, because its content has not changed."
  },
  {
    answer: "8 - The entire DAG would need to change.",
    correct: false,
    feedback: "Try again! None of the nodes representing the fish subdirectory would need to change, because the content of each would remain the same."
  }
]

export default {
  question,
  choices
}
