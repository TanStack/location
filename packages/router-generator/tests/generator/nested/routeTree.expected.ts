/* prettier-ignore-start */

/* eslint-disable */

// biome-ignore

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PostsRouteImport } from './routes/posts/route'
import { Route as BlogRouteImport } from './routes/blog/route'
import { Route as IndexImport } from './routes/index'
import { Route as PostsIndexImport } from './routes/posts/index'
import { Route as BlogIndexImport } from './routes/blog/index'
import { Route as BlogStatsImport } from './routes/blog_/stats'
import { Route as BlogSlugImport } from './routes/blog/$slug'
import { Route as PostsPostIdIndexImport } from './routes/posts/$postId/index'
import { Route as PostsPostIdDeepImport } from './routes/posts/$postId/deep'

// Create/Update Routes

const PostsRouteRoute = PostsRouteImport.update({
  path: '/posts',
  getParentRoute: () => rootRoute,
} as any)

const BlogRouteRoute = BlogRouteImport.update({
  path: '/blog',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PostsIndexRoute = PostsIndexImport.update({
  path: '/',
  getParentRoute: () => PostsRouteRoute,
} as any)

const BlogIndexRoute = BlogIndexImport.update({
  path: '/',
  getParentRoute: () => BlogRouteRoute,
} as any)

const BlogStatsRoute = BlogStatsImport.update({
  path: '/blog/stats',
  getParentRoute: () => rootRoute,
} as any)

const BlogSlugRoute = BlogSlugImport.update({
  path: '/$slug',
  getParentRoute: () => BlogRouteRoute,
} as any)

const PostsPostIdIndexRoute = PostsPostIdIndexImport.update({
  path: '/$postId/',
  getParentRoute: () => PostsRouteRoute,
} as any)

const PostsPostIdDeepRoute = PostsPostIdDeepImport.update({
  path: '/$postId/deep',
  getParentRoute: () => PostsRouteRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/blog': {
      preLoaderRoute: typeof BlogRouteImport
      parentRoute: typeof rootRoute
    }
    '/posts': {
      preLoaderRoute: typeof PostsRouteImport
      parentRoute: typeof rootRoute
    }
    '/blog/$slug': {
      preLoaderRoute: typeof BlogSlugImport
      parentRoute: typeof BlogRouteImport
    }
    '/blog/stats': {
      preLoaderRoute: typeof BlogStatsImport
      parentRoute: typeof rootRoute
    }
    '/blog/': {
      preLoaderRoute: typeof BlogIndexImport
      parentRoute: typeof BlogRouteImport
    }
    '/posts/': {
      preLoaderRoute: typeof PostsIndexImport
      parentRoute: typeof PostsRouteImport
    }
    '/posts/$postId/deep': {
      preLoaderRoute: typeof PostsPostIdDeepImport
      parentRoute: typeof PostsRouteImport
    }
    '/posts/$postId/': {
      preLoaderRoute: typeof PostsPostIdIndexImport
      parentRoute: typeof PostsRouteImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  BlogRouteRoute.addChildren([BlogSlugRoute, BlogIndexRoute]),
  PostsRouteRoute.addChildren([
    PostsIndexRoute,
    PostsPostIdDeepRoute,
    PostsPostIdIndexRoute,
  ]),
  BlogStatsRoute,
])

/* prettier-ignore-end */
