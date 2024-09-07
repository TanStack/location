/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as FooBarImport } from './routes/foo/bar'
import { Route as fooBarDetailsImport } from './routes/foo/bar/details'
import { Route as fooBarHomeImport } from './routes/foo/bar/home'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const FooBarRoute = FooBarImport.update({
  path: '/foo/bar',
  getParentRoute: () => rootRoute,
} as any)

const fooBarDetailsRoute = fooBarDetailsImport.update({
  path: '/$id',
  getParentRoute: () => FooBarRoute,
} as any)

const fooBarHomeRoute = fooBarHomeImport.update({
  path: '/',
  getParentRoute: () => FooBarRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/foo/bar': {
      id: '/foo/bar'
      path: '/foo/bar'
      fullPath: '/foo/bar'
      preLoaderRoute: typeof FooBarImport
      parentRoute: typeof rootRoute
    }
    '/foo/bar/': {
      id: '/foo/bar/'
      path: '/'
      fullPath: '/foo/bar/'
      preLoaderRoute: typeof fooBarHomeImport
      parentRoute: typeof FooBarImport
    }
    '/foo/bar/$id': {
      id: '/foo/bar/$id'
      path: '/$id'
      fullPath: '/foo/bar/$id'
      preLoaderRoute: typeof fooBarDetailsImport
      parentRoute: typeof FooBarImport
    }
  }
}

// Create and export the route tree

interface FooBarRouteChildren {
  fooBarHomeRoute: typeof fooBarHomeRoute
  fooBarDetailsRoute: typeof fooBarDetailsRoute
}

const FooBarRouteChildren: FooBarRouteChildren = {
  fooBarHomeRoute: fooBarHomeRoute,
  fooBarDetailsRoute: fooBarDetailsRoute,
}

const FooBarRouteWithChildren =
  FooBarRoute._addFileChildren(FooBarRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/foo/bar': typeof FooBarRouteWithChildren
  '/foo/bar/': typeof fooBarHomeRoute
  '/foo/bar/$id': typeof fooBarDetailsRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/foo/bar': typeof fooBarHomeRoute
  '/foo/bar/$id': typeof fooBarDetailsRoute
}

export interface FileRoutesById {
  '/': typeof IndexRoute
  '/foo/bar': typeof FooBarRouteWithChildren
  '/foo/bar/': typeof fooBarHomeRoute
  '/foo/bar/$id': typeof fooBarDetailsRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/foo/bar' | '/foo/bar/' | '/foo/bar/$id'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/foo/bar' | '/foo/bar/$id'
  id: '/' | '/foo/bar' | '/foo/bar/' | '/foo/bar/$id'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  FooBarRoute: typeof FooBarRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  FooBarRoute: FooBarRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/foo/bar"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/foo/bar": {
      "filePath": "foo/bar.tsx",
      "children": [
        "/foo/bar/",
        "/foo/bar/$id"
      ]
    },
    "/foo/bar/": {
      "filePath": "foo/bar/home.tsx",
      "parent": "/foo/bar"
    },
    "/foo/bar/$id": {
      "filePath": "foo/bar/details.tsx",
      "parent": "/foo/bar"
    }
  }
}
ROUTE_MANIFEST_END */
