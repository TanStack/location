/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as testInitiallyLazyImport } from './routes/(test)/initiallyLazy'
import { Route as testInitiallyEmptyImport } from './routes/(test)/initiallyEmpty'
import { Route as testFooImport } from './routes/(test)/foo'

// Create Virtual Routes

const testBarLazyImport = createFileRoute('/(test)/bar')()

// Create/Update Routes

const testBarLazyRoute = testBarLazyImport
  .update({
    id: '/(test)/bar',
    path: '/bar',
    getParentRoute: () => rootRoute,
  } as any)
  .lazy(() => import('./routes/(test)/bar.lazy').then((d) => d.Route))

const testInitiallyLazyRoute = testInitiallyLazyImport.update({
  id: '/(test)/initiallyLazy',
  path: '/initiallyLazy',
  getParentRoute: () => rootRoute,
} as any)

const testInitiallyEmptyRoute = testInitiallyEmptyImport
  .update({
    id: '/(test)/initiallyEmpty',
    path: '/initiallyEmpty',
    getParentRoute: () => rootRoute,
  } as any)
  .lazy(() =>
    import('./routes/(test)/initiallyEmpty.lazy').then((d) => d.Route),
  )

const testFooRoute = testFooImport.update({
  id: '/(test)/foo',
  path: '/foo',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/(test)/foo': {
      id: '/(test)/foo'
      path: '/foo'
      fullPath: '/foo'
      preLoaderRoute: typeof testFooImport
      parentRoute: typeof rootRoute
    }
    '/(test)/initiallyEmpty': {
      id: '/(test)/initiallyEmpty'
      path: '/initiallyEmpty'
      fullPath: '/initiallyEmpty'
      preLoaderRoute: typeof testInitiallyEmptyImport
      parentRoute: typeof rootRoute
    }
    '/(test)/initiallyLazy': {
      id: '/(test)/initiallyLazy'
      path: '/initiallyLazy'
      fullPath: '/initiallyLazy'
      preLoaderRoute: typeof testInitiallyLazyImport
      parentRoute: typeof rootRoute
    }
    '/(test)/bar': {
      id: '/(test)/bar'
      path: '/bar'
      fullPath: '/bar'
      preLoaderRoute: typeof testBarLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/foo': typeof testFooRoute
  '/initiallyEmpty': typeof testInitiallyEmptyRoute
  '/initiallyLazy': typeof testInitiallyLazyRoute
  '/bar': typeof testBarLazyRoute
}

export interface FileRoutesByTo {
  '/foo': typeof testFooRoute
  '/initiallyEmpty': typeof testInitiallyEmptyRoute
  '/initiallyLazy': typeof testInitiallyLazyRoute
  '/bar': typeof testBarLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/(test)/foo': typeof testFooRoute
  '/(test)/initiallyEmpty': typeof testInitiallyEmptyRoute
  '/(test)/initiallyLazy': typeof testInitiallyLazyRoute
  '/(test)/bar': typeof testBarLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/foo' | '/initiallyEmpty' | '/initiallyLazy' | '/bar'
  fileRoutesByTo: FileRoutesByTo
  to: '/foo' | '/initiallyEmpty' | '/initiallyLazy' | '/bar'
  id:
    | '__root__'
    | '/(test)/foo'
    | '/(test)/initiallyEmpty'
    | '/(test)/initiallyLazy'
    | '/(test)/bar'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  testFooRoute: typeof testFooRoute
  testInitiallyEmptyRoute: typeof testInitiallyEmptyRoute
  testInitiallyLazyRoute: typeof testInitiallyLazyRoute
  testBarLazyRoute: typeof testBarLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  testFooRoute: testFooRoute,
  testInitiallyEmptyRoute: testInitiallyEmptyRoute,
  testInitiallyLazyRoute: testInitiallyLazyRoute,
  testBarLazyRoute: testBarLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/(test)/foo",
        "/(test)/initiallyEmpty",
        "/(test)/initiallyLazy",
        "/(test)/bar"
      ]
    },
    "/(test)/foo": {
      "filePath": "(test)/foo.tsx"
    },
    "/(test)/initiallyEmpty": {
      "filePath": "(test)/initiallyEmpty.tsx"
    },
    "/(test)/initiallyLazy": {
      "filePath": "(test)/initiallyLazy.tsx"
    },
    "/(test)/bar": {
      "filePath": "(test)/bar.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
