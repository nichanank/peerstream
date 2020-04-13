import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from './Network'

export const injected = new InjectedConnector({
  supportedChainIds: [1, 4, 5, 6, 1337, 5777]
})

const POLLING_INTERVAL = 10000
const RPC_URLS = {
  1: "https://mainnet.infura.io/v3/60ab76e16df54c808e50a79975b4779f",
  4: "https://rinkeby.infura.io/v3/60ab76e16df54c808e50a79975b4779f",
}

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[1], 4: RPC_URLS[4] },
  defaultChainId: 1,
  pollingInterval: POLLING_INTERVAL
})