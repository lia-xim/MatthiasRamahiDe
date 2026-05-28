const envValue = (name: string) => {
  const importMetaValue = (import.meta.env as Record<string, string | undefined>)[name]
  return importMetaValue ?? process.env[name]
}

export const envFlag = (name: string, defaultValue = false) => {
  const value = envValue(name)
  if (typeof value === 'undefined') return defaultValue
  return value === 'true'
}

export const envFlagNotFalse = (name: string) => envValue(name) !== 'false'
