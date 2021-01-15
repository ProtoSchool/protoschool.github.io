/* eslint quotes: ["error", "double"]  */

const question = "Which of the following datasets is likely to form a DAG?"

const choices = [
  {
    answer: "A map of highways between major cities",
    correct: false,
    feedback: "Not quite! While highways can be seen as directed edges, they often connect loops cities in loops!"
  },
  {
    answer: "Connections between users of a social network",
    correct: false,
    feedback: "Try again! Connections between users are usually not directed, and a trio of friends that know each other will form a cycle."
  },
  {
    answer: "A family tree",
    correct: true,
    feedback: "That’s right! A family tree is acyclic (you can’t be your own ancestor) and directed along lines of ancestry."
  },
  {
    answer: "A map of Internet infrastructure",
    correct: false,
    feedback: "Oops! Internet hubs have a high degree of interconnection, forming cycles."
  }
]

export default {
  question,
  choices
}
