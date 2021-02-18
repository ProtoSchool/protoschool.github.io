// Create a MultiaddrConnection
// https://github.com/libp2p/interface-transport#multiaddrconnection
module.exports = (memoryConnection, options) => {
  options = options || {}

  const maConn = {
    async sink (source) {
      return async function () {
        for await (const chunk of source) {
          console.log('[MemoryTransport.listener.maConn.sink]', chunk)
        }
      }
    },

    source: (async function * () {
      let i = 0
      while (true) yield i++
    })(),

    conn: memoryConnection,

    localAddr: memoryConnection,

    // If the remote address was passed, use it - it may have the peer ID encapsulated
    remoteAddr: memoryConnection,

    timeline: { open: Date.now() },

    close () {
      console.log('[MemoryTransport.connection]', 'close()')
      memoryConnection.close()
    }
  }

  return maConn
}
