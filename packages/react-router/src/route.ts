import invariant from 'tiny-invariant'
import { useMatch } from './useMatch'
import { useLoaderDeps } from './useLoaderDeps'
import { useLoaderData } from './useLoaderData'
import { joinPaths, trimPathLeft } from './path'
import { useParams } from './useParams'
import { useSearch } from './useSearch'
import { notFound } from './not-found'
import { useNavigate } from './useNavigate'
import { rootRouteId } from './root'
import type * as React from 'react'
import type { RootRouteId } from './root'
import type { UseNavigateResult } from './useNavigate'
import type { MakeRouteMatch, RouteMatch } from './Matches'
import type { NavigateOptions, ParsePathParams, ToMaskOptions } from './link'
import type { ParsedLocation } from './location'
import type { RouteById, RouteIds, RoutePaths } from './routeInfo'
import type { AnyRouter, RegisteredRouter, Router } from './router'
import type { Assign, Constrain, Expand, NoInfer, PickRequired } from './utils'
import type { BuildLocationFn, NavigateFn } from './RouterProvider'
import type { NotFoundError } from './not-found'
import type { LazyRoute } from './fileRoute'

export type AnyPathParams = {}

export type SearchSchemaInput = {
  __TSearchSchemaInput__: 'TSearchSchemaInput'
}

export type AnySearchSchema = {}

export type AnyContext = {}

export interface RouteContext {}

export type PreloadableObj = { preload?: () => Promise<void> }

export type RoutePathOptions<TCustomId, TPath> =
  | {
      path: TPath
    }
  | {
      id: TCustomId
    }

export interface StaticDataRouteOption {}

export type RoutePathOptionsIntersection<TCustomId, TPath> = {
  path: TPath
  id: TCustomId
}

export type RouteOptions<
  TParentRoute extends AnyRoute = AnyRoute,
  TCustomId extends string = string,
  TPath extends string = string,
  TSearchSchemaInput = Record<string, unknown>,
  TSearchSchema = {},
  TFullSearchSchema = TSearchSchema,
  TParams = AnyPathParams,
  TAllParams = TParams,
  TLoaderDeps extends Record<string, any> = {},
  TLoaderDataReturn = {},
  TLoaderData = ResolveLoaderData<TLoaderDataReturn>,
  TRouterContext = {},
  TRouteContextFn = AnyContext,
  TBeforeLoadFn = AnyContext,
> = BaseRouteOptions<
  TParentRoute,
  TCustomId,
  TPath,
  TSearchSchemaInput,
  TSearchSchema,
  TParams,
  TLoaderDeps,
  TLoaderDataReturn,
  TRouterContext,
  TRouteContextFn,
  TBeforeLoadFn
> &
  UpdatableRouteOptions<
    NoInfer<TParentRoute>,
    NoInfer<TCustomId>,
    NoInfer<TAllParams>,
    NoInfer<TFullSearchSchema>,
    NoInfer<TLoaderData>,
    NoInfer<TLoaderDeps>,
    NoInfer<TRouterContext>,
    NoInfer<TRouteContextFn>,
    NoInfer<TBeforeLoadFn>
  >

export type ParseParamsFn<TPath extends string, TParams> = (
  rawParams: Record<ParsePathParams<TPath>, string>,
) => TParams extends Record<ParsePathParams<TPath>, any>
  ? TParams
  : Record<ParsePathParams<TPath>, any>

export type StringifyParamsFn<TPath extends string, TParams> = (
  params: TParams,
) => Record<ParsePathParams<TPath>, string>

export type ParamsOptions<TPath extends string, TParams> = {
  params?: {
    parse: ParseParamsFn<TPath, TParams>
    stringify: StringifyParamsFn<TPath, TParams>
  }

  /** 
  @deprecated Use params.parse instead
  */
  parseParams?: ParseParamsFn<TPath, TParams>

  /** 
  @deprecated Use params.stringify instead
  */
  stringifyParams?: StringifyParamsFn<TPath, TParams>
}

export interface FullSearchSchemaOption<
  in out TParentRoute extends AnyRoute,
  in out TSearchSchema,
> {
  search: Expand<ResolveFullSearchSchema<TParentRoute, TSearchSchema>>
}

export type RouteContextFn<
  in out TParentRoute extends AnyRoute,
  in out TSearchSchema,
  in out TParams,
  in out TRouterContext,
> = (
  ctx: RouteContextOptions<
    TParentRoute,
    TSearchSchema,
    TParams,
    TRouterContext
  >,
) => any

export type BeforeLoadFn<
  in out TParentRoute extends AnyRoute,
  in out TSearchSchema,
  in out TParams,
  in out TRouterContext,
  in out TRouteContextFn,
> = (
  ctx: BeforeLoadContextOptions<
    TParentRoute,
    TSearchSchema,
    TParams,
    TRouterContext,
    TRouteContextFn
  >,
) => any

export type FileBaseRouteOptions<
  TParentRoute extends AnyRoute,
  TPath extends string = string,
  TSearchSchemaInput = Record<string, unknown>,
  TSearchSchema = {},
  TParams = {},
  TLoaderDeps extends Record<string, any> = {},
  TLoaderDataReturn = {},
  TRouterContext = {},
  TRouteContextFn = AnyContext,
  TBeforeLoadFn = AnyContext,
