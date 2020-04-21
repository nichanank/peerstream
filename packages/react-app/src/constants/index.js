import { injected } from '../connectors'

export const NetworkContextName = 'NETWORK'

export const CONTRACT_NAMES = {
  SABLIER: 'Sablier',
}

export const SUPPORTED_WALLETS = {
  INJECTED: {
    connector: injected,
    id: 'Injected',
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    color: '#010101'
  },
  METAMASK: {
    connector: injected,
    id: 'MetaMask',
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    color: '#E8831D'
  },
}