import tutorials from '../static/tutorials.json'

const correctedCases = {
  api: 'API'
}

const fixCasing = function (e) {
  if (correctedCases.hasOwnProperty(e)) {
    return correctedCases[e]
  } else {
    return e.charAt(0).toUpperCase() + e.slice(1)
  }
}

export const deriveShortname = function (path) {
  return path.split('/')[1].split('-').map(e => fixCasing(e)).join(' ')
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
