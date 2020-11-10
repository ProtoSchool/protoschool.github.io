/*
  This util for the website's head metadata can be used in static pages
  and dynamic pages.

  Static pages are /build, /events, /contribute etc
  Dynamic pages are /basics, /basics/03, /basics/resources

  In order to avoid having the metadata spread out in each page component,
  we consolidate all the metadata in the data folder.
  Besides the static and dynamic pages, we also have a file for the root of the
  app. Root metadata includes things that are global to all the pages.

  Usage example for static pages:

  ```
  <script>
  import head from '../utils/head

  export default {
    head() {
      return head()
    }
  }
  </script>
  ```

  For dynamic pages:

  ```
  export default {
    head: function () {
      return head.dynamic.tutorials({ context: this }) // for /:tutorialId pages
    }
  }
  ```

  For the root page:
  ```
  export default {
    head: head.root()
  }
  ```

  Optinally, to override data from a component:

  Usage example for static pages:

  ```
  <script>
  import head from '../utils/head

  export default {
    head: head({ title: 'Build Tutorials for ProtoSchool' })
  }
  </script>
  ```

  For dynamic pages:

  ```
  export default {
    head: function () {
      return head.dynamic.tutorials({
        context: this,
        data: { title: 'Data Structures for the DWeb' }
      })
    }
  }
  ```
*/

import root from './data/root'
import staticPages from './data/static-pages'
import dynamicPages from './data/dynamic-pages'

function head (customData) {
  const meta = []
  const data = {
    ...staticPages[window.location.pathname],
    ...staticPages[window.location.pathname + window.location.search],
    ...customData
  }

  // Pass title to og:title if not present
  if (data.title && !data['og:title']) {
    meta.push({ property: 'og:title', content: data.title, vmid: 'og:title' })
  }

  // Pass description to og:description if not present
  if (data.description && !data['og:description']) {
    meta.push({ property: 'og:description', content: data.description, vmid: 'og:description' })
  }

  // Add all og:* with `property` attribute, otherwise, use `name` attribute
  for (const key in data) {
    if (data.hasOwnProperty(key) && key !== 'title') {
      const objectKey = key.startsWith('og:') ? 'property' : 'name'
      meta.push({ [objectKey]: key, content: data[key], vmid: key })
    }
  }

  // Return to vue-meta
  return {
    title: data.title,
    meta
  }
}

head.dynamic = dynamicPages(head)
head.root = root

export default head