> = ParamsOptions<TPath, TParams> & {
  validateSearch?:
    | { parse: (input: TSearchSchemaInput) => TSearchSchema }
    | ((input: TSearchSchemaInput) => TSearchSchema)

  shouldReload?:
    | boolean
    | ((
        match: LoaderFnContext<
          TParentRoute,
          TParams,
          TLoaderDeps,
          TRouterContext,
          TRouteContextFn,
          TBeforeLoadFn
        >,
      ) => any)

  context?: Constrain<
    TRouteContextFn,
    RouteContextFn<TParentRoute, TSearchSchema, TParams, TRouterContext>
  >

  // This async function is called before a route is loaded.
  // If an error is thrown here, the route's loader will not be called.
  // If thrown during a navigation, the navigation will be cancelled and the error will be passed to the `onError` function.
  // If thrown during a preload event, the error will be logged to the console.
  beforeLoad?: Constrain<
    TBeforeLoadFn,
    BeforeLoadFn<
      TParentRoute,
      TSearchSchema,
      TParams,
      TRouterContext,
      TRouteContextFn
    >
  >

  loaderDeps?: (
    opts: FullSearchSchemaOption<TParentRoute, TSearchSchema>,
  ) => TLoaderDeps
  loader?: (
    ctx: LoaderFnContext<
      TParentRoute,
      TParams,
      TLoaderDeps,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn
    >,
  ) => TLoaderDataReturn | Promise<TLoaderDataReturn>
}

export type BaseRouteOptions<
  TParentRoute extends AnyRoute = AnyRoute,
  TCustomId extends string = string,
  TPath extends string = string,
  TSearchSchemaInput = Record<string, unknown>,
  TSearchSchema = {},
  TParams = {},
  TLoaderDeps extends Record<string, any> = {},
  TLoaderDataReturn = {},
  TRouterContext = {},
  TRouteContextFn = AnyContext,
  TBeforeLoadFn = AnyContext,
> = RoutePathOptions<TCustomId, TPath> &
  FileBaseRouteOptions<
    TParentRoute,
    TPath,
    TSearchSchemaInput,
    TSearchSchema,
    TParams,
    TLoaderDeps,
    TLoaderDataReturn,
    TRouterContext,
    TRouteContextFn,
    TBeforeLoadFn
  > & {
    getParentRoute: () => TParentRoute
  }

export interface ContextOptions<
  in out TParentRoute extends AnyRoute,
  in out TSearchSchema,
  in out TParams,
> extends FullSearchSchemaOption<TParentRoute, TSearchSchema> {
  abortController: AbortController
  preload: boolean
  params: Expand<ResolveAllParamsFromParent<TParentRoute, TParams>>
  location: ParsedLocation
  /**
   * @deprecated Use `throw redirect({ to: '/somewhere' })` instead
   **/
  navigate: NavigateFn
  buildLocation: BuildLocationFn
  cause: 'preload' | 'enter' | 'stay'
}

export interface RouteContextOptions<
  in out TParentRoute extends AnyRoute,
  in out TSearchSchema,
  in out TParams,
  in out TRouterContext,
> extends ContextOptions<TParentRoute, TSearchSchema, TParams> {
  context: Expand<RouteContextParameter<TParentRoute, TRouterContext>>
}

export interface BeforeLoadContextOptions<
  in out TParentRoute extends AnyRoute,
  in out TSearchSchema,
  in out TParams,
  in out TRouterContext,
  in out TRouteContextFn,
> extends ContextOptions<TParentRoute, TSearchSchema, TParams> {
  context: Expand<
    BeforeLoadContextParameter<TParentRoute, TRouterContext, TRouteContextFn>
  >
}

export type UpdatableRouteOptions<
  TParentRoute extends AnyRoute,
  TRouteId,
  TAllParams,
  TFullSearchSchema,
  TLoaderData,
  TLoaderDeps,
  TRouterContext,
  TRouteContextFn,
  TBeforeLoadFn,
> = {
  // test?: (args: TAllContext) => void
  // If true, this route will be matched as case-sensitive
  caseSensitive?: boolean
  // If true, this route will be forcefully wrapped in a suspense boundary
  wrapInSuspense?: boolean
  // The content to be rendered when the route is matched. If no component is provided, defaults to `<Outlet />`
  component?: RouteComponent
  errorComponent?: false | null | ErrorRouteComponent
  notFoundComponent?: NotFoundRouteComponent
  pendingComponent?: RouteComponent
  pendingMs?: number
  pendingMinMs?: number
  staleTime?: number
  gcTime?: number
  preloadStaleTime?: number
  preloadGcTime?: number
  // Filter functions that can manipulate search params *before* they are passed to links and navigate
  // calls that match this route.
  preSearchFilters?: Array<SearchFilter<TFullSearchSchema>>
  // Filter functions that can manipulate search params *after* they are passed to links and navigate
  // calls that match this route.
  postSearchFilters?: Array<SearchFilter<TFullSearchSchema>>
  onCatch?: (error: Error, errorInfo: React.ErrorInfo) => void
  onError?: (err: any) => void
  // These functions are called as route matches are loaded, stick around and leave the active
  // matches
  onEnter?: (
    match: RouteMatch<
      TRouteId,
      TAllParams,
      TFullSearchSchema,
      TLoaderData,
      ResolveAllContext<
        TParentRoute,
        TRouterContext,
        TRouteContextFn,
        TBeforeLoadFn
      >,
      TLoaderDeps
    >,
  ) => void
  onStay?: (
    match: RouteMatch<
      TRouteId,
      TAllParams,
      TFullSearchSchema,
      TLoaderData,
      ResolveAllContext<
        TParentRoute,
        TRouterContext,
        TRouteContextFn,
        TBeforeLoadFn
      >,
      TLoaderDeps
    >,
  ) => void
  onLeave?: (
    match: RouteMatch<
      TRouteId,
      TAllParams,
      TFullSearchSchema,
      TLoaderData,
      ResolveAllContext<
        TParentRoute,
        TRouterContext,
        TRouteContextFn,
        TBeforeLoadFn
      >,
      TLoaderDeps
    >,
  ) => void
  meta?: (ctx: {
    matches: Array<
      RouteMatch<
        TRouteId,
        TAllParams,
        TFullSearchSchema,
        TLoaderData,
        ResolveAllContext<
          TParentRoute,
          TRouterContext,
          TRouteContextFn,
          TBeforeLoadFn
        >,
        TLoaderDeps
      >
    >
    match: RouteMatch<
      TRouteId,
      TAllParams,
      TFullSearchSchema,
      TLoaderData,
      ResolveAllContext<
        TParentRoute,
        TRouterContext,
        TRouteContextFn,
        TBeforeLoadFn
      >,
      TLoaderDeps
    >
    params: TAllParams
    loaderData: TLoaderData
  }) => Array<React.JSX.IntrinsicElements['meta']>
  links?: () => Array<React.JSX.IntrinsicElements['link']>
  scripts?: () => Array<React.JSX.IntrinsicElements['script']>
  headers?: (ctx: { loaderData: TLoaderData }) => Record<string, string>
} & UpdatableStaticRouteOption

