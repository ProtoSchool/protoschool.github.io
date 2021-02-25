<template>
  <footer :class="`bg-navy white pt4 pb2 ${noTopMargin ? '':'mt4'}`">
    <div class="flex mw7 ph3 center flex-wrap"> <!-- logo & columns -->
      <div  class="w-33-l w-100 mb0-l mb3">
        <router-link to="/" class="flex items-center link">
          <ProtoSchoolLogo alt="ProtoSchool" class="w2 mr2 "/>
          <div class="ma0 fw4 white f4">
            <span class="montserrat fw4">Proto</span>
            <span class="montserrat fw2">School</span>
          </div>
        </router-link>
      </div>
        <div class="w-20-l w-25-m w-33 column">
          <span class="fw7">{{translations.columnHeaders.courses}}</span>
          <ul class="list pl0">
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="/course/ipfs">IPFS</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="/course/filecoin">Filecoin</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="/course/ipld">IPLD</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="/course/multiformats">Multiformats</a></li>
          </ul>
        </div>
        <div class="w-20-l w-25-m w-33 column">
          <span class="fw7">{{translations.columnHeaders.community}}</span>
          <ul class="list pl0">
            <li class="pv1"><a class="link underline-hover white o-80 glow" target="_blank" href="https://github.com/protoschool">GitHub</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" target="_blank" href="https://twitter.com/protoschool">Twitter</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="/news">{{translations.communityLinks.newsletter}}</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="/contribute">{{translations.communityLinks.contribute}}</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="/contribute#contact">{{translations.communityLinks.contact}}</a></li>
          </ul>
        </div>

        <div class="w-20-l w-25-m w-33 column">
          <span class="fw7">{{translations.columnHeaders.relatedProjects}}</span>
          <ul class="list pl0">
            <li class="pv1"><a class="link underline-hover white o-80 glow" target="_blank" href="https://ipfs.io">IPFS</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" target="_blank" href="https://filecoin.io">Filecoin</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" target="_blank" href="https://ipld.io">IPLD</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" target="_blank" href="https://libp2p.io">libp2p</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" target="_blank" href="https://multiformats.io">Multiformats</a></li>
          </ul>
        </div>
    </div>
    <div class="flex justify-start mt4 mw7 center ph3 f6 o-70"> <!-- fake element plus copyright -->
      <div class="w-33-l">
      </div>
      <p>© <a class="link underline white o-80 glow" target="_blank" href="https://protocol.ai">Protocol Labs</a> | {{translations.copyright._1}} <a class="link underline white o-80 glow" target="_blank" href="https://protocol.ai/legal/">{{translations.copyright._2}}</a>{{translations.copyright._3}} <a class="link underline white o-80 glow" target="_blank" v-bind:href="translations.copyright.licenseURL" >CC-BY 3.0</a>{{translations.copyright._4}}</p>
    </div>
  </footer>
</template>

<script>
import ProtoSchoolLogo from '../../static/images/ps_symbol_color.svg?inline'
import translations from '../../static/translations'

export default {
  name: 'Footer',
  components: {
    ProtoSchoolLogo
  },
  props: {
    noTopMargin: Boolean
  },
  computed: {
    translations: function () {
      return translations.footer
    }
  }
}
</script>
<style scoped>
.column {
  margin-top: 0.7rem;
}
</style>
