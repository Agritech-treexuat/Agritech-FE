import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import { Evmos } from '@thirdweb-dev/chains'
import { StateContextProvider } from './context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { ErrorBoundary } from 'react-error-boundary'

const root = ReactDOM.createRoot(document.getElementById('root'))
const queryClient = new QueryClient()

function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  )
}

root.render(
  <ThirdwebProvider activeChain={Evmos} clientId="456f8fe77c23b4a8321268e19a65d200">
    <QueryClientProvider client={queryClient}>
      <Router>
        <StateContextProvider>
          <ErrorBoundary
            fallbackRender={fallbackRender}
            onReset={(details) => {
              // Reset the state of your app so the error doesn't happen again
            }}
          >
            <App />
          </ErrorBoundary>
          ;
        </StateContextProvider>
      </Router>
    </QueryClientProvider>
  </ThirdwebProvider>
)
