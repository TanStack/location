import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createReactRouter,
  createRouteConfig,
  Link,
  useMatch,
} from '@tanstack/react-router'
import { AppRouter } from '../server/server'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

const rootRoute = createRouteConfig({
  component: () => {
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
            to="/posts"
            activeProps={{
              className: 'font-bold',
            }}
          >
            Posts
          </Link>
        </div>
        <hr />
        <Outlet /> {/* Start rendering router matches */}
        <TanStackRouterDevtools position="bottom-left" />
      </>
    )
  },
})

const indexRoute = rootRoute.createRoute({
  path: '/',
  component: () => {
    const hello = trpc.hello.useQuery()
    if (!hello.data) return <p>{'Loading...'}</p>
    return <div className="p-2 text-xl">{hello.data}</div>
  },
})

const postsRoute = rootRoute.createRoute({
  path: 'posts',
  loaderMaxAge: 0,
  errorComponent: () => 'Oh crap!',
  loader: async () => {
    // TODO: Prefetch posts using tRPC
    return {}
  },
  component: () => {
    const postsQuery = trpc.posts.useQuery()

    return (
      <div className="p-2 flex gap-2">
        <ul className="list-disc pl-4">
          {postsQuery.data?.map((post) => {
            return (
              <li key={post.id} className="whitespace-nowrap">
                <Link
                  to={postRoute.id}
                  params={{
                    postId: post.id,
                  }}
                  className="block py-1 text-blue-800 hover:text-blue-600"
                  activeProps={{ className: 'text-black font-bold' }}
                >
                  <div>{post.title.substring(0, 20)}</div>
                </Link>
              </li>
            )
          })}
        </ul>
        <hr />
        <Outlet />
      </div>
    )
  },
})

const postsIndexRoute = postsRoute.createRoute({
  path: '/',
  component: () => {
    return (
      <>
        <div>Select a post.</div>
      </>
    )
  },
})

const postRoute = postsRoute.createRoute({
  path: '$postId',
  loader: async ({ params: { postId } }) => {
    // TODO: Prefetch post using tRPC
    return {}
  },
  component: () => {
    const { params } = useMatch(postRoute.id)
    const postQuery = trpc.post.useQuery(params.postId)

    return (
      <div className="space-y-2">
        <h4 className="text-xl font-bold underline">{postQuery.data?.title}</h4>
      </div>
    )
  },
})

const routeConfig = rootRoute.addChildren([
  indexRoute,
  postsRoute.addChildren([postsIndexRoute, postRoute]),
])

// Set up a ReactRouter instance
const router = createReactRouter({
  routeConfig,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface RegisterRouter {
    router: typeof router
  }
}

export const trpc = createTRPCReact<AppRouter>({})

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:4000',
      // optional
      headers() {
        return {
          // authorization: getAuthCookie(),
        }
      },
    }),
  ],
})

function App() {
  return (
    // Build our routes and render our router
    <>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools
            initialIsOpen
            position="bottom-left"
            toggleButtonProps={{
              style: {
                marginLeft: '5.5rem',
                transform: `scale(.7)`,
                transformOrigin: 'bottom left',
              },
            }}
          />
        </QueryClientProvider>
      </trpc.Provider>
    </>
  )
}

const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
