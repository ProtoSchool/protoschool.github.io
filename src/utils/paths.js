import tutorials from './tutorials'

function migrateCacheEntry (tutorialId, pastUrl) {
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

/*
    Migrates cache entries to new urls based on the redirects specified on the tutorials.json file
 */
export function migrateCache () {
  for (const tutorialId in tutorials) {
    const tutorial = tutorials[tutorialId]

    if (tutorial.redirectUrls) {
      tutorial.redirectUrls.forEach(redirect => migrateCacheEntry(tutorialId, redirect))
    }
  }
}
