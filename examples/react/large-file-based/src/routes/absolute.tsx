import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/absolute')({
  component: PostDeepComponent,
})

function PostDeepComponent() {
  return (
    <div className="p-2 space-y-2">
      <Link
        to="/absolute"
        className="block py-1 text-blue-800 hover:text-blue-600"
      >
        Absolute
      </Link>
    </div>
  )
}
