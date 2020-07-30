const tutorialsPage = {
  '/tutorials': {
    'title': 'Tutorials',
    'og:title': 'ProtoSchool Interactive Tutorials',
    'description': `Our self-guided interactive tutorials are designed to introduce you to decentralized web concepts, protocols, and tools.`
  },
  '/tutorials?code=false': {
    'og:title': 'ProtoSchool Interactive Code-free Tutorials'
  },
  '/tutorials?code=false&course=all': {
    'og:title': 'ProtoSchool Interactive Code-free Tutorials'
  },
  '/tutorials?course=ipfs': {
    'og:title': 'IPFS Interactive IPFS Tutorials'
  },
  '/tutorials?code=true&course=ipfs': {
    'og:title': 'IPFS Interactive IPFS Tutorials'
  },
  '/tutorials?code=false&course=ipfs': {
    'og:title': 'Interactive Code-free IPFS Tutorials'
  },
  '/tutorials?course=filecoin': {
    'og:title': 'Interactive Code-free Filecoin Tutorials'
  },
  '/tutorials?code=true&course=filecoin': {
    'og:title': 'Interactive Filecoin Tutorials'
  },
  '/tutorials?code=false&course=filecoin': {
    'og:title': 'Interactive Code-free Filecoin Tutorials'
  },
  '/tutorials?course=multiformats': {
    'og:title': 'Interactive Multiformats Tutorials'
  },
  '/tutorials?code=true&course=multiformats': {
    'og:title': 'Interactive Multiformats Tutorials'
  },
  '/tutorials?code=false&course=multiformats': {
    'og:title': 'Interactive Code-free Multiformats Tutorials'
  }
}

export default {
  '/': {
    'title': 'Homepage',
    'description': 'ProtoSchool is an educational community that teaches decentralized web protocols and tools through online tutorials and local events.',
    'og:description': 'Interactive tutorials on decentralized web protocols. Complete code challenges online or at a local event.'
  },
  '/build': {
    'title': 'Build',
    'og:title': 'Build an Interactive Tutorial for ProtoSchool',
    'description': 'ProtoSchool is a community-driven effort, and we rely on contributors like you to create great educational content!'
  },
  '/contribute': {
    'title': 'Contribute',
    'og:title': 'Contribute to the ProtoSchool Community',
    'description': 'ProtoSchool is a community-driven open source project dedicated to making it easy to get started with decentralized web technologies.'
  },
  '/events': {
    'title': 'Events',
    'description': 'Live ProtoSchool workshops around the globe offer you the opportunity to complete our interactive tutorials with the support of local mentors.'
  },
  '/host': {
    'title': 'Host',
    'og:title': 'Organize Local Events with ProtoSchool Tutorials',
    'description': 'ProtoSchool workshops are run independently by groups and inviduals around the world who are excited about introducing others to decentralized web concepts and protocols'
  },
  '/news': {
    'title': 'News',
    'og:title': 'Subscribe to the ProtoSchool Newsletter',
    'description': 'Subscribe to the ProtoSchool Newsletter for updates on new tutorials and site features.'
  },
  ...tutorialsPage
}
