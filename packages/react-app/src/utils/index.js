import { ethers } from 'ethers'
import { addresses, abis } from "@sablier-app/contracts";
import UncheckedJsonRpcSigner from './signer'
// import { formatFixed } from '@uniswap/sdk'

const ETHERSCAN_PREFIXES = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.'
}

const etherscanTypes = {
  address: 'address',
  token: 'token',
  transaction: 'tx'
}

export const ERROR_CODES = ['TOKEN_NAME', 'TOKEN_SYMBOL', 'TOKEN_DECIMALS'].reduce(
  (accumulator, currentValue, currentIndex) => {
    accumulator[currentValue] = currentIndex
    return accumulator
  }, {}
)

export function safeAccess(object, path) {
  return object
    ? path.reduce(
        (accumulator, currentValue) => (accumulator && accumulator[currentValue] ? accumulator[currentValue] : null),
        object
      )
    : null
}

export function isAddress(value) {
  try {
    return ethers.utils.getAddress(value)
  } catch {
    return false
  }
}

export async function getEvents(library, filter) {
  return library.getLogs(filter)
}

export function getProviderOrSigner(library, account) {
  return account ? new UncheckedJsonRpcSigner(library.getSigner(account)) : library
}

export function getContract(chainId, library, contractName, account) {
  switch (contractName) {
    case "Sablier":
      return new ethers.Contract(addresses[chainId].sablier, abis.sablier, getProviderOrSigner(library, account));
    default:
      return null
  }
}

export function getERC20Contract(address, library, account) {
  return new ethers.Contract(address, abis.erc20, getProviderOrSigner(library, account));
}

export async function getTokenName(tokenAddress, library) {
  if (!isAddress(tokenAddress)) {
    throw Error(`Invalid 'tokenAddress' parameter '${tokenAddress}'.`)
  }

  return getContract(tokenAddress, abis.erc20, library)
    .name()
    .catch(() =>
      getContract(tokenAddress, abis.erc20_bytes32, library)
        .name()
        .then(bytes32 => ethers.utils.parseBytes32String(bytes32))
    )
    .catch(error => {
      error.code = ERROR_CODES.TOKEN_SYMBOL
      throw error
    })
}

export async function getStreamEventsBetween(chainId, library, sender, recipient, account) { //chainId, library, contractName, account
  const sablier = getContract(chainId, library, "Sablier", account)
  const filter = sablier.filters.CreateStream(null, sender, recipient)
  filter.fromBlock = 0
  filter.toBlock = "latest"
  return getEvents(library, filter)
}

export async function getStreamEventsTo(chainId, library, account) {
  const sablier = getContract(chainId, library, "Sablier", account)
  const filter = sablier.filters.CreateStream(null, null, account)
  filter.fromBlock = 0
  filter.toBlock = "latest"
  return getEvents(library, filter)
}

export async function getTokenSymbol(tokenAddress, library) {
  if (!isAddress(tokenAddress)) {
    throw Error(`Invalid 'tokenAddress' parameter '${tokenAddress}'.`)
  }

  return getContract(tokenAddress, abis.erc20, library)
    .symbol()
    .catch(() => {
      const contractBytes32 = getContract(tokenAddress, abis.erc20_bytes32, library)
      return contractBytes32.symbol().then(bytes32 => ethers.utils.parseBytes32String(bytes32))
    })
    .catch(error => {
      error.code = ERROR_CODES.TOKEN_SYMBOL
      throw error
    })
}

// get token decimals
export async function getTokenDecimals(tokenAddress, library) {
  if (!isAddress(tokenAddress)) {
    throw Error(`Invalid 'tokenAddress' parameter '${tokenAddress}'.`)
  }

  return getContract(tokenAddress, abis.erc20, library)
    .decimals()
    .catch(error => {
      error.code = ERROR_CODES.TOKEN_DECIMALS
      throw error
    })
}

export function shortenAddress(address, digits = 4) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${address.substring(0, digits + 2)}...${address.substring(42 - digits)}`
}

export function shortenTransactionHash(hash, digits = 4) {
  return `${hash.substring(0, digits + 2)}...${hash.substring(66 - digits)}`
}

export function calculateGasMargin(value, margin) {
  const offset = value.mul(margin).div(ethers.utils.bigNumberify(10000))
  return value.add(offset)
}

export function formatEthBalance(balance) {
  return amountFormatter(balance, 18, 6)
}

// export function formatToUsd(price) {
//   const format = { decimalSeparator: '.', groupSeparator: ',', groupSize: 3 }
//   const usdPrice = formatFixed(price, {
//     decimalPlaces: 2,
//     dropTrailingZeros: false,
//     format
//   })
//   return usdPrice
// }

export function formatTokenBalance(balance, decimal) {
  return !!(balance && Number.isInteger(decimal)) ? amountFormatter(balance, decimal, Math.min(4, decimal)) : 0
}

// amount must be a BigNumber, {base,display}Decimals must be Numbers
export function amountFormatter(amount, baseDecimals = 18, displayDecimals = 3, useLessThan = true) {
  if (baseDecimals > 18 || displayDecimals > 18 || displayDecimals > baseDecimals) {
    throw Error(`Invalid combination of baseDecimals '${baseDecimals}' and displayDecimals '${displayDecimals}.`)
  }

  // if balance is falsy, return undefined
  if (!amount) {
    return undefined
  }
  // if amount is 0, return
  else if (amount.isZero()) {
    return '0'
  }
  // amount > 0
  else {
    // amount of 'wei' in 1 'ether'
    const baseAmount = ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(baseDecimals))

    const minimumDisplayAmount = baseAmount.div(
      ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(displayDecimals))
    )

    // if balance is less than the minimum display amount
    if (amount.lt(minimumDisplayAmount)) {
      return useLessThan
        ? `<${ethers.utils.formatUnits(minimumDisplayAmount, baseDecimals)}`
        : `${ethers.utils.formatUnits(amount, baseDecimals)}`
    }
    // if the balance is greater than the minimum display amount
    else {
      const stringAmount = ethers.utils.formatUnits(amount, baseDecimals)

      // if there isn't a decimal portion
      if (!stringAmount.match(/\./)) {
        return stringAmount
      }
      // if there is a decimal portion
      else {
        const [wholeComponent, decimalComponent] = stringAmount.split('.')
        const roundUpAmount = minimumDisplayAmount.div(ethers.constants.Two)
        const roundedDecimalComponent = ethers.utils
          .bigNumberify(decimalComponent.padEnd(baseDecimals, '0'))
          .add(roundUpAmount)
          .toString()
          .padStart(baseDecimals, '0')
          .substring(0, displayDecimals)

        // decimals are too small to show
        if (roundedDecimalComponent === '0'.repeat(displayDecimals)) {
          return wholeComponent
        }
        // decimals are not too small to show
        else {
          return `${wholeComponent}.${roundedDecimalComponent.toString().replace(/0*$/, '')}`
        }
      }
    }
  }
}