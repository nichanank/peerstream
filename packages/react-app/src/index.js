// import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'
import { ethers } from 'ethers'
import { NetworkContextName } from './constants'
import App from './pages/App'

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import "./index.css";

// import LocalStorageContextProvider, { Updater as LocalStorageContextUpdater } from './contexts/LocalStorage'
// import ApplicationContextProvider, { Updater as ApplicationContextUpdater } from './contexts/Application'
// import TransactionContextProvider, { Updater as TransactionContextUpdater } from './contexts/Transactions'

require('./App.css')

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 10000
  return library
}

// This is the official Sablier subgraph. You can replace it with your own, if you need to.
// See all subgraphs: https://thegraph.com/explorer/
const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/sablierhq/sablier",
});


// function ContextProviders({ children }) {
//   return (
//     <LocalStorageContextProvider>
//       <ApplicationContextProvider>
//         <TransactionContextProvider>
//             {children}
//         </TransactionContextProvider>
//       </ApplicationContextProvider>
//     </LocalStorageContextProvider>
//   )
// }

// function Updaters() {
//   return (
//     <>
//       <LocalStorageContextUpdater />
//       <ApplicationContextUpdater />
//       <TransactionContextUpdater />
//     </>
//   )
// }

ReactDOM.render(
      <Web3ReactProvider
        getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          {/* <ContextProviders> */}
            {/* <Updaters /> */}
            {/* <ThemeProvider> */}
              {/* <GlobalStyle /> */}
              <ApolloProvider client={client}>
                <App />
                {/* <div>hi</div> */}
              </ApolloProvider>
          {/* </ThemeProvider> */}
          {/* </ContextProviders> */}
        </Web3ProviderNetwork>
      </Web3ReactProvider>
  , document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