export type UpdatableStaticRouteOption =
  {} extends PickRequired<StaticDataRouteOption>
    ? {
        staticData?: StaticDataRouteOption
      }
    : {
        staticData: StaticDataRouteOption
      }

export type MetaDescriptor =
  | { charSet: 'utf-8' }
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { httpEquiv: string; content: string }
  | { 'script:ld+json': LdJsonObject }
  | { tagName: 'meta' | 'link'; [name: string]: string }
  | Record<string, unknown>

type LdJsonObject = { [Key in string]: LdJsonValue } & {
  [Key in string]?: LdJsonValue | undefined
}
type LdJsonArray = Array<LdJsonValue> | ReadonlyArray<LdJsonValue>
type LdJsonPrimitive = string | number | boolean | null
type LdJsonValue = LdJsonPrimitive | LdJsonObject | LdJsonArray

export type RouteLinkEntry = {}

// The parse type here allows a zod schema to be passed directly to the validator
export type SearchSchemaValidator<TInput, TReturn> =
  | SearchSchemaValidatorObj<TInput, TReturn>
  | SearchSchemaValidatorFn<TInput, TReturn>

export type SearchSchemaValidatorObj<TInput, TReturn> = {
  parse?: SearchSchemaValidatorFn<TInput, TReturn>
}

export type SearchSchemaValidatorFn<TInput, TReturn> = (
  searchObj: TInput,
) => TReturn

export type RouteLoaderFn<
  in out TParentRoute extends AnyRoute = AnyRoute,
  in out TParams = {},
  in out TLoaderDeps = {},
  in out TRouterContext = {},
  in out TRouteContextFn = AnyContext,
  in out TBeforeLoadFn = AnyContext,
  TLoaderData = undefined,
> = (
  match: LoaderFnContext<
    TParentRoute,
    TParams,
    TLoaderDeps,
    TRouterContext,
    TRouteContextFn,
    TBeforeLoadFn
  >,
) => TLoaderData | Promise<TLoaderData>

export interface LoaderFnContext<
  in out TParentRoute extends AnyRoute = AnyRoute,
  in out TParams = {},
  in out TLoaderDeps = {},
  in out TRouterContext = {},
  in out TRouteContextFn = AnyContext,
  in out TBeforeLoadFn = AnyContext,
> {
  abortController: AbortController
  preload: boolean
  params: Expand<ResolveAllParamsFromParent<TParentRoute, TParams>>
  deps: TLoaderDeps
  context: Expand<
    ResolveAllContext<
      TParentRoute,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn
    >
  >
  location: ParsedLocation // Do not supply search schema here so as to demotivate people from trying to shortcut loaderDeps
  /**
   * @deprecated Use `throw redirect({ to: '/somewhere' })` instead
   **/
  navigate: (opts: NavigateOptions<AnyRouter>) => Promise<void>
  parentMatchPromise?: Promise<void>
  cause: 'preload' | 'enter' | 'stay'
  route: Route
}

export type SearchFilter<TInput, TResult = TInput> = (prev: TInput) => TResult

export type ResolveId<
  TParentRoute,
  TCustomId extends string,
  TPath extends string,
> = TParentRoute extends { id: infer TParentId extends string }
  ? RoutePrefix<TParentId, string extends TCustomId ? TPath : TCustomId>
  : RootRouteId

export type InferFullSearchSchema<TRoute> = TRoute extends {
  types: {
    fullSearchSchema: infer TFullSearchSchema
  }
}
  ? TFullSearchSchema
  : {}

export type InferFullSearchSchemaInput<TRoute> = TRoute extends {
  types: {
    fullSearchSchemaInput: infer TFullSearchSchemaInput
  }
}
  ? TFullSearchSchemaInput
  : {}

export type InferAllParams<TRoute> = TRoute extends {
  types: {
    allParams: infer TAllParams
  }
}
  ? TAllParams
  : {}

export type InferAllContext<TRoute> = unknown extends TRoute
  ? TRoute
  : TRoute extends {
        types: {
          allContext: infer TAllContext
        }
      }
    ? TAllContext
    : {}

export type ResolveSearchSchemaUsed<TSearchSchemaInput, TSearchSchema> =
  TSearchSchemaInput extends SearchSchemaInput
    ? Omit<TSearchSchemaInput, keyof SearchSchemaInput>
    : TSearchSchema

export type ResolveFullSearchSchema<
  TParentRoute extends AnyRoute,
  TSearchSchema,
> = Assign<InferFullSearchSchema<TParentRoute>, TSearchSchema>

export type ResolveFullSearchSchemaInput<
  TParentRoute extends AnyRoute,
  TSearchSchemaUsed,
> = Assign<InferFullSearchSchemaInput<TParentRoute>, TSearchSchemaUsed>

