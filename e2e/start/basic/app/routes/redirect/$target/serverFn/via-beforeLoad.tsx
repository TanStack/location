import { createFileRoute } from '@tanstack/react-router'
import { throwRedirect } from '~/components/throwRedirect'

export const Route = createFileRoute(
  '/redirect/$target/serverFn/via-beforeLoad',
)({
  beforeLoad: ({ params: { target }, search: { reloadDocument } }) =>
    throwRedirect({ data: { target, reloadDocument } }),
  component: () => <div>{Route.fullPath}</div>,
})
