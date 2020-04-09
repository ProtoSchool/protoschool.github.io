const SETTINGS_KEY_PREFIX = 'settings'

const FILTERS_KEY_PREFIX = 'filters'

function settingsKey (module, key) {
  return `${SETTINGS_KEY_PREFIX}/${module}/${key}`
}

const filters = {
  TUTORIALS: {
    SHOW_CODING: 'tutorials-show-coding'
  },
  set (key, value) {
    localStorage.setItem(settingsKey(FILTERS_KEY_PREFIX, key), value)
  },
  get (key) {
    return localStorage.getItem(settingsKey(FILTERS_KEY_PREFIX, key))
  }
}

export default {
  filters
}
