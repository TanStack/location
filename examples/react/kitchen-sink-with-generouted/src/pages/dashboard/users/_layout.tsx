import { Loader as _Loader, useLoaderInstance } from '@tanstack/react-loaders'
import { Link, MatchRoute, Outlet, useNavigate, useSearch } from '@tanstack/react-router'
import { z } from 'zod'

import { Spinner } from '@/components/spinner'
import { fetchUsers } from '@/utils/mock'
import { useEffect, useMemo, useState } from 'react'

const usersViewSortBy = z.enum(['name', 'id', 'email'])
export type UsersViewSortBy = z.infer<typeof usersViewSortBy>

export const Loader = new _Loader({
  key: 'users',
  loader: async () => {
    console.log('Fetching users...')
    return fetchUsers()
  },
})

export const Config = {
  validateSearch: z.object({
    usersView: z
      .object({
        sortBy: usersViewSortBy.optional(),
        filterBy: z.string().optional(),
      })
      .optional(),
  }).parse,
  preSearchFilters: [
    // Persist (or set as default) the usersView search param
    // while navigating within or to this route (or it's children!)
    (search) => ({
      ...search,
      usersView: {
        ...search.usersView,
      },
    }),
  ],
  onLoad: async ({ preload }) => Loader.load({ preload }),
}

export default function Users() {
  const navigate = useNavigate({ from: '/dashboard/users' })
  const usersLoaderInstance = useLoaderInstance({ key: 'users' })
  const users = usersLoaderInstance.state.data
  const { usersView } = useSearch({ from: '/dashboard/users' })

  const sortBy = usersView?.sortBy ?? 'name'
  const filterBy = usersView?.filterBy

  const [filterDraft, setFilterDraft] = useState(filterBy ?? '')

  const sortedUsers = useMemo(() => {
    if (!users) return []

    return !sortBy
      ? users
      : [...users].sort((a, b) => {
          return a[sortBy] > b[sortBy] ? 1 : -1
        })
  }, [users, sortBy])

  const filteredUsers = useMemo(() => {
    if (!filterBy) return sortedUsers

    return sortedUsers.filter((user) => user.name.toLowerCase().includes(filterBy.toLowerCase()))
  }, [sortedUsers, filterBy])

  const setSortBy = (sortBy: UsersViewSortBy) =>
    navigate({
      search: (old) => {
        return {
          ...old,
          usersView: {
            sortBy,
          },
        }
      },
      replace: true,
    })

  useEffect(() => {
    navigate({
      search: (old) => {
        return {
          ...old,
          usersView: {
            ...old?.usersView,
            filterBy: filterDraft || undefined,
          },
        }
      },
      replace: true,
    })
  }, [filterDraft])

  return (
    <div className="flex-1 flex">
      <div className="divide-y">
        <div className="py-2 px-3 flex gap-2 items-center bg-gray-100">
          <div>Sort By:</div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as UsersViewSortBy)}
            className="flex-1 border p-1 px-2 rounded"
          >
            {['name', 'id', 'email'].map((d) => {
              return <option key={d} value={d} children={d} />
            })}
          </select>
        </div>
        <div className="py-2 px-3 flex gap-2 items-center bg-gray-100">
          <div>Filter By:</div>
          <input
            value={filterDraft}
            onChange={(e) => setFilterDraft(e.target.value)}
            placeholder="Search Names..."
            className="min-w-0 flex-1 border p-1 px-2 rounded"
          />
        </div>
        {filteredUsers?.map((user) => {
          return (
            <div key={user.id}>
              <Link
                to="/dashboard/users/$userId"
                params={{
                  userId: user.id,
                }}
                className="block py-2 px-3 text-blue-700"
                activeProps={{ className: `font-bold` }}
              >
                <pre className="text-sm">
                  {user.name}{' '}
                  <MatchRoute
                    to="/dashboard/users/$userId"
                    params={{
                      userId: user.id,
                    }}
                    pending
                  >
                    <Spinner />
                  </MatchRoute>
                </pre>
              </Link>
            </div>
          )
        })}
      </div>
      <div className="flex-initial border-l border-gray-200">
        <Outlet />
      </div>
    </div>
  )
}
