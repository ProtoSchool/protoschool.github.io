// Question must be a string
const question = 'Of the three storage deals listed above, which is the oldest deal that is still active (meaning the miner is still storing the data as promised)?'

// Choices must be an array of objects, each with the properties:
// `answer` (string), `correct` (boolean), and `feedback` (string)
// Only one answer can be correct.
const choices = [
  {
    answer: 'Deal 3',
    correct: false,
    feedback: "Nope! Although Deal 3 is still active, it's not the oldest. Take a closer look at the `epoch` for each deal."
  },
  {
    answer: 'Deal 4',
    correct: false,
    feedback: "Nope! Deal 4 is indeed the oldest, but its storage miner has failed to prove that they're still storing the data. Take a closer look at the `Slashed ?` values for each deal."
  },
  {
    answer: 'Deal 5',
    correct: true,
    feedback: "That's right! Although Deal 5 wasn't negotiated first (it has a higher epoch than Deal 4), it's the oldest one for which the miner is still storing the data. We know this because the value for `Slashed ?` is still `N`."
  }
]

export default {
  question,
  choices
}
