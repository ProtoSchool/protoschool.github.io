workflow "Build and pin to IPFS" {
  on = "push"
  resolves = ["Pin to IPFS Cluster"]
}

action "Install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "ci"
}

action "Build site" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "run build"
  needs = ["Install"]
}

action "Pin to IPFS Cluster" {
  uses = "ipfs-shipyard/ipfs-github-action@master"
  secrets = ["GITHUB_TOKEN", "CLUSTER_USER", "CLUSTER_PASSWORD"]
  args = "/github/workspace/dist"
  needs = ["Build site"]
}
