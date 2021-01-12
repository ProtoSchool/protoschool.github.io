/* eslint quotes: ["error", "double"]  */

const question = "When you use content addressing to share or retrieve data arranged in a Merkle DAG..."

const choices = [
  {
    answer: "Having the CID of any node in the DAG will allow you to retrieve all the others.",
    correct: false,
    feedback: "Nope! Any given node can only be used to retrieve the nodes for which it is a direct ancestor."
  },
  {
    answer: "You need the CIDs of every node in the DAG before retrieving it.",
    correct: false,
    feedback: "Try again! In a Merkle DAG, parent nodes embed the CIDs of their children, so you don't need to know the children's CIDs in advance."
  },
  {
    answer: "You can always specify an entire DAG using a single root node.",
    correct: true,
    feedback: "Yes! Even if the DAG doesn't have a single root node, the person sharing the DAG can always make one."
  },
  {
    answer: "You can make the DAG a child within a larger DAG, but each of the smaller DAG's nodes will need a new CID.",
    correct: false,
    feedback: "The first part of this statement is true, but the second part is false! A node's CID in a Merkle DAG is not influenced by parent nodes."
  }
]

export default {
  question,
  choices
}
