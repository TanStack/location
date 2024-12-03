import * as React from 'react'
import { Link, createFileRoute, linkOptions } from '@tanstack/react-router'

export const Route = createFileRoute('/linkProps')({
  component: LinkPropsPage,
})

function LinkPropsPage() {
  const linkProps = linkOptions({
    to: '/absolute',
  })

  return <Link {...linkProps} />
}
