const EventEmitter = require('events')
const withIs = require('class-is')
const Pair = require('it-pair')
// const DuplexPair = require('it-pair/duplex')

const constants = {
  CODE_P2P: 421
}

class MemoryTransport {
  peers = []

  constructor ({ upgrader }) {
    console.log('[MemoryTransport.construct]', upgrader)

    if (!upgrader) {
      throw new Error('An upgrader must be provided. See https://github.com/libp2p/interface-transport#upgrader.')
    }

    this._upgrader = upgrader
    // this._duplexPair = DuplexPair()
    this._p = Pair()
  }

  async dial (ma, options = {}) {
    console.log('[MemoryTransport.dial]', ma, ma.toString(), ma.protos())

    const maConn = {
      conn: { ma }, // stream
      remoteAddr: ma,
      signal: options.signal,
      close: (error) => {
        console.log('maCoon - close', error)
      },
      // source: duplexPair[0],
      // sink: duplexPair[1]
      source: this._p.source,
      sink: this._p.sink
    }

    this._maConn = maConn

    console.log('new outbound connection %s', maConn.remoteAddr)

    const conn = await this._upgrader.upgradeOutbound(maConn)

    console.log('outbound connection %s upgraded', maConn.remoteAddr)

    return conn
  }

  createListener (options = {}, handler) {
    const listener = new EventEmitter()

    console.log('[MemoryTransport.createListener]')

    // setTimeout(() => listener.emit('connection', {}), 3000)

    let peerId, listeningAddr

    listener.listen = ma => {
      listeningAddr = ma
      peerId = ma.getPeerId()

      if (peerId) {
        listeningAddr = ma.decapsulateCode(constants.CODE_P2P)
        console.log('listen', peerId)
      }

      listener.emit('listening')

      this._p.source.pipe(this._p.sink)
    }

    listener.getAddrs = () => {
      return peerId ? listeningAddr.encapsulate(`/p2p/${peerId}`) : listeningAddr
    }

    listener.close = () => console.log('[MemoryTransport.listener]', 'event: close')

    this._upgrader.upgradeInbound(this._maConn)
      .then(handler)
      .catch(error => {
        listener.emit('error', error)
      })

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
