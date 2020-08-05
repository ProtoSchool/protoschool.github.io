import * as prefixes from './prefixes'

// TODO: More documentation about what prefix / key / value / module mean in this context

function settingsKey (module, key) {
  return `${prefixes.SETTINGS_KEY_PREFIX}/${module}/${key}`
}

function encodeValue (value) {
  switch (typeof value) {
    case 'object':
      return JSON.stringify(value)
    default:
      return value
  }
}

function decodeValue (value) {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

export function set (prefix, key, value) {
  localStorage.setItem(settingsKey(prefix, key), value)
}

export function get (prefix, key) {
  return localStorage.getItem(settingsKey(prefix, key))
}

export function makeOperations (prefix) {
  return {
    set (key, value) {
      set(prefix, key, encodeValue(value))
    },
    get (key) {
      return decodeValue(get(prefix, key))
    }
  }
}
