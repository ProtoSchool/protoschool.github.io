/*
  Settings module

  Saves the settings in localStorage with the prefix `settings/`.
  Further settings modules (like filters) should also add a prefix
  and use constants.

  Examples:

  `settings/filters/*`
  `settings/newsletters/*`
  `settings/cookies/*`
 */

const SETTINGS_KEY_PREFIX = 'settings'

const FILTERS_KEY_PREFIX = 'filters'
const NEWSLETTER_KEY_PREFIX = 'newsletter'

function settingsKey (module, key) {
  return `${SETTINGS_KEY_PREFIX}/${module}/${key}`
}

function set (prefix, key, value) {
  localStorage.setItem(settingsKey(prefix, key), value)
}

function get (prefix, key) {
  return localStorage.getItem(settingsKey(prefix, key))
}

function makeOperations (prefix) {
  return {
    set (key, value) {
      set(prefix, key, value)
    },
    get (key) {
      return get(prefix, key)
    }
  }
}

const filters = {
  TUTORIALS: {
    SHOW_CODING: 'tutorials-show-coding'
  },
  ...makeOperations(FILTERS_KEY_PREFIX)
}

const newsletters = {
  PROTOSCHOOL: 'protoschool',
  ...makeOperations(NEWSLETTER_KEY_PREFIX)
}

export default {
  filters,
  newsletters
}
