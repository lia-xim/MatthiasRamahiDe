import { getPayload } from 'payload'

import config from '../src/payload.config'

const email = process.env.PAYLOAD_ADMIN_EMAIL
const password = process.env.PAYLOAD_ADMIN_PASSWORD
const name = process.env.PAYLOAD_ADMIN_NAME || 'Matthias Ramahi'

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
  const updated = await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      name,
      password,
      enableAPIKey: true,
    },
    overrideAccess: true,
  })

  console.log(JSON.stringify({ created: false, email: updated.email, passwordReset: true }))
  process.exit(0)
}

const created = await payload.create({
  collection: 'users',
  data: {
    email,
    password,
    name,
    enableAPIKey: true,
  },
  overrideAccess: true,
})

console.log(JSON.stringify({ created: true, email: created.email, passwordReset: true }))
process.exit(0)
