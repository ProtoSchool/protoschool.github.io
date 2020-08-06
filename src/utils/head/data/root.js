export default function headRoot () {
  // Return to vue-meta
  return {
    title: 'ProtoSchool',
    titleTemplate: '%s | ProtoSchool',
    link: [
      { rel: 'canonical', href: 'https://proto.school' + window.location.pathname }
    ],
    meta: [
      { property: 'og:url', content: 'https://proto.school' + window.location.pathname },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://proto.school/protoschool_screenshot.png' },
      { property: 'og:site_name', content: 'ProtoSchool' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://proto.school/protoschool_screenshot_twitter.png' },
      { name: 'twitter:image:alt', content: 'ProtoSchool screenshot' },
      { name: 'twitter:site', content: '@ProtoSchool' }
    ],
    changed (newInfo, addedTags, removedTags) {
      clearTimeout(window.__APP_RENDERED_TIMEOUT__)
      window.__APP_RENDERED_TIMEOUT__ = setTimeout(() => {
        document.dispatchEvent(new Event('x-app-rendered'))
      }, 200)
    }
  }
}
