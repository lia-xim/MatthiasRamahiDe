import net from 'node:net'

function option(name, fallback) {
  const prefix = `--${name}=`
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) || process.env[name.toUpperCase().replaceAll('-', '_')] || fallback
}

const listenHost = option('listen-host', '0.0.0.0')
const listenPort = Number(option('listen-port', '4002'))
const targetHost = option('target-host', '::1')
const targetPort = Number(option('target-port', '4001'))

const server = net.createServer((client) => {
  const upstream = net.connect({ host: targetHost, port: targetPort }, () => {
    client.pipe(upstream)
    upstream.pipe(client)
  })

  const close = () => {
    client.destroy()
    upstream.destroy()
  }

  client.on('error', close)
  upstream.on('error', close)
})

server.listen(listenPort, listenHost, () => {
  console.log(`Tina GraphQL proxy listening on ${listenHost}:${listenPort} -> ${targetHost}:${targetPort}`)
})
