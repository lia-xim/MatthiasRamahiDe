const warnOnly = process.argv.includes('--warn')
const major = Number(process.versions.node.split('.')[0])

if (major === 22) {
  console.log(`Node ${process.versions.node} OK (project target: 22.x).`)
  process.exit(0)
}

const message = [
  `Node ${process.versions.node} is active, but this project targets Node 22.x.`,
  'Use a project-local version manager before install/start, for example `nvm use`, `fnm use`, `mise install && mise use`, or Volta/asdf with the checked-in pins.',
].join('\n')

if (warnOnly) {
  console.warn(message)
  process.exit(0)
}

console.error(message)
process.exit(1)
