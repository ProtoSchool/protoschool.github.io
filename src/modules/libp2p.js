import Libp2p from 'libp2p'
// import { NOISE } from 'libp2p-noise'
// import Secio from 'libp2p-secio'
// import Mplex from 'libp2p-mplex'
import Gossipsub from 'libp2p-gossipsub'

import Memory from './libp2p-memory'

// const ADDRESS = '/ip4/0.0.0.0/tcp/9090'
const ADDRESS = '/memory/protoschool'

export async function createNode ({ onLog, onConnect }) {
  // Create our libp2p node
  const libp2p = await Libp2p.create({
    address: {
      listen: [ADDRESS]
    },
    modules: {
      transport: [Memory],
      // connEncryption: [NOISE, Secio],
      // streamMuxer: [Mplex],
      pubsub: Gossipsub
    }
  })

  // Listen for new peers
  libp2p.on('peer:discovery', (peerInfo) => {
    onLog(`Found peer ${peerInfo.id.toB58String()}`)
  })

  // Listen for new connections to peers
  libp2p.on('peer:connect', async (peerInfo) => {
    onLog(`Connected to ${peerInfo.id.toB58String()}`)
    onConnect && await onConnect(peerInfo)
  })

  // Listen for peers disconnecting
  libp2p.on('peer:disconnect', (peerInfo) => {
    onLog(`Disconnected from ${peerInfo.id.toB58String()}`)
  })

  await libp2p.start()
  onLog(`libp2p started!`)
  onLog(`libp2p id is ${libp2p.peerInfo.id.toB58String()}`)

  return libp2p
}

export async function dial (peer, peerToDial) {
  console.log(peerToDial.peerInfo.id.toB58String())
  await peer.dial(`${ADDRESS}/p2p/${peerToDial.peerInfo.id.toB58String()}`)
}

export default {
  createNode,
  dial
}
