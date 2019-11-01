import tutorials from '../static/tutorials.json'

// SET CASING OVERRIDES HERE
// If a word in a URL would not be appopriate if only the first letter were capitalized,
// add that word here as a property with the correct capitalization (string) as its value.
// This is to be used for single words, not full hyphenated paths. Capitalization of that
// word will apply throughout all tutorial shortnames that include it.
const correctedCases = {
  api: 'API'
}

const fixCasing = function (word) {
  return correctedCases.hasOwnProperty(word) ? correctedCases[word] : (word.charAt(0).toUpperCase() + word.slice(1))
}

export const deriveShortname = function (path) {
  return path.split('/')[1].split('-').map(word => fixCasing(word)).join(' ')
}

export const migrateCache = (tutorialId, pastUrl) => {
  const tutorial = tutorials[tutorialId]
  const newUrl = tutorial.url
  // Go through the lesson in the tutorial
  for (let i = 0; i < tutorial.lessons.length; i++) {
    const idx = (i + 1).toString().padStart(2, 0)
    // Migrate lesson passed
    const passedItem = localStorage.getItem(`passed/${pastUrl}/${idx}`)
    if (passedItem) {
      localStorage.setItem(`passed/${newUrl}/${idx}`, passedItem)
      localStorage.removeItem(`passed/${pastUrl}/${idx}`)
    }
    // Migrate code cache
    const cachedItem = localStorage.getItem(`cached/${pastUrl}/${idx}`)
    if (cachedItem) {
      localStorage.setItem(`cached/${newUrl}/${idx}`, cachedItem)
      localStorage.removeItem(`cached/${pastUrl}/${idx}`)
    }
  }
  // Migrate resources
  const restItem = localStorage.getItem(`passed/${pastUrl}/resources`)
  if (restItem) {
    localStorage.setItem(`passed/${newUrl}/resources`, restItem)
    localStorage.removeItem(`passed/${pastUrl}/resources`)
  }
}
