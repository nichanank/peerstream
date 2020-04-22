import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { isMobile } from 'react-device-detect'
import escapeStringRegex from 'escape-string-regexp'
import { BorderlessInput } from '../../theme'
import Modal from '../Modal'
import { Spinner } from '../../theme'
import { ReactComponent as Close } from '../../assets/img/x.svg'
import Circle from '../../assets/img/circle.svg'


const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 0.25rem 0.85rem 0.75rem;
`


const SendButton = styled.button`
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

const Input = styled(BorderlessInput)`
  font-size: 1.5rem;
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

const TokenModalInfo = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 1rem 1.5rem;
  margin: 0.25rem 0.5rem;
  justify-content: center;
  user-select: none;
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

const SpinnerWrapper = styled(Spinner)`
  margin: 0 0.25rem 0 0.25rem;
  color: ${({ theme }) => theme.chaliceGray};
  opacity: 0.6;
`


export default function PeerChatModal({
  errorMessage,
  isOpen,
  onDismiss,
  privateThread,
  previousMessages
  }) {
  
  const [message, setMessage] = useState('')
  
  // manage focus on modal show
  const inputRef = useRef()

  function clearInputAndDismiss() {
    onDismiss()
  }

  function onInput(event) {
    const input = event.target.value
    setMessage(input)
  }

  function renderPreviousMessages() {
    return previousMessages.map((message) => {
      return (
        <ModalRow>
          {message.message}
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
        <InputRow>
          <Input
            ref={inputRef}
            type="text"
            error={!!errorMessage}
            placeholder={'Type your message here....'}
            onChange={onInput}
            value={message}
          />
      </InputRow>
      {renderPreviousMessages()}
      <InputRow>
          <Aligner>
          <SendButton onClick={async () => {
            await privateThread.post(message)
            setMessage('')
          }}>Post</SendButton>
          </Aligner>
      </InputRow>
        </ChatModal>
    </Modal>
  )
}