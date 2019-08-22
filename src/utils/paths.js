import tutorials from '../static/tutorials.json'

export const deriveShortname = (path) =>
  path
    .split('/')[1]
    .split('-')
    .map(e => e.charAt(0).toUpperCase() + e.slice(1))
    .join(' ')

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
