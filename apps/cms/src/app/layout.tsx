import type { ReactNode } from 'react'
import type { ServerFunctionClient } from 'payload'

import '@payloadcms/next/css'
import config from '@payload-config'
import { handleServerFunctions, RootLayout as PayloadRootLayout } from '@payloadcms/next/layouts'
import { importMap } from './(payload)/admin/importMap'

type RootLayoutProps = {
  children: ReactNode
}

const serverFunction: ServerFunctionClient = async (args) => {
  'use server'

  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <PayloadRootLayout
      config={config}
      htmlProps={{ lang: 'de' }}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </PayloadRootLayout>
  )
}
