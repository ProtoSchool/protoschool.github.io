import root from './data/root'
import pagesMetadata from './data/pages'
import dynamicPages from './data/dynamic-pages'

function head (customData) {
  const meta = []
  const data = {
    ...pagesMetadata[window.location.pathname],
    ...pagesMetadata[window.location.pathname + window.location.search],
    ...customData
  }

  if (data.title && !data['og:title']) {
    meta.push({ property: 'og:title', content: data.title })
  }

  if (data.description && !data['og:description']) {
    meta.push({ property: 'og:description', content: data.description })
  }

  for (const key in data) {
    if (data.hasOwnProperty(key) && key !== 'title') {
      const objectKey = key.startsWith('og:') ? 'property' : 'name'

      meta.push({ [objectKey]: key, content: data[key] })
    }
  }

  return {
    title: data.title,
    meta
  }
}

head.dynamic = dynamicPages(head)
head.root = root

export default head