export type LooseReturnType<T> = T extends (
  ...args: Array<any>
) => infer TReturn
  ? TReturn
  : never

export type LooseAsyncReturnType<T> = T extends (
  ...args: Array<any>
) => infer TReturn
  ? TReturn extends Promise<infer TReturn>
    ? TReturn
    : TReturn
  : never

export type ContextReturnType<TContextFn> = unknown extends TContextFn
  ? TContextFn
  : LooseReturnType<TContextFn> extends never
    ? AnyContext
    : LooseReturnType<TContextFn>

export type ContextAsyncReturnType<TContextFn> = unknown extends TContextFn
  ? TContextFn
  : LooseAsyncReturnType<TContextFn> extends never
    ? AnyContext
    : LooseAsyncReturnType<TContextFn>

export type RouteContextParameter<
  TParentRoute extends AnyRoute,
  TRouterContext,
> = unknown extends TParentRoute
  ? TRouterContext
  : Assign<TRouterContext, InferAllContext<TParentRoute>>

export type ResolveRouteContext<TRouteContextFn, TBeforeLoadFn> = Assign<
  ContextReturnType<TRouteContextFn>,
  ContextAsyncReturnType<TBeforeLoadFn>
>
export type BeforeLoadContextParameter<
  TParentRoute extends AnyRoute,
  TRouterContext,
  TRouteContextFn,
> = Assign<
  RouteContextParameter<TParentRoute, TRouterContext>,
  ContextReturnType<TRouteContextFn>
>

export type ResolveAllContext<
  TParentRoute extends AnyRoute,
  TRouterContext,
  TRouteContextFn,
  TBeforeLoadFn,
> = Assign<
  BeforeLoadContextParameter<TParentRoute, TRouterContext, TRouteContextFn>,
  ContextAsyncReturnType<TBeforeLoadFn>
>

export type ResolveLoaderData<TLoaderDataReturn> = [TLoaderDataReturn] extends [
  never,
]
  ? undefined
  : TLoaderDataReturn

export interface AnyRoute
  extends Route<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  > {}

export type AnyRouteWithContext<TContext> = AnyRoute & {
  types: { allContext: TContext }
}

export type ResolveAllParamsFromParent<
  TParentRoute extends AnyRoute,
  TParams,
> = Assign<InferAllParams<TParentRoute>, TParams>

export type RouteConstraints = {
  TParentRoute: AnyRoute
  TPath: string
  TFullPath: string
  TCustomId: string
  TId: string
  TSearchSchema: AnySearchSchema
  TFullSearchSchema: AnySearchSchema
  TParams: Record<string, any>
  TAllParams: Record<string, any>
  TParentContext: AnyContext
  TRouteContext: RouteContext
  TAllContext: AnyContext
  TRouterContext: AnyContext
  TChildren: unknown
  TRouteTree: AnyRoute
}

export function getRouteApi<
  TId extends RouteIds<RegisteredRouter['routeTree']>,
  TRouter extends AnyRouter = RegisteredRouter,
  TRoute extends AnyRoute = RouteById<TRouter['routeTree'], TId>,
  TFullSearchSchema = TRoute['types']['fullSearchSchema'],
  TAllParams = TRoute['types']['allParams'],
  TAllContext = TRoute['types']['allContext'],
  TLoaderDeps = TRoute['types']['loaderDeps'],
  TLoaderData = TRoute['types']['loaderData'],
>(id: TId) {
  return new RouteApi<
    TId,
    TRouter,
    TRoute,
    TFullSearchSchema,
    TAllParams,
    TAllContext,
    TLoaderDeps,
    TLoaderData
  >({ id })
}

export class RouteApi<
  TId extends RouteIds<RegisteredRouter['routeTree']>,
  TRouter extends AnyRouter = RegisteredRouter,
  TRoute extends AnyRoute = RouteById<TRouter['routeTree'], TId>,
  TFullSearchSchema = TRoute['types']['fullSearchSchema'],
  TAllParams = TRoute['types']['allParams'],
  TAllContext = TRoute['types']['allContext'],
  TLoaderDeps = TRoute['types']['loaderDeps'],
  TLoaderData = TRoute['types']['loaderData'],
> {
  id: TId

  /**
   * @deprecated Use the `getRouteApi` function instead.
   */
  constructor({ id }: { id: TId }) {
    this.id = id as any
  }

  useMatch = <
    TRouteTree extends AnyRoute = TRouter['routeTree'],
    TRouteMatch = MakeRouteMatch<TRouteTree, TId>,
    TSelected = TRouteMatch,
  >(opts?: {
    select?: (match: TRouteMatch) => TSelected
  }): TSelected => {
    return useMatch({ select: opts?.select, from: this.id })
  }

  useRouteContext = <TSelected = Expand<TAllContext>>(opts?: {
    select?: (s: Expand<TAllContext>) => TSelected
  }): TSelected => {
    return useMatch({
      from: this.id,
      select: (d: any) => (opts?.select ? opts.select(d.context) : d.context),
    })
  }

  useSearch = <TSelected = Expand<TFullSearchSchema>>(opts?: {
    select?: (s: Expand<TFullSearchSchema>) => TSelected
  }): TSelected => {
    return useSearch({ ...opts, from: this.id })
  }

  useParams = <TSelected = Expand<TAllParams>>(opts?: {
    select?: (s: Expand<TAllParams>) => TSelected
  }): TSelected => {
    return useParams({ ...opts, from: this.id })
  }

  useLoaderDeps = <TSelected = TLoaderDeps>(opts?: {
    select?: (s: TLoaderDeps) => TSelected
  }): TSelected => {
    return useLoaderDeps({ ...opts, from: this.id, strict: false } as any)
  }

  useLoaderData = <TSelected = TLoaderData>(opts?: {
    select?: (s: TLoaderData) => TSelected
  }): TSelected => {
    return useLoaderData({ ...opts, from: this.id, strict: false } as any)
  }

  useNavigate = (): UseNavigateResult<TRoute['fullPath']> => {
    return useNavigate({ from: this.id })
  }

  notFound = (opts?: NotFoundError) => {
    return notFound({ routeId: this.id as string, ...opts })
  }
}

