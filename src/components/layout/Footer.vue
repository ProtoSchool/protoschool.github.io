<template>
  <footer :class="`bg-navy white pt5-m pt5-l pt4 pb2 ${noTopMargin ? '':'footer-margin'}`"
    data-cy="footer-component"
  >
    <div class="flex mw7 ph3 center flex-wrap"> <!-- logo & columns -->
      <div  class="w-33-l w-100 mb0-l mb3">
        <router-link to="/" class="flex items-center link">
          <ProtoSchoolLogo alt="ProtoSchool" class="w2 mr2 "/>
          <div class="ma0 fw4 white f3">
            <span class="montserrat fw4">Proto</span>
            <span class="montserrat fw2">School</span>
          </div>
        </router-link>
      </div>
      <div v-for="column in processedColumns" :key="column.title" class="w-20-l w-25-m w-33 column ">
        <span class="fw7">{{column.title}}</span>
        <ul class="list pl0">
          <li v-for="(link, index) in column.links" :key="index" class="pv1">
            <a class="link underline-hover white o-80 glow"
              :target="link.external ? '_blank' : ''"
              :data-cy="link.external ? 'footer-link-external' : 'footer-link-internal'"
              :href="link.url">{{link.text}}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex justify-start mt4 mw7 center ph3 f7 o-70"> <!-- fake element plus copyright -->
      <div class="w-33-l">
      </div>
      <p>© <a class="link underline white o-80 glow" target="_blank" href="https://protocol.ai">Protocol Labs</a> | {{translations.copyright._1}} <a class="link underline white o-80 glow" target="_blank" href="https://protocol.ai/legal/">{{translations.copyright._2}}</a>{{translations.copyright._3}} <a class="link underline white o-80 glow" target="_blank" :href="translations.copyright.licenseURL" >CC-BY 3.0</a>{{translations.copyright._4}}</p>
    </div>
  </footer>
</template>

<script>
import ProtoSchoolLogo from '../../static/images/ps_symbol_color.svg?inline'
import translations from '../../static/translations'
import projects from '../../static/projects.json'

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
    },
    processedColumns: function () {
      return translations.footer.columns.map(column => ({
        ...column,
        links: column.links.map(link => {
          let text = link.text // text or undefined
          let url = link.url // url or underfined

          // Fill in course and project link data automatically
          if (column.type === 'courses' || column.type === 'projects') {
            let project = projects.find(project => project.id === link)

            text = project.name
            url = (column.type === 'courses') ? `/course/${link}` : project.url
          }

          return { text, url, external: !url.startsWith('/') }
        })
      }))
    }
  }
}
</script>
<style scoped>
.column {
  margin-top: 0.7rem;
}
.footer-margin {
  margin-top: 6rem;
}

@media (max-width: 30rem) {
  .footer-margin {
    margin-top: 3rem;
  }
}
</style>
