/* eslint-disable no-console */

import { unixfs } from '@helia/unixfs'
import { createHelia } from 'helia'
import { ref } from 'vue'

export const HeliaProviderPlugin = {
  install: async (app) => {
    const loading = ref(true)
    const error = ref('')
    const helia = ref()
    const fs = ref()
    app.provide('HeliaProvider', {
      loading,
      error,
      helia,
      fs
    })
    try {
      const instance = await createHelia()
      loading.value = false
      helia.value = instance
      fs.value = unixfs(instance)
    } catch (e) {
      console.error(e)
      error.value = e.toString()
      loading.value = false
    }
  }
}