export class Route<
  in out TParentRoute extends RouteConstraints['TParentRoute'] = AnyRoute,
  in out TPath extends RouteConstraints['TPath'] = '/',
  in out TFullPath extends RouteConstraints['TFullPath'] = ResolveFullPath<
    TParentRoute,
    TPath
  >,
  in out TCustomId extends RouteConstraints['TCustomId'] = string,
  in out TId extends RouteConstraints['TId'] = ResolveId<
    TParentRoute,
    TCustomId,
    TPath
  >,
  in out TSearchSchemaInput = Record<string, unknown>,
  in out TSearchSchema = {},
  in out TSearchSchemaUsed = ResolveSearchSchemaUsed<
    TSearchSchemaInput,
    TSearchSchema
  >,
  in out TFullSearchSchemaInput = ResolveFullSearchSchemaInput<
    TParentRoute,
    TSearchSchemaUsed
  >,
  in out TFullSearchSchema = ResolveFullSearchSchema<
    TParentRoute,
    TSearchSchema
  >,
  in out TParams = Record<ParsePathParams<TPath>, string>,
  in out TAllParams = ResolveAllParamsFromParent<TParentRoute, TParams>,
  in out TRouterContext = AnyContext,
  in out TRouteContextFn = AnyContext,
  in out TBeforeLoadFn = AnyContext,
  in out TLoaderDeps extends Record<string, any> = {},
  TLoaderDataReturn = {},
  in out TLoaderData = ResolveLoaderData<TLoaderDataReturn>,
  in out TChildren = unknown,
