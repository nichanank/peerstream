// Adapted from https://github.com/Uniswap/uniswap-frontend/blob/prod/src/contexts/Tokens.js

import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'

import { useWeb3React } from '../hooks'
import {
  isAddress,
  getTokenName,
  getTokenSymbol,
  getTokenDecimals,
  safeAccess
} from '../utils'

const NAME = 'name'
const SYMBOL = 'symbol'
const DECIMALS = 'decimals'

const UPDATE = 'UPDATE'

const ETH = {
  ETH: {
    [NAME]: 'Ethereum',
    [SYMBOL]: 'ETH',
    [DECIMALS]: 18,
  }
}

export const INITIAL_TOKENS_CONTEXT = {
  1: {
    '0xB6eD7644C69416d67B522e20bC294A9a9B405B31': {
      [NAME]: '0xBitcoin Token',
      [SYMBOL]: '0xBTC',
      [DECIMALS]: 8,
    },
    '0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d': {
      [NAME]: 'Aave Interest bearing DAI',
      [SYMBOL]: 'aDAI',
      [DECIMALS]: 18,
    },
    '0xcD62b1C403fa761BAadFC74C525ce2B51780b184': {
      [NAME]: 'Aragon Network Juror',
      [SYMBOL]: 'ANJ',
      [DECIMALS]: 18,
    },
    '0x960b236A07cf122663c4303350609A66A7B288C0': {
      [NAME]: 'Aragon Network Token',
      [SYMBOL]: 'ANT',
      [DECIMALS]: 18,
    },
    '0x0D8775F648430679A709E98d2b0Cb6250d2887EF': {
      [NAME]: 'Basic Attention Token',
      [SYMBOL]: 'BAT',
      [DECIMALS]: 18,
    },
    '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C': {
      [NAME]: 'Bancor Network Token',
      [SYMBOL]: 'BNT',
      [DECIMALS]: 18,
    },
    '0x26E75307Fc0C021472fEb8F727839531F112f317': {
      [NAME]: 'Crypto20',
      [SYMBOL]: 'C20',
      [DECIMALS]: 18,
    },
    '0x4F9254C83EB525f9FCf346490bbb3ed28a81C667': {
      [NAME]: 'CelerToken',
      [SYMBOL]: 'CELR',
      [DECIMALS]: 18,
    },
    '0xF5DCe57282A584D2746FaF1593d3121Fcac444dC': {
      [NAME]: 'Compound Dai',
      [SYMBOL]: 'cSAI',
      [DECIMALS]: 8,
    },
    '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643': {
      [NAME]: 'Compound Dai',
      [SYMBOL]: 'cDAI',
      [DECIMALS]: 8,
    },
    '0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d': {
      [NAME]: 'Celsius',
      [SYMBOL]: 'CEL',
      [DECIMALS]: 4,
    },
    '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215': {
      [NAME]: 'Chai',
      [SYMBOL]: 'CHAI',
      [DECIMALS]: 18,
    },
    '0x41e5560054824eA6B0732E656E3Ad64E20e94E45': {
      [NAME]: 'Civic',
      [SYMBOL]: 'CVC',
      [DECIMALS]: 8,
    },
    '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359': {
      [NAME]: 'Dai Stablecoin v1.0 (SAI)',
      [SYMBOL]: 'SAI',
      [DECIMALS]: 18,
    },
    '0x6B175474E89094C44Da98b954EedeAC495271d0F': {
      [NAME]: 'Dai Stablecoin',
      [SYMBOL]: 'DAI',
      [DECIMALS]: 18,
    },
    '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A': {
      [NAME]: 'DigixDAO',
      [SYMBOL]: 'DGD',
      [DECIMALS]: 9,
    },
    '0x4f3AfEC4E5a3F2A6a1A411DEF7D7dFe50eE057bF': {
      [NAME]: 'Digix Gold Token',
      [SYMBOL]: 'DGX',
      [DECIMALS]: 9,
    },
    '0xc719d010B63E5bbF2C0551872CD5316ED26AcD83': {
      [NAME]: 'Decentralized Insurance Protocol',
      [SYMBOL]: 'DIP',
      [DECIMALS]: 18,
    },
    '0xC0F9bD5Fa5698B6505F643900FFA515Ea5dF54A9': {
      [NAME]: 'Donut',
      [SYMBOL]: 'DONUT',
      [DECIMALS]: 18,
    },
    '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c': {
      [NAME]: 'Enjin Coin',
      [SYMBOL]: 'ENJ',
      [DECIMALS]: 18,
    },
    '0x06f65b8CfCb13a9FE37d836fE9708dA38Ecb29B2': {
      [NAME]: 'SAINT FAME: Genesis Shirt',
      [SYMBOL]: 'FAME',
      [DECIMALS]: 18,
    },
    '0x4946Fcea7C692606e8908002e55A582af44AC121': {
      [NAME]: 'FOAM Token',
      [SYMBOL]: 'FOAM',
      [DECIMALS]: 18,
    },
    '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b': {
      [NAME]: 'FunFair',
      [SYMBOL]: 'FUN',
      [DECIMALS]: 8,
    },
    '0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf': {
      [NAME]: 'DAOstack',
      [SYMBOL]: 'GEN',
      [DECIMALS]: 18,
    },
    '0x6810e776880C02933D47DB1b9fc05908e5386b96': {
      [NAME]: 'Gnosis Token',
      [SYMBOL]: 'GNO',
      [DECIMALS]: 18,
    },
    '0x12B19D3e2ccc14Da04FAe33e63652ce469b3F2FD': {
      [NAME]: 'GRID Token',
      [SYMBOL]: 'GRID',
      [DECIMALS]: 12,
    },
    '0xdd974D5C2e2928deA5F71b9825b8b646686BD200': {
      [NAME]: 'Kyber Network Crystal',
      [SYMBOL]: 'KNC',
      [DECIMALS]: 18,
    },
    '0x514910771AF9Ca656af840dff83E8264EcF986CA': {
      [NAME]: 'ChainLink Token',
      [SYMBOL]: 'LINK',
      [DECIMALS]: 18,
    },
    '0x6c6EE5e31d828De241282B9606C8e98Ea48526E2': {
      [NAME]: 'HoloToken',
      [SYMBOL]: 'HOT',
      [DECIMALS]: 18,
    },
    '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD': {
      [NAME]: 'LoopringCoin V2',
      [SYMBOL]: 'LRC',
      [DECIMALS]: 18,
    },
    '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03': {
      [NAME]: 'EthLend Token',
      [SYMBOL]: 'LEND',
      [DECIMALS]: 18,
    },
    '0xA4e8C3Ec456107eA67d3075bF9e3DF3A75823DB0': {
      [NAME]: 'LoomToken',
      [SYMBOL]: 'LOOM',
      [DECIMALS]: 18,
    },
    '0x58b6A8A3302369DAEc383334672404Ee733aB239': {
      [NAME]: 'Livepeer Token',
      [SYMBOL]: 'LPT',
      [DECIMALS]: 18,
    },
    '0xD29F0b5b3F50b07Fe9a9511F7d86F4f4bAc3f8c4': {
      [NAME]: 'Liquidity.Network Token',
      [SYMBOL]: 'LQD',
      [DECIMALS]: 18,
    },
    '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942': {
      [NAME]: 'Decentraland MANA',
      [SYMBOL]: 'MANA',
      [DECIMALS]: 18,
    },
    '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0': {
      [NAME]: 'Matic Token',
      [SYMBOL]: 'MATIC',
      [DECIMALS]: 18,
    },
    '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2': {
      [NAME]: 'Maker',
      [SYMBOL]: 'MKR',
      [DECIMALS]: 18,
    },
    '0xec67005c4E498Ec7f55E092bd1d35cbC47C91892': {
      [NAME]: 'Melon Token',
      [SYMBOL]: 'MLN',
      [DECIMALS]: 18,
    },
    '0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671': {
      [NAME]: 'Numeraire',
      [SYMBOL]: 'NMR',
      [DECIMALS]: 18,
    },
    '0x4575f41308EC1483f3d399aa9a2826d74Da13Deb': {
      [NAME]: 'Orchid',
      [SYMBOL]: 'OXT',
      [DECIMALS]: 18,
    },
    '0x6758B7d441a9739b98552B373703d8d3d14f9e62': {
      [NAME]: 'POA ERC20 on Foundation',
      [SYMBOL]: 'POA20',
      [DECIMALS]: 18,
    },
    '0x99ea4dB9EE77ACD40B119BD1dC4E33e1C070b80d': {
      [NAME]: 'Quantstamp Token',
      [SYMBOL]: 'QSP',
      [DECIMALS]: 18,
    },
    '0x255Aa6DF07540Cb5d3d297f0D0D4D84cb52bc8e6': {
      [NAME]: 'Raiden Token',
      [SYMBOL]: 'RDN',
      [DECIMALS]: 18,
    },
    '0x408e41876cCCDC0F92210600ef50372656052a38': {
      [NAME]: 'Republic Token',
      [SYMBOL]: 'REN',
      [DECIMALS]: 18,
    },
    '0x1985365e9f78359a9B6AD760e32412f4a445E862': {
      [NAME]: 'Reputation',
      [SYMBOL]: 'REP',
      [DECIMALS]: 18,
    },
    '0x607F4C5BB672230e8672085532f7e901544a7375': {
      [NAME]: 'iEx.ec Network Token',
      [SYMBOL]: 'RLC',
      [DECIMALS]: 9,
    },
    '0xB4EFd85c19999D84251304bDA99E90B92300Bd93': {
      [NAME]: 'Rocket Pool',
      [SYMBOL]: 'RPL',
      [DECIMALS]: 18,
    },
    '0x4156D3342D5c385a87D264F90653733592000581': {
      [NAME]: 'Salt',
      [SYMBOL]: 'SALT',
      [DECIMALS]: 8,
    },
    '0x744d70FDBE2Ba4CF95131626614a1763DF805B9E': {
      [NAME]: 'Status Network Token',
      [SYMBOL]: 'SNT',
      [DECIMALS]: 18,
    },
    '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F': {
      [NAME]: 'Synthetix Network Token',
      [SYMBOL]: 'SNX',
      [DECIMALS]: 18,
    },
    '0x23B608675a2B2fB1890d3ABBd85c5775c51691d5': {
      [NAME]: 'Unisocks Edition 0',
      [SYMBOL]: 'SOCKS',
      [DECIMALS]: 18,
    },
    '0x42d6622deCe394b54999Fbd73D108123806f6a18': {
      [NAME]: 'SPANK',
      [SYMBOL]: 'SPANK',
      [DECIMALS]: 18,
    },
    '0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC': {
      [NAME]: 'StorjToken',
      [SYMBOL]: 'STORJ',
      [DECIMALS]: 8,
    },
    '0x0000000000085d4780B73119b644AE5ecd22b376': {
      [NAME]: 'TrueUSD',
      [SYMBOL]: 'TUSD',
      [DECIMALS]: 18,
    },
    '0x09cabEC1eAd1c0Ba254B09efb3EE13841712bE14': {
      [NAME]: 'Uniswap V1',
      [SYMBOL]: 'UNI-V1:SAI',
      [DECIMALS]: 18,
    },
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': {
      [NAME]: 'USD//C',
      [SYMBOL]: 'USDC',
      [DECIMALS]: 6,
    },
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': {
      [NAME]: 'Wrapped BTC',
      [SYMBOL]: 'WBTC',
      [DECIMALS]: 8,
    },
    '0x09fE5f0236F0Ea5D930197DCE254d77B04128075': {
      [NAME]: 'Wrapped CryptoKitties',
      [SYMBOL]: 'WCK',
      [DECIMALS]: 18,
    },
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': {
      [NAME]: 'Wrapped Ether',
      [SYMBOL]: 'WETH',
      [DECIMALS]: 18,
    },
    '0xE41d2489571d322189246DaFA5ebDe1F4699F498': {
      [NAME]: '0x Protocol Token',
      [SYMBOL]: 'ZRX',
      [DECIMALS]: 18,
    }
  },
  4: {
    '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa': {
      [NAME]: 'Dai',
      [SYMBOL]: 'DAI',
      [DECIMALS]: 18,
    },
    '0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8': {
      [NAME]: 'TestnetDAI',
      [SYMBOL]: 'DAI',
      [DECIMALS]: 18,
    }
  }
}

