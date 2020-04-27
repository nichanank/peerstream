// import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { ethers } from 'ethers'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks"
import { NetworkContextName } from './constants'
import ThemeProvider, { GlobalStyle } from './theme'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import App from './pages/App'
import "./index.css";

import ApplicationContextProvider, { Updater as ApplicationContextUpdater } from './contexts/Application'
import TokensContextProvider, { Updater as TokensContextUpdater } from './contexts/Tokens'
// import LocalStorageContextProvider, { Updater as LocalStorageContextUpdater } from './contexts/LocalStorage'

require('./App.css')

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 10000
  return library
}

// optional cofiguration
const alertOptions = {
  // you can also just use 'bottom center'
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}


// This is the official Sablier subgraph. You can replace it with your own, if you need to.
// See all subgraphs: https://thegraph.com/explorer/
const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/sablierhq/sablier",
});


function ContextProviders({ children }) {
  return (
    // <LocalStorageContextProvider>
      <ApplicationContextProvider>
        <TokensContextProvider>
            {children}
        </TokensContextProvider>
      </ApplicationContextProvider>
    /* </LocalStorageContextProvider> */
  )
}

function Updaters() {
  return (
    <>
      {/* <LocalStorageContextUpdater /> */}
      <ApplicationContextUpdater />
    </>
  )
}

ReactDOM.render(
      <Web3ReactProvider
        getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <ContextProviders>
            <Updaters />
            <ThemeProvider>
              {/* <GlobalStyle /> */}
              <ApolloProvider client={client}>
                <AlertProvider template={AlertTemplate} {...alertOptions}>
                  <App />
                </AlertProvider>
              </ApolloProvider>
          </ThemeProvider>
          </ContextProviders>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
  , document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
