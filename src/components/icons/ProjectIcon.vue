<template>
  <DWebIcon v-if="id === 'dweb'"/>
  <FilecoinIcon v-else-if="id === 'filecoin'"/>
  <IPFSIcon v-else-if="id === 'ipfs'"/>
  <IPLDIcon v-else-if="id === 'ipld'"/>
  <Libp2pIcon v-else-if="id === 'libp2p'"/>
  <MultiformatsIcon v-else-if="id === 'multiformats'"/>
</template>

<script>
import DWebIcon from '../../static/images/projects/dweb.svg?inline'
import FilecoinIcon from '../../static/images/projects/filecoin.svg?inline'
import IPFSIcon from '../../static/images/projects/ipfs.svg?inline'
import IPLDIcon from '../../static/images/projects/ipld.svg?inline'
import Libp2pIcon from '../../static/images/projects/libp2p.svg?inline'
import MultiformatsIcon from '../../static/images/projects/multiformats.svg?inline'

export default {
  name: 'ProjectIcon',
  components: {
    DWebIcon,
    FilecoinIcon,
    IPFSIcon,
    IPLDIcon,
    Libp2pIcon,
    MultiformatsIcon
  },
  props: {
    id: String,
    alt: String
  }
}

</script>
