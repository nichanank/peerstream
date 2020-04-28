import React, { useState, useRef, useMemo, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { darken } from 'polished'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import DateTimePicker from 'react-datetime-picker'
import { useContract, useERC20Contract } from '../../hooks'
import { calculateGasMargin, getStreamEventsBetween, getStreamEventsTo } from '../../utils'
import { BorderlessInput } from '../../theme'
import { useAllTokenDetails } from '../../contexts/Tokens'
import Modal from '../Modal'
import { ReactComponent as Close } from '../../assets/img/x.svg'

const GAS_MARGIN = ethers.utils.bigNumberify(1000)
BigNumber.config({ EXPONENTIAL_AT: 30 })

const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.85rem 0.75rem;
  margin: 2% 3% 0 3%;
`

const StreamInfoRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.85rem 0.75rem;
  margin: 2% 3% 0 3%;
  margin: 2% 3% 0 3%;
`

const StaticInformation = styled.p`
  text-align: flex-end;
  align-self: flex-end;
  font-size: 0.7rem;
  font-style: italic;
  margin-left: 5%;
  margin-right: 5%;
  color: ${({ theme }) => theme.primaryGreen};
`

const InputTitle = styled.div`
  flex-direction: column;
  justify-content: center;
  width: 30%;
  align-content: center;
  text-align: center;
`

const StreamConfigButton = styled.button`
  background: ${({ enabled, theme }) => (enabled ? theme.primaryGreen : theme.placeholderGray)};
  color: ${({ enabled, theme }) => (enabled ? theme.white : theme.textColor)};
  font-family: Ubuntu; 
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  color: white;
  width: 70%;
  height: 2rem;
  font-size: 0.8rem;
  margin-right: 5%;
  :hover {
    background: ${({ theme }) => theme.secondaryGreen};
    cursor: pointer; 
    box-shadow: 0px 7px 7px rgba(0, 0, 0, 0.25);
    border: 1px solid
    ${({ enabled, theme }) => (enabled ? darken(0.1, theme.primaryGreen) : darken(0.1, theme.placeholderGray))};
  }
`

const SelectContainer = styled.div`
  position: relative;
  font-family: Ubuntu;
  background-color: ${({ theme }) => theme.tertiaryGreen};
  width: 200px;
  margin-top: 3%;
  select {
    background: ${({ theme }) => theme.tertiaryGreen};
    width: 200px;
    font-family: Ubuntu;
    font-size: 0.8rem;
    height: 1.5rem;
    options {
      font-family: Ubuntu;
      background: ${({ theme }) => theme.tertiaryGreen};
    }
  }
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
  font-size: 1rem;
  padding: 0.2rem;
  color: ${({ error, theme }) => error && theme.pink};
  background-color: ${({ theme }) => theme.tertiaryGreen};
  -moz-appearance: textfield;
`

const DateTimeInputContainer = styled.div`
  font-size: 1rem;
  margin-left: 2%;
  color: ${({ error, theme }) => error && theme.pink};
  background-color: ${({ theme }) => theme.tertiaryGreen};
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
  background: ${({ theme }) => theme.secondaryGreen};
  color: white};
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

export default function StreamConfigModal({
  errorMessage,
  isOpen,
  onDismiss,
  recipient,  
  }) {
  
  const { account, chainId, library } = useWeb3React()
  
  const sablier = useContract("Sablier")
  const testDai = useERC20Contract("0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8")
  
  const allTokens = useAllTokenDetails()
  
  const [deposit, setDeposit] = useState('')
  const [startTime, setStartTime] = useState(new Date())
  const [stopTime, setStopTime] = useState(new Date())
  const [selectedToken, setSelectedToken] = useState('')
  const [streamHistory, setStreamHistory] = useState([])
  const [streamsToAccount, setStreamsToAccount] = useState([])
  
  const [selectedStreamId, setSelectedStreamId] = useState('')
  const [selectedStreamDetails, setSelectedStreamDetails] = useState({})

  // manage focus on modal show
  const inputRef = useRef()

  function changeStartTime(date) {
    setStartTime(date)
  }

  function changeStopTime(date) {
    setStopTime(date)
  }

  function clearInputAndDismiss() {
    setDeposit('')
    setSelectedToken('')
    setStartTime(new Date())
    setStopTime(new Date())
    setStreamHistory([])
    setStreamsToAccount([])
    setSelectedStreamId('')
    setSelectedStreamDetails({})
    onDismiss()
  }

  useEffect(() => {
    let isSubscribed = true
    if (isSubscribed) {
      getStreamEventsBetween(chainId, library, account, recipient, account).then((result) => {
        const streams = result.map((stream) => ({ streamId: parseInt(stream.topics[1]), sender: stream.topics[2], recipient: stream.topics[3] }))
        setStreamHistory(streams)
      })
      getStreamEventsTo(chainId, library, account).then((result) => {
        const streams = result.map((stream) => ({ streamId: parseInt(stream.topics[1]), sender: stream.topics[2], recipient: stream.topics[3] }))
        setStreamsToAccount(streams)
      })
    }
    return () => (isSubscribed = false)
  }, [chainId, library, account, recipient])

  
  function renderApproveButton() {
    if (!deposit || selectedToken === '') {
      return (
        <StreamConfigButton enabled={false} disabled>
          Approve
        </StreamConfigButton>)
    } else {
      let convertedStart = Math.round(startTime.getTime() / 1000)
      let convertedStop = Math.round(stopTime.getTime() / 1000)
      let convertedDeposit = new BigNumber(deposit).multipliedBy(10 ** 18).toFixed(0)
      let remainder = new BigNumber(convertedDeposit) % (convertedStop - convertedStart)
      let amountToDeposit = new BigNumber(convertedDeposit - remainder).toString()

      return (
        <StreamConfigButton enabled={true} onClick={async () => {
          const estimatedGas = await testDai.estimate.approve(sablier.address, amountToDeposit)
          const approveTx = await testDai.approve(sablier.address, amountToDeposit, {
            gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
          })
          console.log(approveTx)
        }}>Approve</StreamConfigButton> 
      )
    }
  }

  function renderStartButton() {
    if (!deposit || !startTime || !stopTime || selectedToken === '') {
      return (
        <StreamConfigButton enabled={false} disabled>
          Start Stream
        </StreamConfigButton>)
    } else {
      let convertedStart = Math.round(startTime.getTime() / 1000)
      let convertedStop = Math.round(stopTime.getTime() / 1000)
      let convertedDeposit = new BigNumber(deposit).multipliedBy(10 ** 18).toFixed(0)
      let remainder = new BigNumber(convertedDeposit) % (convertedStop - convertedStart)
      let amountToDeposit = new BigNumber(convertedDeposit - remainder).toString()
    
      return (
        <StreamConfigButton enabled={true} onClick={async () => {
          const estimatedGas = await sablier.estimate.createStream(recipient, amountToDeposit, selectedToken, convertedStart, convertedStop)
          const streamTx = sablier
            .createStream(recipient, amountToDeposit, selectedToken, convertedStart, convertedStop, {
              gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
            })
          console.log(streamTx)
        }}>Start Stream</StreamConfigButton>
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
  
  function renderInputRows() {
    return (
      <React.Fragment>
        <InputRow>
          <SelectContainer>
            <select onChange={e => setSelectedToken(e.target.value)}>
              <Option value="" hidden>Select token</Option>
              { tokenList.length > 0 ? tokenList.map((token, index) => <Option key={index} value={token.address}>{token.name}</Option>) : null}
              </select>
          </SelectContainer>
          <StaticInformation>Note: For testing purposes, please use TestnetDAI. View docs to see how you can mint yourself some TestnetDAI to try the streaming feature.</StaticInformation>
        </InputRow>
        <InputRow>
          <InputTitle>Deposit amount</InputTitle>
          <InputTitle>Stream start time (GMT)</InputTitle>
          <InputTitle>Stream stop time (GMT)</InputTitle>
        </InputRow>
          <InputRow>
          <Input
            ref={inputRef}
            type="number"
            min="0"
            error={!!errorMessage}
            placeholder={'Enter deposit amount'}
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
          <DateTimeInputContainer><DateTimePicker onChange={(date) => changeStartTime(date)} value={startTime} /></DateTimeInputContainer>
          <DateTimeInputContainer><DateTimePicker onChange={(date) => changeStopTime(date)} value={stopTime} /></DateTimeInputContainer>
        </InputRow>
      </React.Fragment>
    )
  }

  function renderStreamDetailsRow() {
    return(
      <React.Fragment key={selectedStreamId}>
        <StreamInfoRow><strong>Balance:</strong> {parseInt(selectedStreamDetails.balance / 1000000000000000000)}</StreamInfoRow>
        <StreamInfoRow><strong>Sender:</strong> {selectedStreamDetails.sender}</StreamInfoRow>
        <StreamInfoRow><strong>Start:</strong> {new Date(selectedStreamDetails.startTime * 1000).toLocaleString('en-US')}</StreamInfoRow>
        <StreamInfoRow><strong>Stop:</strong> {new Date(selectedStreamDetails.stopTime * 1000).toLocaleString('en-US')}</StreamInfoRow>
        <StreamInfoRow><strong>Token:</strong> {selectedStreamDetails.token}</StreamInfoRow>
        {account === selectedStreamDetails.sender ? 
          // if current user is the sender, give option to cancel
          <StreamConfigButton onClick={async () => {
            const estimatedGas = await sablier.estimate.cancelStream(selectedStreamId)
            const cancelStreamTx = await sablier.cancelStream(selectedStreamId, {
              gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
            })
            console.log(cancelStreamTx)
          }}>Cancel Stream</StreamConfigButton> :
          // otherwise the current user is a recipient and they can withdraw if the stream is still active
        <StreamConfigButton onClick={async () => {
          const estimatedGas = await sablier.estimate.withdrawFromStream(selectedStreamId, selectedStreamDetails.balance)
          const withdrawFromStreamTx = await sablier.withdrawFromStream(selectedStreamId, selectedStreamDetails.balance, {
            gasLimit: calculateGasMargin(estimatedGas, GAS_MARGIN)
          })
          console.log(withdrawFromStreamTx)
        }}>Withdraw Balance</StreamConfigButton> }
      </React.Fragment>
    )
  }

  function renderStreamHistory(streams) {
    return streams.map((stream, index) => {
      return (
        <React.Fragment key={index}>
          <StreamInfoRow>
            {stream.streamId}
            <StreamConfigButton onClick={async () => {
              if (selectedStreamId === stream.streamId) {
                setSelectedStreamId('')
                setSelectedStreamDetails({})
              } else {
                setSelectedStreamId(stream.streamId)
                try {
                  const details = await sablier.getStream(stream.streamId);
                  const streamBalance = await sablier.balanceOf(stream.streamId, recipient);
                  console.log(details)
                  console.log(streamBalance)
                  setSelectedStreamDetails({
                    deposit: parseInt(details.deposit), 
                    sender: details.sender,
                    startTime: parseInt(details.startTime),
                    stopTime: parseInt(details.stopTime),
                    token: details.tokenAddress, 
                    balance: streamBalance })
                } catch {
                  setSelectedStreamDetails({ 
                    deposit: "Stream Complete or No Longer Active", 
                    sender: "Stream Complete or No Longer Active",
                    startTime: "Stream Complete or No Longer Active",
                    stopTime: "Stream Complete or No Longer Active",
                    token: "Stream Complete or No Longer Active", 
                    balance: "Stream Complete or No Longer Active"})
                }
              }
            }}>Toggle Details</StreamConfigButton>
          </StreamInfoRow>
          { selectedStreamId === stream.streamId ? renderStreamDetailsRow() : null}
        </React.Fragment>
      )
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={clearInputAndDismiss}
      minHeight={60}
      initialFocusRef={isMobile ? undefined : inputRef}>
    <ConfigModal>
      <ModalHeader>
        { account === recipient? <p>Your Stream History</p> : <p>Start a stream with {recipient}</p>}
        <CloseIcon onClick={clearInputAndDismiss}>
          <CloseColor alt={'close icon'} />
        </CloseIcon>
      </ModalHeader>
      { account === recipient? null : renderInputRows()}
      <InputRow>
          <Aligner>
            { recipient === account ? null : renderApproveButton()}
            { recipient === account ? null : renderStartButton()}
          </Aligner>
      </InputRow>
      <StreamInfoRow>Stream History</StreamInfoRow>
      {streamHistory.length > 0 ? renderStreamHistory(streamHistory) : streamsToAccount.length > 0 ? renderStreamHistory(streamsToAccount) : <p>No streams yet</p>}
    </ConfigModal>
    </Modal>
  )
}