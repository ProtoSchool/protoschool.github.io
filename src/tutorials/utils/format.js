/*
  Format an IPFS object. Changes applied ATM:

  - `cid`: convert the cid object into a string representation
*/
export function ipfsObject (object) {
  return {
    ...object,
    cid: `CID('${object.cid.toString()}')`
  }
}
