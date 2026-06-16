/** @jsxImportSource react */
import * as React from 'react'
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react'

// Keep React in scope for direct TSX execution outside Astro's JSX transform.
void React

type ElementProps<T extends keyof JSX.IntrinsicElements> = ComponentPropsWithoutRef<T> & {
  children?: ReactNode
}

type TableProps = {
  children?: ReactNode
  style?: CSSProperties
}

export function Html({ children, ...props }: ElementProps<'html'>) {
  return <html {...props}>{children}</html>
}

export function Head({ children, ...props }: ElementProps<'head'>) {
  return <head {...props}>{children}</head>
}

export function Preview({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        display: 'none',
        overflow: 'hidden',
        maxHeight: 0,
        maxWidth: 0,
        opacity: 0,
      }}
    >
      {children}
    </div>
  )
}

export function Body({ children, ...props }: ElementProps<'body'>) {
  return <body {...props}>{children}</body>
}

export function Section({ children, style }: TableProps) {
  return (
    <table align="center" width="100%" border={0} cellPadding={0} cellSpacing={0} role="presentation" style={style}>
      <tbody>
        <tr>
          <td>{children}</td>
        </tr>
      </tbody>
    </table>
  )
}

export function Container({ children, style }: TableProps) {
  return (
    <table align="center" width="100%" border={0} cellPadding={0} cellSpacing={0} role="presentation" style={style}>
      <tbody>
        <tr>
          <td>{children}</td>
        </tr>
      </tbody>
    </table>
  )
}

export function Row({ children, style }: TableProps) {
  return (
    <table align="center" width="100%" border={0} cellPadding={0} cellSpacing={0} role="presentation" style={style}>
      <tbody>
        <tr>{children}</tr>
      </tbody>
    </table>
  )
}

export function Column({ children, style }: TableProps) {
  return <td style={style}>{children}</td>
}

export function Text({ children, ...props }: ElementProps<'p'>) {
  return <p {...props}>{children}</p>
}

export function Link({ children, ...props }: ElementProps<'a'>) {
  return <a {...props}>{children}</a>
}

export function Heading({ children, ...props }: ElementProps<'h1'>) {
  return <h1 {...props}>{children}</h1>
}

export function Hr(props: ElementProps<'hr'>) {
  return <hr {...props} />
}
