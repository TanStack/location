import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  Link,
  Route,
  ErrorComponent,
  RouterContext,
  Router,
} from '@tanstack/router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import axios from 'axios'
import {
  LoaderClient,
  Loader,
  LoaderClientProvider,
  useLoaderInstance,
  createLoaderOptions,
  typedClient,
} from '@tanstack/react-loaders'

type PostType = {
  id: string
  title: string
  body: string
}

const fetchPosts = async () => {
  console.log('Fetching posts...')
  await new Promise((r) => setTimeout(r, 500))
  return axios
    .get<PostType[]>('https://jsonplaceholder.typicode.com/posts')
    .then((r) => r.data.slice(0, 10))
}

const fetchPost = async (postId: string) => {
  console.log(`Fetching post with id ${postId}...`)
  await new Promise((r) => setTimeout(r, 500))
  const post = await axios
    .get<PostType>(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then((r) => r.data)

  if (!post) {
    throw new NotFoundError(`Post with id "${postId}" not found!`)
  }

  return post
}

const postsLoader = new Loader({
  key: 'posts',
  fn: fetchPosts,
})

const postLoader = new Loader({
  key: 'post',
  fn: fetchPost,
  onInvalidate: ({ client }) => {
    typedClient(client).invalidateLoader({ key: 'posts' })
  },
})

const loaderClient = new LoaderClient({
  loaders: [postsLoader, postLoader],
})

declare module '@tanstack/react-loaders' {
  interface Register {
    loaderClient: typeof loaderClient
  }
}

const routerContext = new RouterContext<{
  loaderClient: typeof loaderClient
}>()

const rootRoute = routerContext.createRootRoute({
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
            to={'/posts'}
            activeProps={{
              className: 'font-bold',
            }}
          >
            Posts
          </Link>
        </div>
        <hr />
        <Outlet />
        {/* Start rendering router matches */}
        <TanStackRouterDevtools position="bottom-right" />
      </>
    )
  },
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    )
  },
})

const postsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'posts',
  loader: async ({ context: { loaderClient } }) => {
    await loaderClient.load({ key: 'posts' })
    return () => useLoaderInstance({ key: 'posts' })
  },
  component: ({ useLoader }) => {
    const { data: posts } = useLoader()()

    return (
      <div className="p-2 flex gap-2">
        <ul className="list-disc pl-4">
          {[
            ...posts,
            { id: 'i-do-not-exist', title: 'Non-existent Post' },
          ]?.map((post) => {
            return (
              <li key={post.id} className="whitespace-nowrap">
                <Link
                  to={postRoute.to}
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

const postsIndexRoute = new Route({
  getParentRoute: () => postsRoute,
  path: '/',
  component: () => <div>Select a post.</div>,
})

class NotFoundError extends Error {}

const postRoute = new Route({
  getParentRoute: () => postsRoute,
  path: '$postId',
  loader: async ({ context: { loaderClient }, params: { postId } }) => {
    const loaderOptions = createLoaderOptions({
      key: 'post',
      variables: postId,
    })

    await loaderClient.load(loaderOptions)

    // Return a curried hook!
    return () => useLoaderInstance(loaderOptions)
  },
  errorComponent: ({ error }) => {
    if (error instanceof NotFoundError) {
      return <div>{error.message}</div>
    }

    return <ErrorComponent error={error} />
  },
  component: () => {
    const { data: post } = postRoute.useLoader()()

    return (
      <div className="space-y-2">
        <h4 className="text-xl font-bold underline">{post.title}</h4>
        <div className="text-sm">{post.body}</div>
      </div>
    )
  },
})

const routeTree = rootRoute.addChildren([
  postsRoute.addChildren([postRoute, postsIndexRoute]),
  indexRoute,
])

// Set up a Router instance
const router = new Router({
  routeTree,
  defaultPreload: 'intent',
  context: {
    loaderClient,
  },
})

// Register things for typesafety
declare module '@tanstack/router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    // <React.StrictMode>
    <LoaderClientProvider client={loaderClient}>
      <RouterProvider router={router} />
    </LoaderClientProvider>,
    // </React.StrictMode>,
  )
}
