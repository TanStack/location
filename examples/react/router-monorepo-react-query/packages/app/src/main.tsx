import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  router,
  queryClient,
  Outlet,
  RouterIds,
} from '@router-mono-react-query/router';
import { PostIdComponent, PostsListComponent, PostErrorComponent } from '@router-mono-react-query/post-feature' 
import { RootComponent} from './rootComponent'

// Not lazy loaded for simplicity, but you could expose from your library component
// individually, and enforce here to use react lazy components via typings
// so that you have code splitting
const routerMap = {
  '/': PostsListComponent,
  '/$postId': PostIdComponent,
  __root__: RootComponent,
} as const satisfies Record<RouterIds, (() => React.ReactElement) | null>;

function EmptyComponent() {
  return <Outlet />;
}

Object.entries(routerMap).forEach(([path, component]) => {
  const foundRoute = router.routesById[path as RouterIds];
  if (foundRoute) {
    foundRoute.update({
      component: component ?? EmptyComponent,
    });
  }
});

// And you can do the same logic with custom error pages, and any other properties
const errorComponentMap = {
  '/': null,
  '/$postId': PostErrorComponent,
  __root__: null,
} as const satisfies Record<RouterIds, React.ComponentType<any> | null>;


Object.entries(errorComponentMap).forEach(([path, component]) => {
  if (!component) {
    return;
  }

  const foundRoute = router.routesById[path as RouterIds];
  if (foundRoute) {
    foundRoute.update({
      errorComponent: component,
    });
  }
});

// Render the app
const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
}
