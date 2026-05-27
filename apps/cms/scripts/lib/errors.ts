const messagesFromError = (error: unknown) => {
  const messages: string[] = []
  let current: unknown = error

  while (current && typeof current === 'object') {
    const message = (current as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) messages.push(message.trim())
    current = (current as { cause?: unknown }).cause
  }

  if (messages.length === 0 && error) messages.push(String(error))
  return messages
}

export const printPayloadScriptError = (error: unknown, context: string) => {
  const messages = messagesFromError(error)
  const schemaMessage = messages.find((message) => /SQLITE_ERROR|no such column|already exists|relation .* does not exist/i.test(message))

  if (schemaMessage) {
    console.error(`${context} konnte nicht abgeschlossen werden, weil CMS-Code und Datenbankschema nicht zusammenpassen.`)
    console.error('Fuehre zuerst die Payload-Migrationen bzw. den Schema-Sync fuer die Zielumgebung aus.')
    console.error('Lokal zum Testen: PAYLOAD_DB_PUSH=true mit einer frischen SQLite-Datei oder eine passende Migration gegen die bestehende DB.')
    console.error(`Details: ${schemaMessage.slice(0, 500)}`)
    return
  }

  console.error(error)
}
