workflow "Publish to IPFS" {
  resolves = ["pin to cluster"]
  on = "push"
}

action "npm install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "ci"
}

action "npm run build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "run build"
  needs = ["npm install"]
}

action "pin to cluster" {
  uses = "ipfs-shipyard/ipfs-github-action@master"
  secrets = ["GITHUB_TOKEN", "CLUSTER_USER", "CLUSTER_PASSWORD"]
  args = "/github/workspace/dist"
  needs = ["npm run build"]
}
