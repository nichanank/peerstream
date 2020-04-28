  
import React from 'react'
import styled from 'styled-components'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { darken } from 'polished'
import { Activity } from 'react-feather'
import { useENSName } from '../../hooks'

import { injected } from '../../connectors'
import { NetworkContextName } from '../../constants'
import { useWalletModalToggle } from '../../contexts/Application'

import WalletModal from '../WalletModal'

const Web3StatusGeneric = styled.button`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  font-size: 0.3rem;
  align-items: center;
  padding: 0.5rem;
  border-radius: 2rem;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.primaryGreen};
  border: 1px solid ${({ theme }) => theme.primaryGreen};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.secondaryGreen)};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.primaryGreen};
  border: 1px solid ${({ theme }) => theme.primaryGreen};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.secondaryGreen)};
  }
`

const Web3StatusConnected = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.primaryGreen};
  border: 1px solid ${({ theme }) => theme.primaryGreen};
  color: ${({ theme }) => theme.white};
  font-weight: 400;
  :hover {
    background-color: ${({ theme }) => darken(0.1, theme.secondaryGreen)};
  }
  :focus {
    border: 1px solid
    ${({ theme }) => theme.primaryGreen};
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 0.83rem;
`

const Identicon = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
  background-color: ${({ theme }) => theme.tertiaryGreen};
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

export default function Web3Status() {
  const { active, account, connector, error } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const ENSName = useENSName(account)

  const toggleWalletModal = useWalletModalToggle()

  // handle the logo we want to show with the account
  function getStatusIcon() {
    if (connector === injected) {
      return <Identicon />
    }
  }

  function getWeb3Status() {
    if (account) {
      return (
        <Web3StatusConnected onClick={toggleWalletModal}>
          <Text>{ENSName || account}</Text>
          {getStatusIcon()}
        </Web3StatusConnected>
      )
    } else if (error) {
      return (
        <Web3StatusError onClick={toggleWalletModal}>
          <NetworkIcon />
          <Text>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}</Text>
        </Web3StatusError>
      )
    } else {
      return (
        <Web3StatusConnect onClick={toggleWalletModal} faded={!account}>
          <Text>{'Connect to a Wallet'}</Text>
        </Web3StatusConnect>
      )
    }
  }

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      {getWeb3Status()}
      <WalletModal ENSName={ENSName} />
    </>
  )
}