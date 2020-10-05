import toConnection from './connection'

const EventEmitter = require('events')
const withIs = require('class-is')

const constants = {
  CODE_P2P: 421
}

class MemoryTransport {
  peers = []

  constructor ({ upgrader, input, output }) {
    // console.log('[MemoryTransport.construct]', upgrader)

    if (!upgrader) {
      throw new Error('An upgrader must be provided. See https://github.com/libp2p/interface-transport#upgrader.')
    }

    this._upgrader = upgrader
    this._input = input
    this._output = output
  }

  async dial (ma, options = {}) {
    // console.log('[MemoryTransport.dial]', ma, ma.toString(), ma.protos())

    this._dialConnection = toConnection({
      address: ma,
      input: this._input,
      output: this._output
    })

    // console.log('new outbound connection %s', this._dialConnection.remoteAddr)

    const conn = await this._upgrader.upgradeOutbound(this._dialConnection)

    // console.log('outbound connection %s upgraded', this._dialConnection.remoteAddr)

    return conn
  }

  createListener (options = {}, handler) {
    const listener = new EventEmitter()

    // console.log('[MemoryTransport.createListener]', options, handler)

    if (!handler && typeof options === 'function') {
      handler = options
      options = {}
    }

    listener.emit('listening')
    // setTimeout(() => listener.emit('connection', {}), 3000)

    let peerId, listeningAddr

    listener.listen = ma => {
      listeningAddr = ma
      peerId = ma.getPeerId()

      if (peerId) {
        listeningAddr = ma.decapsulateCode(constants.CODE_P2P)
      }

      this._listenConnection = toConnection({
        address: ma,
        input: this._input,
        output: this._output
      })

      const upgradedConnection = this._upgrader.upgradeInbound(this._listenConnection)
      handler(upgradedConnection)
      // console.log('### listener', handler(upgradedConnection))
      listener.emit('connection', upgradedConnection)

      return new Promise(resolve => resolve())
    }

    listener.getAddrs = () => {
      return peerId ? [listeningAddr.encapsulate(`/p2p/${peerId}`)] : [listeningAddr]
    }

    listener.close = () => { } // console.log('[MemoryTransport.listener]', 'event: close')

    return listener
  }

  /**
  * Takes a list of `Multiaddr`s and returns only valid memory addresses
  * @param {Multiaddr[]} multiaddrs
  * @returns {Multiaddr[]} Valid Memory multiaddrs
  */
  filter (multiaddrs) {
    multiaddrs = Array.isArray(multiaddrs) ? multiaddrs : [multiaddrs]

    return multiaddrs.filter(ma => ma.protoNames().includes('memory'))
  }
}

const EnhancedMemoryTransport = withIs(MemoryTransport, { className: 'Memory', symbolName: '@libp2p/js-libp2p-memory/Memory' })

export default EnhancedMemoryTransport
