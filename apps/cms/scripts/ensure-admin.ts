import { randomBytes } from 'node:crypto'

import { getPayload } from 'payload'

import config from '../src/payload.config'

const email = process.env.PAYLOAD_ADMIN_EMAIL
const password = process.env.PAYLOAD_ADMIN_PASSWORD
const name = process.env.PAYLOAD_ADMIN_NAME || 'Matthias Ramahi'
const configuredApiKey = process.env.PAYLOAD_ADMIN_API_KEY

function newApiKey() {
  return configuredApiKey || randomBytes(32).toString('hex')
}

if (!email || !password) {
  throw new Error('PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD are required.')
}

const payload = await getPayload({ config })
const existing = await payload.find({
  collection: 'users',
  limit: 1,
  where: {
    email: {
      equals: email,
    },
  },
})

if (existing.totalDocs > 0) {
  const user = existing.docs[0]
  const apiKey = user.apiKey || newApiKey()
  const updated = await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      apiKey,
      enableAPIKey: true,
      name,
    },
    overrideAccess: true,
  })
  console.log(JSON.stringify({ created: false, email: updated.email, apiKey }))
  process.exit(0)
}

const apiKey = newApiKey()
const created = await payload.create({
  collection: 'users',
  data: {
    apiKey,
    email,
    password,
    name,
    enableAPIKey: true,
  },
  overrideAccess: true,
})

console.log(JSON.stringify({ created: true, email: created.email, apiKey }))
process.exit(0)
