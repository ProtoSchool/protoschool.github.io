<template>
  <div>
    <footer class="bg-navy white pv3">
      <div class="flex justify-between mw7 center">
        <div>
          <h3>Put Logo Here</h3>
        </div>
        <div>
          <h3>Courses</h3>
          <ul class="list pl0">
            <li>IPFS</li>
            <li>Filecoin</li>
            <li>IPLD</li>
            <li>Multiformats</li>
          </ul>
        </div>
        <div>
          <h3>Community</h3>
          <ul class="list pl0">
            <li>GitHub</li>
            <li>Twitter</li>
            <li>Newsletter</li>
            <li>Contribute</li>
          </ul>
        </div>

        <div>
          <h3>Related Projects</h3>
          <ul class="list pl0">
            <li>IPFS</li>
            <li>Filecoin</li>
            <li>IPLD</li>
            <li>libp2p</li>
            <li>Multiformats</li>
          </ul>
        </div>
      </div>
      <div class="flex justify-between mw7 center">
        <p>© Protocol Labs | Except as <a href="https://protocol.ai/legal/">noted</a>, content licensed <a href="https://creativecommons.org/licenses/by/3.0/">CC-BY 3.0</a>.</p>
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
