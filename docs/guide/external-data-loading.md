---
id: external-data-loading
title: External Data Loading
---

> ⚠️ This guide is geared towards external state management libraries and their integration with TanStack Router for data fetching, ssr, hydration/dehydration and streaming. If you haven't read the standard [Data Loading](./data-loading) guide

## To **Store** or to **Coordinate**?

While Router is very capable of storing and managing your data needs out of the box, sometimes you just might want something different!

Router is also designed to be a **coordinator** for external data fetching and caching libraries. This means that you can use any data fetching/caching library you want, and the router will coordinate the loading of your data in a way that aligns with your users' navigation.

## What data fetching libraries are supported?

Any data fetching library that supports asynchronous dependencies can be used with TanStack Router. This includes:

- [TanStack Loaders](#tanstack-loaders)
- [TanStack Query](https://tanstack.com/query/latest/docs/react/overview)
- [SWR](https://swr.vercel.app/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [urql](https://formidable.com/open-source/urql/)
- [Relay](https://relay.dev/)
- [Apollo](https://www.apollographql.com/docs/react/)

Or, even...

- [Zustand](https://zustand-demo.pmnd.rs/)
- [Jotai](https://jotai.org/)
- [Recoil](https://recoiljs.org/)
- [Redux](https://redux.js.org/)

Literally any library that **can return a promise and read/write data** can be integrated.

## TanStack Loaders

While you may jump for joy that your favorite cache manager is in the list above, you may want to check out our custom-built router-centric caching library called [TanStack Loaders](https://tanstack.com/loaders/latest/docs/overview), a powerful and flexible data caching library that is designed to work with TanStack Router.

## External Data Loading Basics

For the following examples, we'll show you the basics of using an external data loading library like **TanStack Loaders**, but as we've already mentioned, these same principles can be applied to any state management library worth it's salt. Let's get started!

## Using Loaders to Ensure Data is Loaded

The easiest way to use integrate and external caching/data library into Router is to use `route.loader`s to ensure that the data required inside of a route has been loaded and is ready to be displayed.

> ⚠️ BUT WHY? It's very important to preload your critical render data in the loader for a few reasons:
>
> - No "flash of loading" states
> - No waterfall data fetching, caused by component based fetching
> - Better for SEO. If you data is available at render time, it will be indexed by search engines.

Here is a simple example of using a Route `loader` to seed the cache for TanStack Loaders:

```tsx
import { Route } from '@tanstack/react-router'
import { Loader, useLoader } from '@tanstack/react-loaders'

// Create a new loader
const postsLoader = new Loader({
  key: 'posts',
  fn: async (params) => {
    const res = await fetch(`/api/posts`)
    if (!res.ok) throw new Error('Failed to fetch posts')
    return res.json()
  },
})

// Create a new loader client
const loaderClient = new LoaderClient({
  loaders: [postsLoader],
})

const postsRoute = new Route({
  getParentPath: () => rootRoute,
  path: 'posts',
  loader: async () => {
    // Ensure our loader is loaded with an "await"
    await loaderClient.load({ key: 'posts' })
  },
  component: ({ useLoader }) => {
    const { data: posts } = useLoaderInstance({ key: 'posts' })

    return <div>...</div>
  },
})
```

> 🧠 TanStack Loaders uses the `preload` flag to determine cache freshness vs non-preload calls and also to determine if the global `isLoading` or `isPrefetching` flags should be incremented or not.

## SSR Dehydration/Hydration

Tools that are able can integrate with TanStack Router's convenient Dehydration/Hydration APIs to shuttle dehydrated data between the server and client and rehydrate it where needed. Let's go over how to do this with both 3rd party critical data and 3rd party deferred data.

## Critical Dehydration/Hydration

**For critical data needed for the first render/paint**, TanStack Router supports **`dehydrate` and `hydrate`** options when configuration the `Router`. These callbacks are functions that are automatically called on the server and client when the router dehydrates and hydrates normally and allow you to augment the dehydrated data with your own data.

The `dehydrate` function can return any serializable JSON data which will get merged and injected into the dehydrated payload that is sent to the client. This payload is delivered via the `DehydrateRouter` component which, when rendered, provides the data back to you in the `hydrate` function on the client.

For example, let's dehydrate and hydrate a `LoaderClient` instance from `@tanstack/react-loaders` so that our loader data we fetched on the server in our router loaders will be available for hydration on the client.

```tsx
// src/router.tsx

export function createRouter() {
  // Make sure you create your loader client or similar data
  // stores inside of your `createRouter` function. This ensures
  // that your data stores are unique to each request and
  // always present on both server and client.
  const loaderClient = createLoaderClient()

  return new Router({
    routeTree,
    // Optionally provide your loaderClient to the router context for
    // convenience (you can provide anything you want to the router
    // context!)
    context: {
      loaderClient,
    },
    // On the server, dehydrate the loader client and return it
    // to the router to get injected into `<DehydrateRouter />`
    dehydrate: () => {
      return {
        loaderClient: loaderClient.dehydrate(),
      }
    },
    // On the client, hydrate the loader client with the data
    // we dehydrated on the server
    hydrate: (dehydrated) => {
      loaderClient.hydrate(dehydrated.loaderClient)
    },
    // Optionally, we can use `Wrap` to wrap our router in the loader client provider
    Wrap: ({ children }) => {
      return (
        <LoaderClientProvider client={loaderClient}>
          {children}
        </LoaderClientProvider>
      )
    },
  })
}
```

### 3rd Party Streaming with `transformStreamWithRouter`

- The `router.injectHtml` function
  - e.g. `router.injectHtml(() => '<script>console.log("Hello World!")</script>')`
  - This function can be called multiple times during rendering to inject arbitrary HTML markup into the stream.
  - Use it to inject things like `<script>` tags, `<style>` tags, or any other arbitrary HTML markup.
  - 🧠 Make sure you inject your HTML right after a successfully rendered Suspense boundary to ensure that the HTML is injected at the right time.
- The `router.dehydrateData` function
  - e.g. `router.dehydrateData('foo', () => ({ bar: 'baz' }))`
  - This function is a higher-level abstraction around `router.injectHtml`, designed for injecting JSON under a specific key. It can be called multiple times during rendering to inject arbitrary JSON data into the stream under a specific key which can be retrieved later on the client using the `router.hydrateData` function.
  - Use it to inject things like dehydrated data for your application.
  - 🧠 Make sure you inject your data right after a successfully rendered Suspense boundary to ensure that the data is injected in unison with the corresponding markup that requires it in the stream.
- The `router.hydrateData` function
  - e.g. `router.hydrateData('foo')`
  - This function is a companion to `router.dehydrateData`, designed for retrieving JSON data that was injected into the stream using `router.dehydrateData`.
  - Use it to retrieve things like dehydrated data for your application.
  - 🧠 Make sure you retrieve your data as early as possible on the client to ensure that it is available for hydration when your application renders.

Let's take a look at an example of how to use these utilities to stream a TanStack Router application.

### Injecting HTML

Now that we have a stream that is being transformed by our router, we can inject arbitrary HTML markup into the stream using the `router.injectHtml` function.

```tsx
function Test() {
  const router = useRouter()
  router.injectHtml(() => '<script>console.log("Hello World!")</script>')
  return null
}
```

### Dehydrating and Hydrating Data

Injecting HTML is pretty low-level, so let's use the `router.dehydrateData` and `router.hydrateData` functions to inject and retrieve some JSON data instead.

```tsx
function Custom() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Inner />
    </Suspense>
  )
}

let testCache: string

function Test() {
  const router = useRouter()

  // Attempt to rehydrate our data on the client
  // On the server, this is a no=op and
  // will return undefined
  const data = router.hydrateData('testCache')

  // Suspend and load our fake data
  if (!testCache) {
    throw new Promise((resolve) => {
      setTimeout(() => {
        testCache = Date.now()
        resolve()
      }, 1000)
    })
  }

  // Dehydrate our data on the server so it can
  // be rehydrated on the client
  router.dehydrateData('testCache', testCache)

  return data
}
```

### Providing Dehydration/Hydration utilities to external tools

The `router.dehydrateData` and `router.hydrateData` functions are designed to be used by external tools to dehydrate and hydrate data. For example, the `@tanstack/react-loaders` package can use generic `dehydrate`/`hydrate` options to dehydrate and hydrate each loader as it is fetched on the server and rendered on the client:

```tsx
// src/router.tsx

export function createRouter() {
  const loaderClient = createLoaderClient()

  const router = new Router({
    ...
  })

  // Provide hydration and dehydration functions to loader instances
  loaderClient.options = {
    ...loaderClient.options,
    hydrateLoaderInstanceFn: (instance) =>
      router.hydrateData(instance.hashedKey),
    dehydrateLoaderInstanceFn: (instance) =>
      router.dehydrateData(instance.hashedKey, () => instance),
  }

  return router
}
```

This allows the loader client to automatically dehydrate and hydrate each loader instance as it is fetched on the server and rendered on the client, leaving your application code free of any boilerplate or knowledge of the hydration/dehydration process:

```tsx
// src/components/MyComponent.tsx

import * as React from 'react'
import { Loader } from '@tanstack/react-loaders'

const testLoader = new Loader({
  key: 'test',
  fn: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return 'Hello World!'
  },
})

export function Test() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Inner />
    </Suspense>
  )
}

export function Inner() {
  const instance = useLoaderInstance({ key: 'test' })

  return instance.data
}
```
