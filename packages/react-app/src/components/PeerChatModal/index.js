import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { isMobile } from 'react-device-detect'
import Modal from '../Modal'
import { BorderlessInput } from '../../theme'
import { Link } from 'react-router-dom'
import { ReactComponent as Close } from '../../assets/img/x.svg'

const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 0.25rem 0.85rem 0.75rem;
`

const SendButton = styled.button`
  align-items: center;
  font-size: 1rem;
  color: ${({ enabled, theme }) => (enabled ? theme.white : theme.textColor)};
  height: 2rem;
  border: 1px solid ${({ enabled, theme }) => (enabled ? theme.primaryGreen : theme.placeholderGray)};
  border-radius: 2.5rem;
  background-color: ${({ enabled, theme }) => (enabled ? theme.primaryGreen : theme.placeholderGray)};
  outline: none;
  margin-right: 5%;
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

const MeetingButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: ${({ enabled, theme }) => (enabled ? theme.primaryGreen : theme.textColor)};
  height: 2rem;
  padding-left: 3%;
  padding-right: 3%;
  border-radius: 2.5rem;
  background-color: ${({ enabled, theme }) => (enabled ? theme.primaryGreen : theme.placeholderGray)};
  outline: none;
  cursor: pointer;
  user-select: none;
  a { 
    text-decoration: none;
    color: white;
    text-align: center;
    align-items: center;
    margin: auto;
    font-size: 0.8rem;
  }
  :hover {
    border: 1px solid
      ${({ enabled, theme }) => (enabled ? darken(0.1, theme.primaryGreen) : darken(0.1, theme.placeholderGray))};
  }
`

const StyledLink = styled(Link)`
  text-decoration: none;
  font-family: Ubuntu;
  align-items: center;
  font-size: 0.8rem;
  text-align: center;
  color: white;
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


const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Input = styled(BorderlessInput)`
  font-size: 1rem;
  padding-top: 3%;
  padding-bottom: 3%;
  color: ${({ error, theme }) => error && theme.pink};
  background-color: ${({ theme }) => theme.tertiaryGreen};
  -moz-appearance: textfield;
`

const ChatModal = styled.div`
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

const RowLeft = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items : center;
`

const RowRight = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: flex-end;
  color: gray;
  font-size: 0.4rem;
`

const ModalRow = styled.div`
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


export default function PeerChatModal({
  errorMessage,
  isOpen,
  onDismiss,
  privateThread,
  previousMessages,
  onNewMessageSent
  }) {
  
  const [message, setMessage] = useState('')
  
  // manage focus on modal show
  const inputRef = useRef()

  function clearInputAndDismiss() {
    onDismiss()
    setMessage('')
  }

  function onInput(event) {
    const input = event.target.value
    setMessage(input)
  }

  function renderPreviousMessages() {
    return previousMessages.map((message, index) => {
      var sentOn = new Date(message.timestamp * 1000).toLocaleString('en-US')
      return (
        <ModalRow key={index}>
          <RowLeft>{message.message}</RowLeft>
          <RowRight>{sentOn}</RowRight>
        </ModalRow>
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
    <ChatModal>
        <ModalHeader>
          <p>Peer Chat</p>
          <CloseIcon onClick={clearInputAndDismiss}>
            <CloseColor alt={'close icon'} />
          </CloseIcon>
        </ModalHeader>
        {renderPreviousMessages()}
        <InputRow>
          <Input
            ref={inputRef}
            type="text"
            error={!!errorMessage}
            placeholder={'Type your message here...'}
            onChange={onInput}
            value={message}
          />
      </InputRow>
      <InputRow>
          <Aligner>
          {message === '' ? 
            <SendButton enabled={false}>Send</SendButton> :  
            <SendButton enabled={true} onClick={async () => {
              await privateThread.post(message)
              const dms = await privateThread.getPosts();
              onNewMessageSent(privateThread, dms)
              setMessage('')
            }}>Send</SendButton>}
          </Aligner>
      </InputRow>
      <InputRow>
        <Aligner>
        <MeetingButton enabled={true}><StyledLink to={"/meeting"} target="_blank" id="navigation">Start a Meeting</StyledLink></MeetingButton>
          <StaticInformation>
            This connects you to a peer-to-peer video chat room. You'll be given a <strong>peer Id</strong> which you can give to your peer to connect to. Once you the two of you are connected, you can start a call with your peer.
          </StaticInformation>
        </Aligner>
      </InputRow>
        </ChatModal>
    </Modal>
  )
}