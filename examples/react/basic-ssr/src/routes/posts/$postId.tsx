import {
  createLoaderOptions,
  Loader,
  typedClient,
  useLoaderInstance,
} from '@tanstack/react-loaders'
import { Route } from '@tanstack/router'
import * as React from 'react'
// import { loaderClient } from '../../entry-client'
import { postsRoute, PostType } from '../posts'

export const postLoader = new Loader({
  key: 'post',
  fn: async (postId: string) => {
    console.log(`Fetching post with id ${postId}...`)

    await new Promise((r) => setTimeout(r, Math.round(Math.random() * 300)))

    return fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(
      (r) => r.json() as Promise<PostType>,
    )
  },
  onInvalidate: async ({ client }) => {
    await typedClient(client).invalidateLoader({ key: 'posts' })
  },
})

export const postIdRoute = new Route({
  getParentRoute: () => postsRoute,
  path: '$postId',
  loader: async ({
    context: { loaderClient },
    params: { postId },
    preload,
  }) => {
    const loaderOptions = createLoaderOptions({
      key: 'post',
      variables: postId,
    })

    await loaderClient.load({
      ...loaderOptions,
      preload,
    })

    return () => useLoaderInstance(loaderOptions)
  },
  component: function Post({ useLoader }) {
    const { data: post } = useLoader()()

    return (
      <div className="space-y-2">
        <h4 className="text-xl font-bold underline">{post.title}</h4>
        <div className="text-sm">{post.body}</div>
      </div>
    )
  },
})
