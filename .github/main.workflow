workflow "Build and pin to IPFS" {
  on = "push"
  resolves = ["Pin to IPFS Cluster"]
}

action "Build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  runs = "/bin/bash -c \"npm ci && npm run build\""
}

action "Pin to IPFS Cluster" {
  uses = "ipfs-shipyard/ipfs-github-action@master"
  needs = ["Build"]
  secrets = ["GITHUB_TOKEN", "CLUSTER_USER", "CLUSTER_PASSWORD"]
  args = "/github/workspace/dist"
}
