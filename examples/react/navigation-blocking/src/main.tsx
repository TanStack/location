import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  Link,
  createRouter,
  useBlocker,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const rootRoute = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{' '}
        <Link
          to={'/editor-1'}
          activeProps={{
            className: 'font-bold',
          }}
        >
          Editor 1
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
})

function IndexComponent() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  )
}

const editor1Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'editor-1',
  component: Editor1Component,
})

function Editor1Component() {
  const [value, setValue] = React.useState('')

  useBlocker(
    () => window.confirm('Are you sure you want to leave editor 1?'),
    value,
  )

  return (
    <div className="p-2">
      <h3>Editor 1</h3>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border"
      />
      <hr className="m-2" />
      <Link to="/editor-1/editor-2">Go to Editor 2</Link>
      <Outlet />
    </div>
  )
}

const editor2Route = createRoute({
  getParentRoute: () => editor1Route,
  path: 'editor-2',
  component: Editor2Component,
})

function Editor2Component() {
  const [value, setValue] = React.useState('')

  useBlocker(
    () => window.confirm('Are you sure you want to leave editor 2?'),
    value,
  )

  return (
    <div className="p-2">
      <h3>Editor 2</h3>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border"
      />
    </div>
  )
}

const routeTree = rootRoute.addChildren([
  indexRoute,
  editor1Route.addChildren([editor2Route]),
])

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(<RouterProvider router={router} />)
}
