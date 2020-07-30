export default function headRoot () {
  return {
    title: 'ProtoSchool',
    titleTemplate: '%s | ProtoSchool',
    link: [
      { rel: 'canonical', href: window.location.origin + window.location.pathname }
    ],
    meta: [
      { property: 'og:url', content: window.location.origin + window.location.pathname },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://proto.school/protoschool_screenshot.png' },
      { property: 'og:site_name', content: 'ProtoSchool' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://proto.school/protoschool_screenshot_twitter.png' },
      { name: 'twitter:image:alt', content: 'ProtoSchool screenshot' },
      { name: 'twitter:site', content: '@ProtoSchool' }
    ]
  }
}