> {
  isRoot: TParentRoute extends Route<any> ? true : false
  options: RouteOptions<
    TParentRoute,
    TCustomId,
    TPath,
    TSearchSchemaInput,
    TSearchSchema,
    TFullSearchSchema,
    TParams,
    TAllParams,
    TLoaderDeps,
    TLoaderDataReturn,
    TLoaderData,
    TRouterContext,
    TRouteContextFn,
    TBeforeLoadFn
  >

  // Set up in this.init()
  parentRoute!: TParentRoute
  id!: TId
  // customId!: TCustomId
  path!: TPath
  fullPath!: TFullPath
  to!: TrimPathRight<TFullPath>

  // Optional
  children?: TChildren
  originalIndex?: number
  router?: AnyRouter
  rank!: number
  lazyFn?: () => Promise<LazyRoute<any>>
  _lazyPromise?: Promise<void>

  /**
   * @deprecated Use the `createRoute` function instead.
   */
  constructor(
    options?: RouteOptions<
      TParentRoute,
      TCustomId,
      TPath,
      TSearchSchemaInput,
      TSearchSchema,
      TFullSearchSchema,
      TParams,
      TAllParams,
      TLoaderDeps,
      TLoaderDataReturn,
      TLoaderData,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn
    >,
  ) {
    this.options = (options as any) || {}

    this.isRoot = !options?.getParentRoute as any
    invariant(
      !((options as any)?.id && (options as any)?.path),
      `Route cannot have both an 'id' and a 'path' option.`,
    )
    ;(this as any).$$typeof = Symbol.for('react.memo')
  }

  types!: {
    parentRoute: TParentRoute
    path: TPath
    to: TrimPathRight<TFullPath>
    fullPath: TFullPath
    customId: TCustomId
    id: TId
    searchSchema: TSearchSchema
    searchSchemaInput: TSearchSchemaInput
    searchSchemaUsed: TSearchSchemaUsed
    fullSearchSchema: TFullSearchSchema
    fullSearchSchemaInput: TFullSearchSchemaInput
    params: TParams
    allParams: TAllParams
    routerContext: TRouterContext
    routeContext: ResolveRouteContext<TRouteContextFn, TBeforeLoadFn>
    routeContextFn: TRouteContextFn
    beforeLoadFn: TBeforeLoadFn
    allContext: ResolveAllContext<
      TParentRoute,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn
    >
    children: TChildren
    loaderData: TLoaderData
    loaderDeps: TLoaderDeps
  }

  init = (opts: { originalIndex: number }): void => {
    this.originalIndex = opts.originalIndex

    const options = this.options as
      | (RouteOptions<
          TParentRoute,
          TCustomId,
          TPath,
          TSearchSchemaInput,
          TSearchSchema,
          TFullSearchSchema,
          TParams,
          TAllParams,
          TLoaderDeps,
          TLoaderDataReturn,
          TLoaderData,
          TRouterContext,
          TRouteContextFn,
          TBeforeLoadFn
        > &
          RoutePathOptionsIntersection<TCustomId, TPath>)
      | undefined

    const isRoot = !options?.path && !options?.id

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    this.parentRoute = this.options.getParentRoute()

    if (isRoot) {
      this.path = rootRouteId as TPath
    } else {
      invariant(
        this.parentRoute,
        `Child Route instances must pass a 'getParentRoute: () => ParentRoute' option that returns a Route instance.`,
      )
    }

    let path: undefined | string = isRoot ? rootRouteId : options.path

    // If the path is anything other than an index path, trim it up
    if (path && path !== '/') {
      path = trimPathLeft(path)
    }

    const customId = options?.id || path

    // Strip the parentId prefix from the first level of children
    let id = isRoot
      ? rootRouteId
      : joinPaths([
          this.parentRoute.id === rootRouteId ? '' : this.parentRoute.id,
          customId,
        ])

    if (path === rootRouteId) {
      path = '/'
    }

    if (id !== rootRouteId) {
      id = joinPaths(['/', id])
    }

    const fullPath =
      id === rootRouteId ? '/' : joinPaths([this.parentRoute.fullPath, path])

    this.path = path as TPath
    this.id = id as TId
    // this.customId = customId as TCustomId
    this.fullPath = fullPath as TFullPath
    this.to = fullPath as TrimPathRight<TFullPath>
  }

  addChildren<
    const TNewChildren extends
      | Record<string, AnyRoute>
      | ReadonlyArray<AnyRoute>,
  >(
    children: TNewChildren,
  ): Route<
    TParentRoute,
    TPath,
    TFullPath,
    TCustomId,
    TId,
    TSearchSchemaInput,
    TSearchSchema,
    TSearchSchemaUsed,
    TFullSearchSchemaInput,
    TFullSearchSchema,
    TParams,
    TAllParams,
    TRouterContext,
    TRouteContextFn,
    TBeforeLoadFn,
    TLoaderDeps,
    TLoaderDataReturn,
    TLoaderData,
    TNewChildren
  > {
    this.children = (
      Array.isArray(children) ? children : Object.values(children)
    ) as any
    return this as any
  }

  updateLoader = <TNewLoaderData = unknown>(options: {
    loader: RouteLoaderFn<
      TParentRoute,
      TParams,
      TLoaderDeps,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn,
      TNewLoaderData
    >
  }) => {
    Object.assign(this.options, options)
    return this as unknown as Route<
      TParentRoute,
      TPath,
      TFullPath,
      TCustomId,
      TId,
      TSearchSchemaInput,
      TSearchSchema,
      TSearchSchemaUsed,
      TFullSearchSchemaInput,
      TFullSearchSchema,
      TParams,
      TAllParams,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn,
      TLoaderDeps,
      TNewLoaderData,
      TChildren
    >
  }

  update = (
    options: UpdatableRouteOptions<
      TParentRoute,
      TCustomId,
      TAllParams,
      TFullSearchSchema,
      TLoaderData,
      TLoaderDeps,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn
    >,
  ): this => {
    Object.assign(this.options, options)
    return this
  }

  lazy = (lazyFn: () => Promise<LazyRoute<any>>): this => {
    this.lazyFn = lazyFn
    return this
  }

  useMatch = <
    TRouter extends AnyRouter = RegisteredRouter,
    TRouteTree extends AnyRoute = TRouter['routeTree'],
    TRouteMatch = MakeRouteMatch<TRouteTree, TId>,
    TSelected = TRouteMatch,
  >(opts?: {
    select?: (match: TRouteMatch) => TSelected
  }): TSelected => {
    return useMatch({ ...opts, from: this.id })
  }

  useRouteContext = <
    TSelected = Expand<
      ResolveAllContext<
        TParentRoute,
        TRouterContext,
        TRouteContextFn,
        TBeforeLoadFn
      >
    >,
  >(opts?: {
    select?: (
      search: Expand<
        ResolveAllContext<
          TParentRoute,
          TRouterContext,
          TRouteContextFn,
          TBeforeLoadFn
        >
      >,
    ) => TSelected
  }): TSelected => {
    return useMatch({
      ...opts,
      from: this.id,
      select: (d: any) => (opts?.select ? opts.select(d.context) : d.context),
    })
  }

  useSearch = <TSelected = Expand<TFullSearchSchema>>(opts?: {
    select?: (search: Expand<TFullSearchSchema>) => TSelected
  }): TSelected => {
    return useSearch({ ...opts, from: this.id })
  }

  useParams = <TSelected = Expand<TAllParams>>(opts?: {
    select?: (search: Expand<TAllParams>) => TSelected
  }): TSelected => {
    return useParams({ ...opts, from: this.id })
  }

  useLoaderDeps = <TSelected = TLoaderDeps>(opts?: {
    select?: (s: TLoaderDeps) => TSelected
  }): TSelected => {
    return useLoaderDeps({ ...opts, from: this.id } as any)
  }

  useLoaderData = <TSelected = TLoaderData>(opts?: {
    select?: (search: TLoaderData) => TSelected
  }): TSelected => {
    return useLoaderData({ ...opts, from: this.id } as any)
  }

  useNavigate = (): UseNavigateResult<TFullPath> => {
    return useNavigate({ from: this.id })
  }
}

export function createRoute<
  TParentRoute extends RouteConstraints['TParentRoute'] = AnyRoute,
  TPath extends RouteConstraints['TPath'] = '/',
  TFullPath extends RouteConstraints['TFullPath'] = ResolveFullPath<
    TParentRoute,
    TPath
  >,
  TCustomId extends RouteConstraints['TCustomId'] = string,
  TId extends RouteConstraints['TId'] = ResolveId<
    TParentRoute,
    TCustomId,
    TPath
  >,
  TSearchSchemaInput = Record<string, unknown>,
  TSearchSchema = {},
  TSearchSchemaUsed = ResolveSearchSchemaUsed<
    TSearchSchemaInput,
    TSearchSchema
  >,
  TFullSearchSchemaInput = ResolveFullSearchSchemaInput<
    TParentRoute,
    TSearchSchemaUsed
  >,
  TFullSearchSchema = ResolveFullSearchSchema<TParentRoute, TSearchSchema>,
  TParams = Record<ParsePathParams<TPath>, string>,
  TAllParams = ResolveAllParamsFromParent<TParentRoute, TParams>,
  TRouteContextFn = AnyContext,
  TBeforeLoadFn = AnyContext,
  TLoaderDeps extends Record<string, any> = {},
  TLoaderDataReturn = {},
  TLoaderData = ResolveLoaderData<TLoaderDataReturn>,
  TChildren = unknown,
