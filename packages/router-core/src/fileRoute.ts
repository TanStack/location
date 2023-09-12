import { ParsePathParams } from './link'
import {
  AnyRoute,
  ResolveFullPath,
  ResolveFullSearchSchema,
  MergeFromFromParent,
  RouteContext,
  AnyContext,
  RouteOptions,
  InferFullSearchSchema,
  UpdatableRouteOptions,
  Route,
  AnyPathParams,
  RootRouteId,
  TrimPathLeft,
  RouteConstraints,
} from './route'

export interface FileRoutesByPath {
  // '/': {
  //   parentRoute: typeof rootRoute
  // }
}

type Replace<
  S extends string,
  From extends string,
  To extends string,
> = S extends `${infer Start}${From}${infer Rest}`
  ? `${Start}${To}${Replace<Rest, From, To>}`
  : S

export type TrimLeft<
  T extends string,
  S extends string,
> = T extends `${S}${infer U}` ? U : T

export type TrimRight<
  T extends string,
  S extends string,
> = T extends `${infer U}${S}` ? U : T

export type Trim<T extends string, S extends string> = TrimLeft<
  TrimRight<T, S>,
  S
>

export type RemoveUnderScores<T extends string> = Replace<
  Replace<TrimRight<TrimLeft<T, '/_'>, '_'>, '_/', '/'>,
  '/_',
  '/'
>

export type ResolveFilePath<
  TParentRoute extends AnyRoute,
  TFilePath extends string,
> = TParentRoute['id'] extends RootRouteId
  ? TrimPathLeft<TFilePath>
  : Replace<
      TrimPathLeft<TFilePath>,
      TrimPathLeft<TParentRoute['types']['customId']>,
      ''
    >

export type FileRoutePath<
  TParentRoute extends AnyRoute,
  TFilePath extends string,
> = ResolveFilePath<TParentRoute, TFilePath> extends `_${infer _}`
  ? string
  : ResolveFilePath<TParentRoute, TFilePath>

export class FileRoute<
  TFilePath extends keyof FileRoutesByPath,
  TParentRoute extends AnyRoute = FileRoutesByPath[TFilePath]['parentRoute'],
  TId extends RouteConstraints['TId'] = TFilePath,
  TPath extends RouteConstraints['TPath'] = FileRoutePath<
    TParentRoute,
    TFilePath
  >,
  TFullPath extends RouteConstraints['TFullPath'] = ResolveFullPath<
    TParentRoute,
    RemoveUnderScores<TPath>
  >,
> {
  constructor(public path: TFilePath) {}

  createRoute = <
    TLoader = unknown,
    TSearchSchema extends RouteConstraints['TSearchSchema'] = {},
    TFullSearchSchema extends RouteConstraints['TFullSearchSchema'] = ResolveFullSearchSchema<
      TParentRoute,
      TSearchSchema
    >,
    TParams extends RouteConstraints['TParams'] = ParsePathParams<TPath> extends never
      ? AnyPathParams
      : Record<ParsePathParams<TPath>, RouteConstraints['TPath']>,
    TAllParams extends RouteConstraints['TAllParams'] = MergeFromFromParent<
      TParentRoute['types']['allParams'],
      TParams
    >,
    TParentContext extends RouteConstraints['TParentContext'] = TParentRoute['types']['routeContext'],
    TAllParentContext extends RouteConstraints['TId'] = TParentRoute['types']['context'],
    TRouteContext extends RouteConstraints['TRouteContext'] = RouteContext,
    TContext extends RouteConstraints['TAllContext'] = MergeFromFromParent<
      TParentRoute['types']['context'],
      TRouteContext
    >,
    TRouterContext extends RouteConstraints['TRouterContext'] = AnyContext,
    TChildren extends RouteConstraints['TChildren'] = unknown,
    TRouteTree extends RouteConstraints['TRouteTree'] = AnyRoute,
  >(
    options: Omit<
      RouteOptions<
        TParentRoute,
        string,
        string,
        TLoader,
        InferFullSearchSchema<TParentRoute>,
        TSearchSchema,
        TFullSearchSchema,
        TParams,
        TAllParams,
        TParentContext,
        TAllParentContext,
        TRouteContext,
        TContext
      >,
      'getParentRoute' | 'path' | 'id'
    > &
      UpdatableRouteOptions<
        TLoader,
        TSearchSchema,
        TFullSearchSchema,
        TAllParams,
        TRouteContext,
        TContext
      >,
  ): Route<
    TParentRoute,
    TPath,
    TFullPath,
    TFilePath,
    TId,
    TLoader,
    TSearchSchema,
    TFullSearchSchema,
    TParams,
    TAllParams,
    TParentContext,
    TAllParentContext,
    TRouteContext,
    TContext,
    TRouterContext,
    TChildren,
    TRouteTree
  > => {
    const route = new Route(options as any)
    ;(route as any).isRoot = false
    return route as any
  }
}
