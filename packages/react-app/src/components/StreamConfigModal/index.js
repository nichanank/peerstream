import React, { useState, useRef, useMemo, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { BigNumber}  from 'bignumber.js'
import styled from 'styled-components'
import { darken } from 'polished'
import { isMobile } from 'react-device-detect'
import escapeStringRegex from 'escape-string-regexp'
import Select from 'react-select'
import { useContract, useERC20Contract } from '../../hooks'
import { calculateGasMargin, getStreamEventsBetween, isAddress } from '../../utils'
import { BorderlessInput } from '../../theme'
import { useTokenDetails, useAllTokenDetails, INITIAL_TOKENS_CONTEXT } from '../../contexts/Tokens'
import Modal from '../Modal'
import TokenIcon from '../TokenIcon'
import { Spinner } from '../../theme'
import { ReactComponent as Close } from '../../assets/img/x.svg'
import Circle from '../../assets/img/circle.svg'

const GAS_MARGIN = ethers.utils.bigNumberify(1000)

// ${({ theme }) => theme.flexRowNoWrap}
//   padding: 4px 50px 4px 15px;
//   margin-right: 15px;
//   line-height: 0;
//   height: 2rem;
//   align-items: center;
//   border-radius: 2.5rem;
//   outline: none;
//   cursor: pointer;
//   user-select: none;
//   background: ${({ theme }) => theme.tertiaryGreen};
//   border: 1px solid ${({ theme }) => theme.primaryGreen};
//   color: ${({ theme }) => theme.primaryGreen};
//   option {
//     color: ${({ theme }) => theme.primaryGreen};
//     background: ${({ theme }) => theme.tertiaryGreen};
//     overflow-y: scroll;
//     display: flex;
//     white-space: pre;
//     min-height: 20px;
//     padding: 0px 2px 1px;
//   }

  const customStyle = {
    container: () => ({
      padding: '4px 50px 4px 15px;',
      'margin-right': '15px;',
      'line-height': '0;',
      'height': '2rem;',
      'align-items': 'center;',
      'border-radius': '2.5rem;',
      'outline': 'none;',
      'cursor': 'pointer;',
      'user-select': 'none;',
      width: '50%',
      'backgroundColor': theme => theme.tertiaryGreen,
      border: '1px solid green',
      color: theme => theme.primaryGreen,
    }),
    option: (provided, state) => ({
      ...provided,
      color: theme => theme.primaryGreen,
      // background: ${({ theme }) => theme.tertiaryGreen},
      background: theme => theme.tertiaryGreen,
      'overflow:-y': 'scroll;',
      display: 'flex;',
      'min-height': '20px;',
      padding: '0px 2px 1px;',
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      width: 500,
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }
  }

const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 0.25rem 0.85rem 0.75rem;
`

const StartStreamButton = styled.button`
  align-items: center;
  font-size: 1rem;
  color: ${({ enabled, theme }) => (enabled ? theme.primaryGreen : theme.textColor)};
  height: 2rem;
  border: 1px solid ${({ enabled, theme }) => (enabled ? theme.primaryGreen : theme.placeholderGray)};
  border-radius: 2.5rem;
  background-color: ${({ enabled, theme }) => (enabled ? theme.secondaryBlue : theme.placeholderGray)};
  outline: none;
  cursor: pointer;
  user-select: none;
  :hover {
    border: 1px solid
      ${({ enabled, theme }) => (enabled ? darken(0.1, theme.primaryGreen) : darken(0.1, theme.placeholderGray))};
  }
  :focus {
    border: 1px solid ${({ theme }) => darken(0.1, theme.primaryGreen)};
  }
  :active {
    background-color: ${({ theme }) => theme.secondaryBlue};
  }
`

const StreamConfigButton = styled.button`
  align-items: center;
  font-size: 1rem;
  color: ${({ enabled, theme }) => (enabled ? theme.primaryGreen : theme.textColor)};
  height: 2rem;
  border: 1px solid ${({ enabled, theme }) => (enabled ? theme.primaryGreen : theme.placeholderGray)};
  border-radius: 2.5rem;
  background-color: ${({ enabled, theme }) => (enabled ? theme.primaryGreen : theme.placeholderGray)};
  outline: none;
  cursor: pointer;
  user-select: none;
  :hover {
    border: 1px solid
      ${({ enabled, theme }) => (enabled ? darken(0.1, theme.primaryGreen) : darken(0.1, theme.placeholderGray))};
  }
  :focus {
    border: 1px solid ${({ theme }) => darken(0.1, theme.primaryGreen)};
  }
  :active {
    background-color: ${({ theme }) => theme.secondaryGreen};
  }
`

const StyledButtonName = styled.span`
  margin: 0 0.25rem 0 0.25rem;
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Option = styled.option`
  color: ${({ theme }) => theme.primaryGreen};
  background: ${({ theme }) => theme.tertiaryGreen};
  display: flex;
  white-space: pre;
  min-height: 20px;
  padding: 0px 2px 1px;
`

const Input = styled(BorderlessInput)`
  font-size: 1.5rem;
  color: ${({ error, theme }) => error && theme.pink};
  background-color: ${({ theme }) => theme.tertiaryGreen};
  -moz-appearance: textfield;
`

const ConfigModal = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  width: 100%;
`

const ModalHeader = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 0px 0px 1rem;
  height: 60px;
  color: ${({ theme }) => theme.black};
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.black};
  }
`

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`






const SearchContainer = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: flex-start;
  padding: 0.5rem 1.5rem;
  background-color: ${({ theme }) => theme.concreteGray};
`

const TokenModalInfo = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 1rem 1.5rem;
  margin: 0.25rem 0.5rem;
  justify-content: center;
  user-select: none;
`

const TokenList = styled.div`
  flex-grow: 1;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`

const TokenModalRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  cursor: pointer;
  user-select: none;
  #symbol {
    color: ${({ theme }) => theme.doveGrey};
  }
  :hover {
    background-color: ${({ theme }) => theme.tokenRowHover};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0.8rem 1rem;
    padding-right: 2rem;
  `}
`

const TokenRowLeft = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items : center;
`

const TokenSymbolGroup = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  margin-left: 1rem;
`

const TokenFullName = styled.div`
  color: ${({ theme }) => theme.chaliceGray};
`

const FadedSpan = styled.span`
  color: ${({ theme }) => theme.royalBlue};
`

const TokenRowBalance = styled.div`
  font-size: 1rem;
  line-height: 20px;
`

const TokenRowUsd = styled.div`
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${({ theme }) => theme.chaliceGray};
`

const TokenRowRight = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: flex-end;
`

const StyledTokenName = styled.span`
  margin: 0 0.25rem 0 0.25rem;
`

const SpinnerWrapper = styled(Spinner)`
  margin: 0 0.25rem 0 0.25rem;
  color: ${({ theme }) => theme.chaliceGray};
  opacity: 0.6;
`



export default function StreamConfigModal({
  errorMessage,
  isOpen,
  onDismiss,
  recipient,  
  hideETH=false
  }) {
  
  const { account, chainId, library } = useWeb3React()
  
  const sablier = useContract("Sablier")
  const testDai = useERC20Contract("0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8")
  
  const allTokens = useAllTokenDetails()
  
  const [deposit, setDeposit] = useState("")
  const [startTime, setStartTime] = useState(0)
  const [stopTime, setStopTime] = useState(0)
  const [selectedToken, setSelectedToken] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [streamHistory, setStreamHistory] = useState([])

  // manage focus on modal show
  const inputRef = useRef()

  function clearInputAndDismiss() {
    setDeposit(0)
    setStartTime(0)
    setStopTime(0)
    setStreamHistory([])
    setSelectedToken()
    onDismiss()
  }

  function onInput(event) {
    const input = event.target.value
    
  }

  useEffect(() => {
    getStreamEventsBetween(chainId, library, account, '0x8aDa904a7Df2088024eabD0de41a880AD9ECe4d3', account).then((streams) => {
      setStreamHistory(streams)
    })
  }, [chainId, library, account, recipient])

  function renderStartStreamButton() {
    if (!deposit || !startTime || !stopTime) {
      return (
        <StartStreamButton enabled={false} disabled>
          <Aligner>
            <StyledButtonName>
              {'startStream'}
            </StyledButtonName>
          </Aligner>
        </StartStreamButton>)
    } else {
      return(
      <StartStreamButton
        enabled={true}
        onClick={async () => {
          console.log(sablier)
          const estimatedGas = await sablier.estimate.createStream(
            recipient,
            deposit,
            selectedToken.address,
            startTime,
            stopTime
          )
          sablier
            .createStream(recipient, deposit, selectedToken.address, startTime, stopTime, {
              gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
            })
            .then(() => {
              clearInputAndDismiss()
            })
          }}
        >
          <Aligner>
          <StyledButtonName>
            {'startStream'}
          </StyledButtonName>
          </Aligner>
      </StartStreamButton>
      )
    }
  }

  const tokenList = useMemo(() => {
    return Object.keys(allTokens)
      .sort((a, b) => {
        if (allTokens[a].symbol && allTokens[b].symbol) {
          const aSymbol = allTokens[a].symbol.toLowerCase()
          const bSymbol = allTokens[b].symbol.toLowerCase()

          // pin ETH to top
          if (aSymbol === 'ETH'.toLowerCase() || bSymbol === 'ETH'.toLowerCase()) {
            return aSymbol === bSymbol ? 0 : aSymbol === 'ETH'.toLowerCase() ? -1 : 1
          }

          // sort alphabetically
          return aSymbol < bSymbol ? -1 : aSymbol > bSymbol ? 1 : 0
        } else {
          return 0
        }
      })
      .map(k => {
        return {
          name: allTokens[k].name,
          symbol: allTokens[k].symbol,
          address: k,
        }
      })
  }, [allTokens])

  const filteredTokenList = useMemo(() => {
    const list = tokenList.filter(tokenEntry => {
      const inputIsAddress = searchQuery.slice(0, 2) === '0x'

      // check the regex for each field
      const regexMatches = Object.keys(tokenEntry).map(tokenEntryKey => {
        // if address field only search if input starts with 0x
        if (tokenEntryKey === 'address') {
          return (
            inputIsAddress &&
            typeof tokenEntry[tokenEntryKey] === 'string' &&
            !!tokenEntry[tokenEntryKey].match(new RegExp(escapeStringRegex(searchQuery), 'i'))
          )
        }
        return (
          typeof tokenEntry[tokenEntryKey] === 'string' &&
          !!tokenEntry[tokenEntryKey].match(new RegExp(escapeStringRegex(searchQuery), 'i'))
        )
      })
      return regexMatches.some(m => m)
    })
    // If the user has not inputted anything, preserve previous sort
    if (searchQuery === '') return list
    return list.sort((a, b) => {
      return a.symbol.toLowerCase() === searchQuery.toLowerCase() ? -1 : 1
    })
  }, [tokenList, searchQuery])

  function renderTokenList() {
    if (!filteredTokenList.length) {
      return <TokenModalInfo>{'notFound'}</TokenModalInfo>
    }

    return filteredTokenList.map(({ address, symbol, name, balance, usdBalance }) => {
      // const urlAdded = urlAddedTokens && urlAddedTokens.hasOwnProperty(address)
      const customAdded =
        address !== 'ETH' &&
        INITIAL_TOKENS_CONTEXT[chainId] &&
        !INITIAL_TOKENS_CONTEXT[chainId].hasOwnProperty(address)
        //  && !urlAdded

      if (hideETH && address === 'ETH') {
        return null
      }

      return (
        // <TokenModalRow key={address} onClick={() => _onTokenSelect(address)}>
        <TokenModalRow key={address} onClick={() => setSelectedToken({address})}>
          <TokenRowLeft>
            <TokenIcon address={address} size={'2rem'} />
            <TokenSymbolGroup>
              {/* <div>
                <span id="symbol">{symbol}</span>
                <FadedSpan>
                  {urlAdded && '(Added by URL)'} {customAdded && '(Added by user)'}
                </FadedSpan>
              </div> */}
              <TokenFullName> {name}</TokenFullName>
            </TokenSymbolGroup>
          </TokenRowLeft>
          <TokenRowRight>
            {balance ? (
              <TokenRowBalance>{balance && (balance > 0 || balance === '<0.0001') ? balance : '-'}</TokenRowBalance>
            ) : account ? (
              <SpinnerWrapper src={Circle} alt="loader" />
            ) : (
              '-'
            )}
            {/* <TokenRowUsd>
              {usdBalance && !usdBalance.isNaN()
                ? usdBalance.isZero()
                  ? ''
                  : usdBalance.lt(0.01)
                  ? '<$0.01'
                  : '$' + formatToUsd(usdBalance)
                : ''}
            </TokenRowUsd> */}
          </TokenRowRight>
        </TokenModalRow>
      )
    })
  }
  
  return (
    <Modal
      isOpen={isOpen}
      onDismiss={clearInputAndDismiss}
      minHeight={60}
      initialFocusRef={isMobile ? undefined : inputRef}
    >
    <ConfigModal>
        <ModalHeader>
          <p>Start a stream with {recipient}</p>
          <CloseIcon onClick={clearInputAndDismiss}>
            <CloseColor alt={'close icon'} />
          </CloseIcon>
        </ModalHeader>
        <InputRow>
        {/* <Select onChange={e => setSelectedToken(e.target.value)}>
          <Option value="" hidden>Token</Option>
        { tokenList.length > 0 ? tokenList.map((token, index) => <Option key={index} value={token}>{token.name}</Option>) : null}
        </Select> */}
        <Select style={customStyle} options={tokenList.map((token) => {
          return {
            label: token.name,
            value: token.symbol
          } 
        })} />
        <Aligner>
            
          </Aligner>
      </InputRow>
        <InputRow>
        <Input
          ref={inputRef}
          type="number"
          min="0"
          error={!!errorMessage}
          placeholder={'enter deposit amount'}
          step="1"
          onChange={e => setDeposit(e.target.value)}
          onKeyPress={e => {
            const charCode = e.which ? e.which : e.keyCode

            // Prevent 'minus' character
            if (charCode === 45) {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
          value={deposit}
        />
        <Input
          ref={inputRef}
          type="number"
          min="0"
          error={!!errorMessage}
          placeholder="Max. Mintable (population limit)"
          step="1"
          onChange={e => setStartTime(e.target.value)}
          onKeyPress={e => {
            const charCode = e.which ? e.which : e.keyCode

            // Prevent 'minus' character
            if (charCode === 45) {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
          value={startTime}
        />
        <Input
          ref={inputRef}
          type="number"
          min="0"
          error={!!errorMessage}
          placeholder="Max. Mintable (population limit)"
          step="1"
          onChange={e => setStopTime(e.target.value)}
          onKeyPress={e => {
            const charCode = e.which ? e.which : e.keyCode

            // Prevent 'minus' character
            if (charCode === 45) {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
          value={stopTime}
        />
      </InputRow>
      <InputRow>
          <Aligner>
            {renderStartStreamButton()}
          </Aligner>
      </InputRow>
      <InputRow>
          <Aligner>
          <StreamConfigButton onClick={async () => {
            const now = Math.round(new Date().getTime() / 1000); // get seconds since unix epoch
            const testStart = now + 200
            const testStop = now + 1000 + 200
            const amount = "9000"
            setDeposit(amount)
            setStartTime(testStart)
            setStopTime(testStop)
            setSelectedToken('0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8') //testnetDAI
            const estimatedGas = await testDai.estimate.approve('0xc04Ad234E01327b24a831e3718DBFcbE245904CC', Number(amount))
            const approveTx = await testDai.approve('0xc04Ad234E01327b24a831e3718DBFcbE245904CC', Number(amount), {
              gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
            })
            console.log(approveTx)
          }}>Approve test DAI</StreamConfigButton> 
          <StreamConfigButton onClick={async () => {
            const estimatedGas = await sablier.estimate.createStream('0x8aDa904a7Df2088024eabD0de41a880AD9ECe4d3', deposit, selectedToken, startTime, stopTime)
            const streamTx = sablier
              .createStream('0x8aDa904a7Df2088024eabD0de41a880AD9ECe4d3', deposit, selectedToken, startTime, stopTime, {
                gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
              })
            console.log(streamTx)
          }}>Start test stream</StreamConfigButton> 
          <StreamConfigButton onClick={async () => {
            const stream = await sablier.getStream(parseInt(streamHistory[streamHistory.length-1].topics[1]));
            console.log(stream)
            const balance = await sablier.balanceOf(parseInt(streamHistory[streamHistory.length-1].topics[1]), '0x8aDa904a7Df2088024eabD0de41a880AD9ECe4d3');
            console.log(balance)

          }}>Get stream info</StreamConfigButton>
          <StreamConfigButton onClick={async () => {
            const estimatedGas = await sablier.estimate.cancelStream(parseInt(streamHistory[streamHistory.length-1].topics[1]))
            const cancelStreamTx = await sablier.cancelStream(parseInt(streamHistory[streamHistory.length-1].topics[1]), {
              gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
            });
            console.log(cancelStreamTx)
          }}>Cancel stream</StreamConfigButton>
          <StreamConfigButton onClick={async () => {
            const balance = await sablier.balanceOf(parseInt(streamHistory[streamHistory.length-1].topics[1]), '0x8aDa904a7Df2088024eabD0de41a880AD9ECe4d3');
            console.log(balance)
            const estimatedGas = await sablier.estimate.withdrawFromStream(parseInt(streamHistory[streamHistory.length-1].topics[1]))
            const withdrawFromStreamTx = await sablier.withdrawFromStream(parseInt(streamHistory[streamHistory.length-1].topics[1]), balance, {
              gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
            });
            console.log(withdrawFromStreamTx)
          }}>Withdraw from stream</StreamConfigButton>
          </Aligner>
      </InputRow>
        </ConfigModal>
    </Modal>
  )
}