>(
  options: RouteOptions<
    TParentRoute,
    TCustomId,
    TPath,
    TSearchSchemaInput,
    TSearchSchema,
    TFullSearchSchema,
    TParams,
    TAllParams,
    TLoaderDeps,
    TLoaderDataReturn,
    TLoaderData,
    AnyContext,
    TRouteContextFn,
    TBeforeLoadFn
  >,
) {
  return new Route<
    TParentRoute,
    TPath,
    TFullPath,
    TCustomId,
    TId,
    TSearchSchemaInput,
    TSearchSchema,
    TSearchSchemaUsed,
    TFullSearchSchemaInput,
    TFullSearchSchema,
    TParams,
    TAllParams,
    AnyContext,
    TRouteContextFn,
    TBeforeLoadFn,
    TLoaderDeps,
    TLoaderDataReturn,
    TLoaderData,
    TChildren
  >(options)
}

export type AnyRootRoute = RootRoute<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>

export type RootRouteOptions<
  TSearchSchemaInput = {},
  TSearchSchema = {},
  TRouterContext = {},
  TRouteContextFn = AnyContext,
  TBeforeLoadFn = AnyContext,
  TLoaderDeps extends Record<string, any> = {},
  TLoaderDataReturn = {},
  TLoaderData = ResolveLoaderData<TLoaderDataReturn>,
> = Omit<
  RouteOptions<
    any, // TParentRoute
    RootRouteId, // TCustomId
    '', // TPath
    TSearchSchemaInput, // TSearchSchemaInput
    TSearchSchema, // TSearchSchema
    TSearchSchema, // TFullSearchSchema
    {}, // TParams
    {}, // TAllParams
    TLoaderDeps,
    TLoaderDataReturn, // TLoaderDataReturn,
    TLoaderData, // TLoaderData,
    TRouterContext,
    TRouteContextFn,
    TBeforeLoadFn
  >,
  | 'path'
  | 'id'
  | 'getParentRoute'
  | 'caseSensitive'
  | 'parseParams'
  | 'stringifyParams'
  | 'params'
>

export function createRootRouteWithContext<TRouterContext extends {}>() {
  return <
    TSearchSchemaInput = {},
    TSearchSchema = {},
    TSearchSchemaUsed = ResolveSearchSchemaUsed<
      TSearchSchemaInput,
      TSearchSchema
    >,
    TRouteContextFn = AnyContext,
    TBeforeLoadFn = AnyContext,
    TLoaderDeps extends Record<string, any> = {},
    TLoaderDataReturn = {},
    TLoaderData = ResolveLoaderData<TLoaderDataReturn>,
  >(
    options?: RootRouteOptions<
      TSearchSchemaInput,
      TSearchSchema,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn,
      TLoaderDeps,
      TLoaderDataReturn,
      TLoaderData
    >,
  ) => {
    return createRootRoute<
      TSearchSchemaInput,
      TSearchSchema,
      TSearchSchemaUsed,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn,
      TLoaderDeps,
      TLoaderData
    >(options as any)
  }
}

/**
 * @deprecated Use the `createRootRouteWithContext` function instead.
 */
export const rootRouteWithContext = createRootRouteWithContext

export class RootRoute<
  in out TSearchSchemaInput = {},
  in out TSearchSchema = {},
  in out TSearchSchemaUsed = {},
  in out TRouterContext = {},
  in out TRouteContextFn = AnyContext,
  in out TBeforeLoadFn = AnyContext,
  TLoaderDeps extends Record<string, any> = {},
  TLoaderDataReturn = {},
  in out TLoaderData = ResolveLoaderData<TLoaderDataReturn>,
  TChildren = unknown,
> extends Route<
  any, // TParentRoute
  '/', // TPath
  '/', // TFullPath
  string, // TCustomId
  RootRouteId, // TId
  TSearchSchemaInput, // TSearchSchemaInput
  TSearchSchema, // TSearchSchema
  TSearchSchemaUsed,
  TSearchSchemaUsed, // TFullSearchSchemaInput
  TSearchSchema, // TFullSearchSchema
  {}, // TParams
  {}, // TAllParams
  TRouterContext,
  TRouteContextFn,
  TBeforeLoadFn,
  TLoaderDeps,
  TLoaderDataReturn,
  TLoaderData,
  TChildren // TChildren
> {
  /**
   * @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
   */
  constructor(
    options?: RootRouteOptions<
      TSearchSchemaInput,
      TSearchSchema,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn,
      TLoaderDeps,
      TLoaderDataReturn,
      TLoaderData
    >,
  ) {
    super(options as any)
  }

  addChildren<
    const TNewChildren extends
      | Record<string, AnyRoute>
      | ReadonlyArray<AnyRoute>,
  >(
    children: TNewChildren,
  ): RootRoute<
    TSearchSchemaInput,
    TSearchSchema,
    TSearchSchemaUsed,
    TRouterContext,
    TRouteContextFn,
    TBeforeLoadFn,
    TLoaderDeps,
    TLoaderDataReturn,
    TLoaderData,
    TNewChildren
  > {
    return super.addChildren(children)
  }
}

export function createRootRoute<
  TSearchSchemaInput = {},
  TSearchSchema = {},
  TSearchSchemaUsed = ResolveSearchSchemaUsed<
    TSearchSchemaInput,
    TSearchSchema
  >,
  TRouterContext = {},
  TRouteContextFn = AnyContext,
  TBeforeLoadFn = AnyContext,
  TLoaderDeps extends Record<string, any> = {},
  TLoaderDataReturn = {},
  TLoaderData = ResolveLoaderData<TLoaderDataReturn>,