const TokensContext = createContext()

function useTokensContext() {
  return useContext(TokensContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { networkId, tokenAddress, name, symbol, decimals } = payload
      return {
        ...state,
        [networkId]: {
          ...(safeAccess(state, [networkId]) || {}),
          [tokenAddress]: {
            [NAME]: name,
            [SYMBOL]: symbol,
            [DECIMALS]: decimals,
          }
        }
      }
    }
    default: {
      throw Error(`Unexpected action type in TokensContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_TOKENS_CONTEXT)

  const update = useCallback((networkId, tokenAddress, name, symbol, decimals) => {
    dispatch({ type: UPDATE, payload: { networkId, tokenAddress, name, symbol, decimals } })
  }, [])

  return (
    <TokensContext.Provider value={useMemo(() => [state, { update }], [state, update])}>
      {children}
    </TokensContext.Provider>
  )
}

export function useTokenDetails(tokenAddress) {
  const { library, chainId } = useWeb3React()

  const [state, { update }] = useTokensContext()
  const allTokensInNetwork = { ...ETH, ...(safeAccess(state, [chainId]) || {}) }
  const { [NAME]: name, [SYMBOL]: symbol, [DECIMALS]: decimals } =
    safeAccess(allTokensInNetwork, [tokenAddress]) || {}

  useEffect(() => {
    if (
      isAddress(tokenAddress) &&
      (name === undefined || symbol === undefined || decimals === undefined) &&
      (chainId || chainId === 0) &&
      library
    ) {
      let stale = false
      const namePromise = getTokenName(tokenAddress, library).catch(() => null)
      const symbolPromise = getTokenSymbol(tokenAddress, library).catch(() => null)
      const decimalsPromise = getTokenDecimals(tokenAddress, library).catch(() => null)

      Promise.all([namePromise, symbolPromise, decimalsPromise]).then(
        ([resolvedName, resolvedSymbol, resolvedDecimals]) => {
          if (!stale) {
            update(chainId, tokenAddress, resolvedName, resolvedSymbol, resolvedDecimals)
          }
        }
      )
      return () => {
        stale = true
      }
    }
  }, [tokenAddress, name, symbol, decimals, chainId, library, update])

  return { name, symbol, decimals }
}

export function useAllTokenDetails() {
  const { chainId } = useWeb3React()

  const [state] = useTokensContext()

  return useMemo(() => ({ ...ETH, ...(safeAccess(state, [chainId]) || {}) }), [state, chainId])
}