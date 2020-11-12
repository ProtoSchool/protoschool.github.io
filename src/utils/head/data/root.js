export default function headRoot () {
  // Return to vue-meta
  return {
    title: 'ProtoSchool',
    titleTemplate: title => title && !title.includes('ProtoSchool') ? `${title} | ProtoSchool` : title,
    link: [
      { rel: 'canonical', href: 'https://proto.school' + window.location.pathname }
    ],
    meta: [
      { property: 'og:url', content: 'https://proto.school' + window.location.pathname },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://proto.school/social-tiles/twitter/brand.jpg' },
      { property: 'og:site_name', content: 'ProtoSchool' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: 'https://proto.school/social-tiles/twitter/brand.jpg' },
      { name: 'twitter:image:alt', content: 'ProtoSchool: Interactive tutorials on decentralized web protocols' },
      { name: 'twitter:site', content: '@ProtoSchool' }
    ].map(item => ({
      ...item,
      vmid: item.property || item.name
    })),
    changed (newInfo) {
      clearTimeout(window.__APP_RENDERED_TIMEOUT__)

      window.__APP_RENDERED_TIMEOUT__ = setTimeout(() => {
        document.dispatchEvent(new Event('x-app-rendered'))
      }, 200)
    }
  }
}
