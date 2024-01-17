import warning from 'tiny-warning'
import { defaultDeserializeError, isServerSideError } from './Matches'
import { useRouter } from './RouterProvider'
import { DeferredPromise, isDehydratedDeferred } from './defer'

export type AwaitOptions<T> = {
  promise: DeferredPromise<T>
}

export function useAwaited<T>({ promise }: AwaitOptions<T>): [T] {
  const router = useRouter()

  let state = promise.__deferredState
  const key = `__TSR__DEFERRED__${state.uid}`

  if (isDehydratedDeferred(promise)) {
    state = router.hydrateData(key)!
    if (!state) throw new Error('Could not find dehydrated data')
    promise = Promise.resolve(state.data) as DeferredPromise<any>
    promise.__deferredState = state
  }

  if (state.status === 'pending') {
    throw new Promise((r) => setTimeout(r, 1)).then(() => promise)
  }

  if (state.status === 'error') {
    if (typeof document !== 'undefined') {
      if (isServerSideError(state.error)) {
        throw (router.options.deserializeError ?? defaultDeserializeError)(
          state.error.data as any,
        )
      } else {
        warning(
          false,
          "Encountered a server-side error that doesn't fit the expected shape",
        )
        throw state.error
      }
    } else {
      router.dehydrateData(key, state)
      throw state.error
    }
  }

  router.dehydrateData(key, state)

  return [state.data]
}

export function Await<T>(
  props: AwaitOptions<T> & {
    children: (result: T) => JSX.Element
  },
) {
  const awaited = useAwaited(props)
  return props.children(...awaited)
}