>(
  options?: Omit<
    RouteOptions<
      any, // TParentRoute
      RootRouteId, // TCustomId
      '', // TPath
      TSearchSchemaInput, // TSearchSchemaInput
      TSearchSchema, // TSearchSchema
      TSearchSchema,
      {}, // TParams
      {}, // TAllParams
      TLoaderDeps,
      TLoaderDataReturn,
      TLoaderData,
      TRouterContext,
      TRouteContextFn,
      TBeforeLoadFn
    >,
    | 'path'
    | 'id'
    | 'getParentRoute'
    | 'caseSensitive'
    | 'parseParams'
    | 'stringifyParams'
    | 'params'
  >,
) {
  return new RootRoute<
    TSearchSchemaInput,
    TSearchSchema,
    TSearchSchemaUsed,
    TRouterContext,
    TRouteContextFn,
    TBeforeLoadFn,
    TLoaderDeps,
    TLoaderDataReturn,
    TLoaderData
  >(options)
}

export type ResolveFullPath<
  TParentRoute extends AnyRoute,
  TPath extends string,
  TPrefixed = RoutePrefix<TParentRoute['fullPath'], TPath>,
> = TPrefixed extends RootRouteId ? '/' : TPrefixed

type RoutePrefix<
  TPrefix extends string,
  TPath extends string,
> = string extends TPath
  ? RootRouteId
  : TPath extends string
    ? TPrefix extends RootRouteId
      ? TPath extends '/'
        ? '/'
        : `/${TrimPath<TPath>}`
      : `${TPrefix}/${TPath}` extends '/'
        ? '/'
        : `/${TrimPathLeft<`${TrimPathRight<TPrefix>}/${TrimPath<TPath>}`>}`
    : never

export type TrimPath<T extends string> = '' extends T
  ? ''
  : TrimPathRight<TrimPathLeft<T>>

export type TrimPathLeft<T extends string> =
  T extends `${RootRouteId}/${infer U}`
    ? TrimPathLeft<U>
    : T extends `/${infer U}`
      ? TrimPathLeft<U>
      : T
export type TrimPathRight<T extends string> = T extends '/'
  ? '/'
  : T extends `${infer U}/`
    ? TrimPathRight<U>
    : T

export type RouteMask<TRouteTree extends AnyRoute> = {
  routeTree: TRouteTree
  from: RoutePaths<TRouteTree>
  to?: any
  params?: any
  search?: any
  hash?: any
  state?: any
  unmaskOnReload?: boolean
}

export function createRouteMask<
  TRouteTree extends AnyRoute,
  TFrom extends RoutePaths<TRouteTree>,
  TTo extends string,
>(
  opts: {
    routeTree: TRouteTree
  } & ToMaskOptions<Router<TRouteTree, 'never'>, TFrom, TTo>,
): RouteMask<TRouteTree> {
  return opts as any
}

/**
 * @deprecated Use `ErrorComponentProps` instead.
 */
export type ErrorRouteProps = {
  error: unknown
  info?: { componentStack: string }
  reset: () => void
}

export type ErrorComponentProps = {
  error: Error
  info?: { componentStack: string }
  reset: () => void
}
export type NotFoundRouteProps = {
  // TODO: Make sure this is `| null | undefined` (this is for global not-founds)
  data: unknown
}
//

export type ReactNode = any

export type SyncRouteComponent<TProps> =
  | ((props: TProps) => ReactNode)
  | React.LazyExoticComponent<(props: TProps) => ReactNode>

export type AsyncRouteComponent<TProps> = SyncRouteComponent<TProps> & {
  preload?: () => Promise<void>
}

export type RouteComponent<TProps = any> = AsyncRouteComponent<TProps>

export type ErrorRouteComponent = RouteComponent<ErrorComponentProps>

export type NotFoundRouteComponent = SyncRouteComponent<NotFoundRouteProps>

export class NotFoundRoute<
  TParentRoute extends AnyRootRoute,
  TSearchSchemaInput = Record<string, unknown>,
  TSearchSchema = {},
  TSearchSchemaUsed = {},
  TFullSearchSchemaInput = ResolveFullSearchSchemaInput<
    TParentRoute,
    TSearchSchemaUsed
  >,
  TFullSearchSchema = ResolveFullSearchSchema<TParentRoute, TSearchSchema>,
  TRouterContext = AnyContext,
  TRouteContextFn = AnyContext,
  TBeforeLoadFn = AnyContext,
  TLoaderDeps extends Record<string, any> = {},
  TLoaderDataReturn = {},
  TLoaderData = ResolveLoaderData<TLoaderDataReturn>,
  TChildren = unknown,
> extends Route<
  TParentRoute,
  '/404',
  '/404',
  '404',
  '404',
  TSearchSchemaInput,
  TSearchSchema,
  TSearchSchemaUsed,
  TFullSearchSchemaInput,
  TFullSearchSchema,
  {},
  {},
  TRouterContext,
  TRouteContextFn,
  TBeforeLoadFn,
  TLoaderDeps,
  TLoaderDataReturn,
  TLoaderData,
  TChildren
> {
  constructor(
    options: Omit<
      RouteOptions<
        TParentRoute,
        string,
        string,
        TSearchSchemaInput,
        TSearchSchema,
        TFullSearchSchema,
        {},
        {},
        TLoaderDeps,
        TLoaderDataReturn,
        TLoaderData,
        TRouterContext,
        TRouteContextFn,
        TBeforeLoadFn
      >,
      | 'caseSensitive'
      | 'parseParams'
      | 'stringifyParams'
      | 'path'
      | 'id'
      | 'params'
    >,
  ) {
    super({
      ...(options as any),
      id: '404',
    })
  }
}
