import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { useApp } from '../app-context'
import { translateText, type Language } from '../i18n'

const textAttributes = ['placeholder', 'aria-label', 'ariaLabel', 'title', 'alt']

function localizeNode(node: ReactNode, language: Language): ReactNode {
  if (typeof node === 'string') return translateText(language, node)
  if (Array.isArray(node)) return node.map((child) => localizeNode(child, language))
  if (!isValidElement(node)) return node

  const element = node as ReactElement<Record<string, unknown>>
  const props = { ...element.props }
  for (const attribute of textAttributes) {
    const value = props[attribute]
    if (typeof value === 'string') props[attribute] = translateText(language, value)
  }

  if (props.children !== undefined) {
    props.children = localizeNode(props.children as ReactNode, language)
  }

  return cloneElement(element, props)
}

/**
 * Translates the rendered React tree of a page, including demo data strings.
 * It is intentionally placed inside pages so the page's evaluated children are visible.
 */
export function LocalizedPage({ children }: { children: ReactNode }) {
  const { language } = useApp()
  if (language === 'zh') return <>{children}</>
  return <>{localizeNode(children, language)}</>
}
