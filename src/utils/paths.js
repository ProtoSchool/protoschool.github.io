
export const deriveShortname = (path) =>
  path
    .split('/')[1]
    .split('-')
    .map(e => e.charAt(0).toUpperCase() + e.slice(1))
    .join(' ')
