<template>
  <div>
    <Header/>
    <section class="w-100 mw7 center ph3">
      <h1 class="mt4">Libp2p Test</h1>
      <div>
        <pre>Peer IDs: {{ids}}</pre>
        <form>
          <div>
            <label for="username">Username:</label>
            <input name="username" v-model="username" />
          </div>
        </form>
      </div>
      <div class="flex">
        <div class="w-50 messages pr2">
          <h2>Messages</h2>
          <div class="messages-list h5">
            <span
              v-for="message in messages"
              :key="message.user + message.text"
              class="message"
            >[{{message.timestamp}}] {{message.user}}: {{message.text}}</span>
            <div id="anchor"></div>
          </div>
          <form @submit.prevent="onSubmit">
            <input v-model="inputText" />
          </form>
        </div>
        <div class="w-50 logs h5">
          <h2>Logs</h2>
          <div class="logs-list h5 f7">
            <pre
              v-for="log in logs"
              :key="log.text + log.timestamp"
            >{{log.text}}</pre>
            <div id="anchor"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import libp2p from '../modules/libp2p'

import Header from '../components/Header.vue'

const topic = 'messages'

export default {
  name: 'Libp2pTest',
  components: {
    Header
  },
  data: () => ({
    username: '',
    ids: [],
    messages: [],
    logs: [],
    inputText: '',
    subscribed: false,
    node1: null,
    node2: null
  }),
  methods: {
    dial: async function (peer) {
      await this.node1.dial(peer)
      this.logs.push(`dialled to peer ${peer.id}`)

      if (!this.subscribed) {
        this.subscribe()
      }
    },
    subscribe: async function () {
      await this.node1.pubsub.subscribe(topic, ({ data }) => {
        this.messages.push(JSON.parse(data.toString()))
      })
      this.logs.push(`subscribed to "${topic}"`)
      this.subscribed = true
    },
    onSubmit: async function () {
      if (!this.inputText) {
        return
      }

      const message = {
        user: this.username,
        text: this.inputText,
        timestamp: new Date()
      }

      this.node1.pubsub.publish(topic, Buffer.from(JSON.stringify(message)))
      this.inputText = ''
    },
    onLog: function (log) {
      this.logs.push({ text: log, timestamp: Date.now() })
    }
  },
  mounted: async function () {
    if (this.node1) {
      return
    }

    this.node1 = await libp2p.createNode({
      onLog: log => this.onLog(`node 1: ${log}`)
    })
    this.node2 = await libp2p.createNode({
      onLog: log => this.onLog(`node 2: ${log}`)
    })

    this.ids.push(this.node1.peerInfo.id.toB58String())
    this.ids.push(this.node2.peerInfo.id.toB58String())

    await libp2p.dial(this.node1, this.node2)
    this.logs.push(`node1 dialled to peer ${this.node2.peerInfo.id.toB58String()}`)

    /* await this.node1.pubsub.subscribe(topic, ({ data }) => {
      this.messages.push(JSON.parse(data.toString()))
    })
    this.logs.push(`subscribed to "${topic}"`) */
  }
}
</script>
<style scoped>
.logs-list {
  overflow-y: scroll;
}

.logs-list pre {
  font-size: 0.6rem;
  margin: 0;
  min-height: 1rem;
  height: 1rem;
  overflow: hidden;

  overflow-anchor: none;
}

.logs-list #anchor {
  overflow-anchor: auto;
  height: 1px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  overflow-y: scroll;
}

.messages-list::after {
  content: '';
  display: block;
  bottom: 0;
  overflow-anchor: auto;
  min-height: 1px;
}

.message {
  overflow-anchor: none;
}
</style>
