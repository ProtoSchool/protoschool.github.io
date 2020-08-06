/*
  Routes are matched from top to bottom.
  Routes are matched without query parameters first, so that
  /tutorials?code=false matches /tutorials first, and then /tutorials?code=false
  matches, resulting in having the later being merged onto the first match.
*/

export default {
  '/': {
    'title': 'ProtoSchool | Interactive tutorials on decentralized web protocols',
    'description': 'Interactive tutorials on decentralized web protocols. Explore IPFS and Filecoin through code challenges, code-free lessons, and local events.'
  },
  '/build/': {
    'title': 'Build',
    'og:title': 'Build interactive ProtoSchool tutorials',
    'description': 'Build interactive ProtoSchool tutorials on decentralized web protocols like IPFS and Filecoin. Create DWeb coding challenges or text-based lessons and quizzes.'
  },
  '/contribute/': {
    'title': 'Contribute',
    'og:title': 'Contribute to the ProtoSchool community',
    'description': 'ProtoSchool is making it easy to get started with decentralized web technologies. Contribute by building tutorials, hosting local events, and more.'
  },
  '/events/': {
    'title': 'Events',
    'og:title': 'Attend ProtoSchool workshops',
    'description': 'Attend in-person or virtual ProtoSchool workshops around the globe to learn about decentralized web protocols with the support of local mentors.'
  },
  '/host/': {
    'title': 'Host',
    'og:title': 'Host ProtoSchool workshops',
    'description': 'Host local ProtoSchool workshops in your communtiy to introduce others to IPFS, Filecoin, and other decentralized web protocols and concepts.'
  },
  '/news/': {
    'title': 'News',
    'og:title': 'Subscribe to the ProtoSchool newsletter',
    'description': 'Subscribe to the ProtoSchool Newsletter for updates on new tutorials and site features. Opt-in for additional resources for local event leaders.'
  },

  // Tutorials Page
  '/tutorials/': {
    'title': 'Tutorials',
    'og:title': `Interactive tutorials on DWeb protocols | ProtoSchool`,
    'description': `Interactive tutorials on decentralized web protocols. Explore IPFS and Filecoin through coding challenges and code-free tutorials.`
  },
  '/tutorials/?code=false': {
    'og:title': 'Code-free decentralized web tutorials at ProtoSchool'
  },
  '/tutorials/?code=false&course=all': {
    'og:title': 'Code-free decentralized web tutorials at ProtoSchool'
  },
  '/tutorials/?course=ipfs': {
    'og:title': 'IPFS tutorials & coding challenges at ProtoSchool'
  },
  '/tutorials/?code=true&course=ipfs': {
    'og:title': 'IPFS tutorials & coding challenges at ProtoSchool'
  },
  '/tutorials/?code=false&course=ipfs': {
    'og:title': 'Code-free IPFS tutorials at ProtoSchool'
  },
  '/tutorials/?course=filecoin': {
    'og:title': 'Interactive Filecoin tutorials at ProtoSchool'
  },
  '/tutorials/?code=true&course=filecoin': {
    'og:title': 'Interactive Filecoin tutorials at ProtoSchool'
  },
  '/tutorials/?code=false&course=filecoin': {
    'og:title': 'Code-free Filecoin tutorials at ProtoSchool'
  },
  '/tutorials/?course=multiformats': {
    'og:title': 'Interactive Multiformats tutorials at ProtoSchool'
  },
  '/tutorials/?code=true&course=multiformats': {
    'og:title': 'Interactive Multiformats tutorials at ProtoSchool'
  },
  '/tutorials/?code=false&course=multiformats': {
    'og:title': 'Code-free Multiformats tutorials at ProtoSchool'
  }
}
