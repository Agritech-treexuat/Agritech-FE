import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import { Evmos } from "@thirdweb-dev/chains";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { StateContextProvider } from './context';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient()

root.render(
  <ThirdwebProvider activeChain={Evmos} clientId="456f8fe77c23b4a8321268e19a65d200" >
      <Router>
        <StateContextProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </StateContextProvider>
      </Router>
  </ThirdwebProvider>
)
