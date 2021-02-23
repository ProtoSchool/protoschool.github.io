<template>
  <div>
    <footer class="bg-navy white pv3">
      <div class="flex justify-between mw7 center">
        <div>
          <router-link to="/" class="mt4">
            <ProtoSchoolLogo alt="ProtoSchool" class="w3" />
          </router-link>
        </div>
        <div>
          <h3>Courses</h3>
          <ul class="list pl0">
            <li><a class="link underline-hover white" href="/course/ipfs">IPFS</a></li>
            <li><a class="link underline-hover white" href="/course/filecoin">Filecoin</a></li>
            <li><a class="link underline-hover white" href="/course/ipld">IPLD</a></li>
            <li><a class="link underline-hover white" href="/course/multiformats">Multiformats</a></li>
          </ul>
        </div>
        <div>
          <h3>Community</h3>
          <ul class="list pl0">
            <li><a class="link underline-hover white" href="https://github.com/protoschool">GitHub</a></li>
            <li><a class="link underline-hover white" href="https://twitter.com/protoschool">Twitter</a></li>
            <li><a class="link underline-hover white" href="/news">Newsletter</a></li>
            <li><a class="link underline-hover white" href="/contribute">Contribute</a></li>
            <li><a class="link underline-hover white" href="/contribute#contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3>Related Projects</h3>
          <ul class="list pl0">
            <li><a class="link underline-hover white" href="https://ipfs.io">IPFS</a></li>
            <li><a class="link underline-hover white" href="https://filecoin.io">Filecoin</a></li>
            <li><a class="link underline-hover white" href="https://ipld.io">IPLD</a></li>
            <li><a class="link underline-hover white" href="https://libp2p.io">libp2p</a></li>
            <li><a class="link underline-hover white" href="https://multiformats.io">Multiformats</a></li>
          </ul>
        </div>
      </div>
      <div class="flex justify-between mw7 center">
        <p>© Protocol Labs | Except as <a class="link underline white" href="https://protocol.ai/legal/">noted</a>, content licensed <a class="link underline white" href="https://creativecommons.org/licenses/by/3.0/">CC-BY 3.0</a>.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import ProtoSchoolLogo from '../../static/images/ps_symbol_color.svg?inline'

export default {
  name: 'Footer',
  components: {
    ProtoSchoolLogo,
  }
}
</script>

<style scoped>
.header-title {
  font-size: 32px;
  text-decoration: none;
}
.header-slogan {
  font-size: 16px;
}

@media screen and (min-width: 620px) {
  .header-title {
    font-size: 40px;
  }
  .header-slogan {
    font-size: 20px;
  }
}

@media screen and (max-width: 498px) {
  .header-title {
    font-size: 24px;
  }
  .header-slogan {
    font-size: 12px;
  }
}
</style>
