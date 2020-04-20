import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { injected } from '../connectors'
import { NetworkContextName } from '../constants'
import { getContract, getERC20Contract, getEvents, getStreamEventsBetween, isAddress } from '../utils'
import copy from 'copy-to-clipboard'

export function useWeb3React() {
  const context = useWeb3ReactCore()
  const contextNetwork = useWeb3ReactCore(NetworkContextName)

  return context.active ? context : contextNetwork
}

export function useEagerConnect() {
  const { activate, active } = useWeb3ReactCore()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
  }, [activate]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3ReactCore() // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    const { ethereum } = window

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleNetworkChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch(() => {})
      }

      const handleAccountsChanged = accounts => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch(() => {})
        }
      }

      ethereum.on('networkChanged', handleNetworkChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        ethereum.removeListener('networkChanged', handleNetworkChanged)
        ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }

    return () => {}
  }, [active, error, suppress, activate])
}

export function useEvents(filter) {
  const { library } = useWeb3React()

  return useMemo(() => {
    try {
      return getEvents(library, filter)
    } catch {
      return null
    }
  }, [library, filter])
}

// returns null on errors
export function useContract(contractName, withSignerIfPossible = true) {
  const { chainId, library, account } = useWeb3React()

  return useMemo(() => {
    try {
      return getContract(chainId, library, contractName, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [chainId, contractName, library, withSignerIfPossible, account])
}

export function useERC20Contract(tokenAddress, withSignerIfPossible = true) {
  const { library, account } = useWeb3React()

  return useMemo(() => {
    try {
      return getERC20Contract(tokenAddress, library, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [tokenAddress, library, withSignerIfPossible, account])
}

export function useStreamEventsBetween(sender, recipient, withSignerIfPossible = true) {
  const { library, account, chainId } = useWeb3React()

  return useMemo(() => {
    try {
      return getStreamEventsBetween(chainId, library, sender, recipient, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [chainId, library, sender, recipient, withSignerIfPossible, account])
}

export function useENSName(address) {
  const { library } = useWeb3React()

  const [ENSName, setENSNname] = useState()

  useEffect(() => {
    if (isAddress(address)) {
      let stale = false
      try {
        library.lookupAddress(address).then(name => {
          if (!stale) {
            if (name) {
              setENSNname(name)
            } else {
              setENSNname(null)
            }
          }
        })
      } catch {
        setENSNname(null)
      }

      return () => {
        stale = true
        setENSNname()
      }
    }
  }, [library, address])

  return ENSName
}

export function useCopyClipboard(timeout = 500) {
  const [isCopied, setIsCopied] = useState(false)

  const staticCopy = useCallback(text => {
    const didCopy = copy(text)
    setIsCopied(didCopy)
  }, [])

  useEffect(() => {
    if (isCopied) {
      const hide = setTimeout(() => {
        setIsCopied(false)
      }, timeout)

      return () => {
        clearTimeout(hide)
      }
    }
  }, [isCopied, setIsCopied, timeout])

  return [isCopied, staticCopy]
}

// modified from https://usehooks.com/useKeyPress/
export function useModalKeyDown(targetKey, onKeyDown, suppressOnKeyDown = false) {
  const downHandler = useCallback(
    event => {
      const {
        target: { tagName },
        key
      } = event
      if (key === targetKey && tagName === 'DIV' && !suppressOnKeyDown) {
        event.preventDefault()
        onKeyDown()
      }
    },
    [targetKey, onKeyDown, suppressOnKeyDown]
  )

  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    return () => {
      window.removeEventListener('keydown', downHandler)
    }
  }, [downHandler])
}

// modified from https://usehooks.com/usePrevious/
export function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef()

  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current
}