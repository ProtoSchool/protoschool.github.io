/*
  Routes are matched from top to bottom.
  Routes are matched without query parameters first, so that
  /tutorials?code=false matches /tutorials first, and then /tutorials?code=false
  matches, resulting in having the later being merged onto the first match.
*/

export default {
  '/': {
    'title': 'Homepage',
    'description': 'Interactive tutorials on decentralized web protocols. Explore IPFS and Filecoin through code challenges, code-free lessons, and local events.'
  },
  '/build/': {
    'title': 'Build',
    'og:title': 'Build an Interactive Tutorial for ProtoSchool',
    'description': 'ProtoSchool is a community-driven effort, and we rely on contributors like you to create great educational content!'
  },
  '/contribute/': {
    'title': 'Contribute',
    'og:title': 'Contribute to the ProtoSchool Community',
    'description': 'ProtoSchool is a community-driven open source project dedicated to making it easy to get started with decentralized web technologies.'
  },
  '/events/': {
    'title': 'Events',
    'description': 'Live ProtoSchool workshops around the globe offer you the opportunity to complete our interactive tutorials with the support of local mentors.'
  },
  '/host/': {
    'title': 'Host',
    'og:title': 'Organize Local Events with ProtoSchool Tutorials',
    'description': 'ProtoSchool workshops are run independently by groups and inviduals around the world who are excited about introducing others to decentralized web concepts and protocols'
  },
  '/news/': {
    'title': 'News',
    'og:title': 'Subscribe to the ProtoSchool Newsletter',
    'description': 'Subscribe to the ProtoSchool Newsletter for updates on new tutorials and site features.'
  },

  // Tutorials Page
  '/tutorials/': {
    'title': 'Tutorials',
    'og:title': 'ProtoSchool Interactive Tutorials',
    'description': `Interactive tutorials on decentralized web protocols. Explore IPFS and Filecoin through code challenges, code-free lessons, and local events.`
  },
  '/tutorials/?code=false': {
    'og:title': 'ProtoSchool Interactive Code-free Tutorials'
  },
  '/tutorials/?code=false&course=all': {
    'og:title': 'ProtoSchool Interactive Code-free Tutorials'
  },
  '/tutorials/?course=ipfs': {
    'og:title': 'IPFS Interactive IPFS Tutorials'
  },
  '/tutorials/?code=true&course=ipfs': {
    'og:title': 'IPFS Interactive IPFS Tutorials'
  },
  '/tutorials/?code=false&course=ipfs': {
    'og:title': 'Interactive Code-free IPFS Tutorials'
  },
  '/tutorials/?course=filecoin': {
    'og:title': 'Interactive Code-free Filecoin Tutorials'
  },
  '/tutorials/?code=true&course=filecoin': {
    'og:title': 'Interactive Filecoin Tutorials'
  },
  '/tutorials/?code=false&course=filecoin': {
    'og:title': 'Interactive Code-free Filecoin Tutorials'
  },
  '/tutorials/?course=multiformats': {
    'og:title': 'Interactive Multiformats Tutorials'
  },
  '/tutorials/?code=true&course=multiformats': {
    'og:title': 'Interactive Multiformats Tutorials'
  },
  '/tutorials/?code=false&course=multiformats': {
    'og:title': 'Interactive Code-free Multiformats Tutorials'
  }
}
