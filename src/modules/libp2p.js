import Libp2p from 'libp2p'
import { NOISE } from 'libp2p-noise'
// import Secio from 'libp2p-secio'
import Mplex from 'libp2p-mplex'
import Gossipsub from 'libp2p-gossipsub'
import EventEmitter from 'events'

import Memory from './libp2p-memory'

// const ADDRESS = '/ip4/0.0.0.0/tcp/9090'
const ADDRESS = '/memory/protoschool'
const memory = new EventEmitter()

export async function createNode ({ duplex, onLog, onConnect }) {
  // Create our libp2p node
  const libp2p = await Libp2p.create({
    addresses: {
      listen: [ADDRESS]
    },
    modules: {
      transport: [Memory],
      connEncryption: [NOISE],
      streamMuxer: [Mplex],
      pubsub: Gossipsub
    },
    config: {
      transport: {
        'Memory': { duplex, memory }
      }
    }
  })

  // Listen for new peers
  libp2p.on('peer:discovery', (peerInfo) => {
    onLog(`Found peer ${peerInfo.id.toString()}`)
  })

  // Listen for new connections to peers
  libp2p.on('peer:connect', async (peerInfo) => {
    onLog(`Connected to ${peerInfo.id.toString()}`)
    onConnect && await onConnect(peerInfo)
  })

  // Listen for peers disconnecting
  libp2p.on('peer:disconnect', (peerInfo) => {
    onLog(`Disconnected from ${peerInfo.id.toString()}`)
  })

  await libp2p.start()
  onLog(`libp2p started!`)
  onLog(`libp2p id is ${libp2p.peerInfo.id.toString()}`)

  return libp2p
}

export async function dial (peer, peerToDial) {
  console.log('dial', 'from', peer.peerInfo.id.toString(), 'to', peerToDial.peerInfo.id.toString())
  await peer.dial(`${ADDRESS}/p2p/${peerToDial.peerInfo.id.toString()}`)
  console.log('dial done!')
}

export default {
  createNode,
  dial
}
