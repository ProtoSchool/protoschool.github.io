export const isProduction = typeof window !== 'undefined' && window &&
  window.location.hostname === 'proto.school'
