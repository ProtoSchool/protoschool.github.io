/* eslint quotes: ["error", "double"]  */

// #PRISTINE# This file was auto-generated. Please remove this line when updating the file manually.

// Question must be a string
const question = "Which of the following statements about datasets distributed as Merkle DAGs is FALSE?"

// Choices must be an array of objects, each with the properties:
// `answer` (string), `correct` (boolean), and `feedback` (string)
// Only one answer can be correct.
const choices = [
  {
    answer: "Anyone who has a copy of the dataset&mdash;or a subset of the DAG&mdash;can choose to help distribute it.",
    correct: false,
    feedback: "Oops! This statement is actually true. The ability of peers to all distribute the same data is a hallmark of the decentralized web, enabled by content addressing. Can you find the statement that's false?"
  },
  {
    answer: "Because it has a single root node, the full dataset must be retrieved from a single provider.",
    correct: true,
    feedback: "You spotted the false statement! Because each node in a DAG has its own CID, it can be shared and retrieved independently of a larger DAG in which it's embedded."
  },
  {
    answer: "Different segments of a dataset can be retrieved in parallel from a variety of providers or data centers around the globe.",
    correct: false,
    feedback: "Oops! This statement is actually true. Distributability is one of the key benefits of Merkle DAGs. Can you find the statement that's false?"
  }
]

export default {
  question,
  choices
}
