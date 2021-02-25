<template>
  <footer :class="`bg-navy white pt4 pb2 ${noTopMargin ? '':'mt4'}`">
    <div class="flex mw7 ph3 center">
      <div  class="w-33">
        <router-link to="/" class="flex items-center link">
          <ProtoSchoolLogo alt="ProtoSchool" class="w2 mr2 "/>
          <div class="ma0 fw4 white f4">
            <span class="montserrat fw4">Proto</span>
            <span class="montserrat fw2">School</span>
          </div>
        </router-link>
        <div class="header-text mr3 mt3 ma0 montserrat fw3 f6 lh-copy">
          Interactive tutorials on decentralized web protocols
        </div>
      </div>
        <div class="w-20">
          <span class="fw7">Courses</span>
          <ul class="list pl0">
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="/course/ipfs">IPFS</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="/course/filecoin">Filecoin</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="/course/ipld">IPLD</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="/course/multiformats">Multiformats</a></li>
          </ul>
        </div>
        <div class="w-20">
          <span class="fw7">Community</span>
          <ul class="list pl0">
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="https://github.com/protoschool">GitHub</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="https://twitter.com/protoschool">Twitter</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="/news">Newsletter</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="/contribute">Contribute</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="/contribute#contact">Contact</a></li>
          </ul>
        </div>

        <div class="w-20">
          <span class="fw7">Related Projects</span>
          <ul class="list pl0">
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="https://ipfs.io">IPFS</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="https://filecoin.io">Filecoin</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="https://ipld.io">IPLD</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="https://libp2p.io">libp2p</a></li>
            <li class="pv1"><a class="link underline-hover white o-80 glow" href="https://multiformats.io">Multiformats</a></li>
          </ul>
        </div>
    </div>
    <div class="flex justify-start mt4 mw7 center ph3 f6">
      <p>© <a class="link underline white o-80 glow" href="https://protocol.ai">Protocol Labs</a> | Except as <a class="link underline white o-80 glow" href="https://protocol.ai/legal/">noted</a>, content licensed <a class="link underline white o-80 glow" href="https://creativecommons.org/licenses/by/3.0/">CC-BY 3.0</a>.</p>
    </div>
  </footer>
</template>

<script>
import ProtoSchoolLogo from '../../static/images/ps_symbol_color.svg?inline'

export default {
  name: 'Footer',
  components: {
    ProtoSchoolLogo
  },
  props: {
    noTopMargin: Boolean
  }
}
</script>
