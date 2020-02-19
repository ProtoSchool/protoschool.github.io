const question = 'How can we identify the encoding used on specific data when using CIDv1?'

const choices = [
  {
    answer: 'These CIDs have a multicodec prefix that specifies which encoding method was used.',
    correct: true,
    feedback: 'That\'s right!'
  },
  {
    answer: 'All encodings make it safe to try and check the first bytes of the data to figure out which encoding was used.',
    correct: false,
    feedback: 'Hmm, not always. Please check the information above'
  },
  {
    answer: 'The codec used on CIDv1 is always "base58btc".',
    correct: false,
    feedback: 'Hmm, not always. Please review this lesson again.'
  }
]

export default {
  question,
  choices
}
