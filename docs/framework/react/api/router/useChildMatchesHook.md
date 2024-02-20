---
id: useChildMatchesHook
title: useChildMatches hook
---

The `useChildMatches` hook returns all of the child `RouteMatch` objects from the closest match down to the leaf-most match. **It does not include the current match, which can be obtained using the `useMatch` hook.**

**⚠️ Note: If the router has pending matches and they are showing their pending component fallbacks, `router.state.pendingMatches` will used instead of `router.state.matches`.**

### Options

#### `opts.select`

- Optional
- `(matches: RouteMatch[]) => TSelected`
- If supplied, this function will be called with the route matches and the return value will be returned from `useChildMatches`. This value will also be used to determine if the hook should re-render its parent component using shallow equality checks.

### Returns

- If a `select` function is provided, the return value of the `select` function.
- If no `select` function is provided, an array of `RouteMatch` objects.
