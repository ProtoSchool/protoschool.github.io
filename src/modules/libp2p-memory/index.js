const EventEmitter = require('events')
const withIs = require('class-is')

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
  }

  async dial (ma, options = {}) {
    console.log('[MemoryTransport.dial]', ma, ma.toString(), ma.protos())

    const maConn = {
      conn: { ma },
      remoteAddr: ma,
      signal: options.signal,
      close: () => {
        console.log('maCoon - close')
        return Buffer.from('\n')
      },
      sink: async source => {
        for await (const chunk of source) {
          console.log('sink - chunk', chunk)
          console.log('sink - string', chunk.toString())
        }

        return Buffer.from('\n')
      },
      source: (async function * () {
        let i = 20

        while (i > 0) {
          console.log('source it', i)
          yield ([i--, ...Buffer.from('\n')])
        }

        console.log('source', i)
        yield Buffer.from('\n')
      })()
    }

    this._maConn = maConn

    console.log('new outbound connection %s', maConn.remoteAddr)

    const conn = await this._upgrader.upgradeOutbound(maConn)

    console.log('outbound connection %s upgraded', maConn.remoteAddr)

    return conn
  }

  async createListener (options = {}, handler) {
    const listener = new EventEmitter()

    console.log('[MemoryTransport.createListener]')

    // setTimeout(() => listener.emit('listening'), 2000)
    // setTimeout(() => listener.emit('connection', {}), 3000)

    let peerId, listeningAddr

    listener.listen = ma => {
      listeningAddr = ma
      peerId = ma.getPeerId()

      if (peerId) {
        listeningAddr = ma.decapsulateCode(constants.CODE_P2P)
        console.log('listen', peerId)
      }
    }

    listener.getAddrs = () => {
      return peerId ? listeningAddr.encapsulate(`/p2p/${peerId}`) : listeningAddr
    }

    listener.close = () => console.log('[MemoryTransport.listener]', 'event: close')

    handler(this._upgrader.upgradeInbound(this._maConn))

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
