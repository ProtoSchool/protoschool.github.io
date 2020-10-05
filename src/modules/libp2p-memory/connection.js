// Convert a multiaddr into a MultiaddrConnection
// https://github.com/libp2p/interface-transport#multiaddrconnection
export default function ({ address, input, output }, options = {}) {
  return {
    sink: output.sink,
    source: input.source,
    conn: { input, output },
    localAddr: address,
    remoteAddr: address,
    timeline: { open: Date.now() },
    close () {
      // console.log('to-connection - close()')
    }
  }
}
