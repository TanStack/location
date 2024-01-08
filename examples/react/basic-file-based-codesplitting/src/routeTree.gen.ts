import { FileRoute, lazyFn, lazyRouteComponent } from "@tanstack/react-router"

import { Route as rootRoute } from "./routes/__root"
import { Route as LayoutImport } from "./routes/_layout"
import { Route as IndexImport } from "./routes/index"
import { Route as PostsPostIdRouteImport } from "./routes/posts.$postId/route"
import { Route as PostsIndexImport } from "./routes/posts.index"
import { Route as LayoutLayoutBImport } from "./routes/_layout/layout-b"
import { Route as LayoutLayoutAImport } from "./routes/_layout/layout-a"
import { Route as PostsPostIdDeepImport } from "./routes/posts_.$postId.deep"

const PostsComponentImport = new FileRoute("/posts").createRoute()
const LayoutLayoutBTestComponentImport = new FileRoute(
  "/_layout/layout-b/test",
).createRoute()

const PostsComponentRoute = PostsComponentImport.update({
  path: "/posts",
  getParentRoute: () => rootRoute,
} as any)
  .updateLoader({
    loader: lazyFn(() => import("./routes/posts.loader"), "loader"),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/posts.component"),
      "component",
    ),
  })

const LayoutRoute = LayoutImport.update({
  id: "/_layout",
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: "/",
  getParentRoute: () => rootRoute,
} as any)

const PostsPostIdRouteRoute = PostsPostIdRouteImport.update({
  path: "/$postId",
  getParentRoute: () => PostsComponentRoute,
} as any)
  .updateLoader({
    loader: lazyFn(() => import("./routes/posts.$postId/loader"), "loader"),
  })
  .update({
    component: lazyRouteComponent(
      () => import("./routes/posts.$postId/component"),
      "component",
    ),
  })

const PostsIndexRoute = PostsIndexImport.update({
  path: "/",
  getParentRoute: () => PostsComponentRoute,
} as any)

const LayoutLayoutBRoute = LayoutLayoutBImport.update({
  path: "/layout-b",
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutLayoutARoute = LayoutLayoutAImport.update({
  path: "/layout-a",
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutLayoutBTestComponentRoute = LayoutLayoutBTestComponentImport.update(
  {
    path: "/test",
    getParentRoute: () => LayoutLayoutBRoute,
  } as any,
).update({
  component: lazyRouteComponent(
    () => import("./routes/_layout/layout-b.test.component"),
    "component",
  ),
})

const PostsPostIdDeepRoute = PostsPostIdDeepImport.update({
  path: "/posts/$postId/deep",
  getParentRoute: () => rootRoute,
} as any)
declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    "/_layout": {
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    "/_layout/layout-a": {
      preLoaderRoute: typeof LayoutLayoutAImport
      parentRoute: typeof LayoutImport
    }
    "/_layout/layout-b": {
      preLoaderRoute: typeof LayoutLayoutBImport
      parentRoute: typeof LayoutImport
    }
    "/posts": {
      preLoaderRoute: typeof PostsComponentImport
      parentRoute: typeof rootRoute
    }
    "/posts/": {
      preLoaderRoute: typeof PostsIndexImport
      parentRoute: typeof PostsComponentImport
    }
    "/posts/$postId": {
      preLoaderRoute: typeof PostsPostIdRouteImport
      parentRoute: typeof PostsComponentImport
    }
    "/posts_/$postId/deep": {
      preLoaderRoute: typeof PostsPostIdDeepImport
      parentRoute: typeof rootRoute
    }
    "/_layout/layout-b/test": {
      preLoaderRoute: typeof LayoutLayoutBTestComponentImport
      parentRoute: typeof LayoutLayoutBImport
    }
  }
}
export const routeTree = rootRoute.addChildren([
  IndexRoute,
  LayoutRoute.addChildren([
    LayoutLayoutARoute,
    LayoutLayoutBRoute.addChildren([LayoutLayoutBTestComponentRoute]),
  ]),
  PostsComponentRoute.addChildren([PostsIndexRoute, PostsPostIdRouteRoute]),
  PostsPostIdDeepRoute,
])
