export function ipfsObject (object) {
  return {
    ...object,
    cid: `CID('${object.cid.toString()}')`
  }
}
