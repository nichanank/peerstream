import React, { useState, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { darken } from 'polished'
import { isMobile } from 'react-device-detect'
import escapeStringRegex from 'escape-string-regexp'
import Select from 'react-select'
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


const PostButton = styled.button`
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

const SignUpModal = styled.div`
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

const SpinnerWrapper = styled(Spinner)`
  margin: 0 0.25rem 0 0.25rem;
  color: ${({ theme }) => theme.chaliceGray};
  opacity: 0.6;
`


export default function PeerSignUpModal({
  errorMessage,
  isOpen,
  onDismiss,
  thread
  }) {
  
  const { account } = useWeb3React()
  
  const [description, setDescription] = useState('')
  
  // manage focus on modal show
  const inputRef = useRef()

  function clearInputAndDismiss() {

    onDismiss()
  }

  function onInput(event) {
    const input = event.target.value
    setDescription(input)
  }

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={clearInputAndDismiss}
      minHeight={60}
      initialFocusRef={isMobile ? undefined : inputRef}
    >
    <SignUpModal>
        <ModalHeader>
          <p>Sign up to be a peer</p>
          <CloseIcon onClick={clearInputAndDismiss}>
            <CloseColor alt={'close icon'} />
          </CloseIcon>
        </ModalHeader>
        <InputRow>
          <Input
            ref={inputRef}
            type="text"
            error={!!errorMessage}
            placeholder={'    what can you help with?'}
            onChange={onInput}
            value={description}
          />
      </InputRow>
      <InputRow>
          <Aligner>
          <PostButton onClick={async () => {
            await thread.post("peer-signup: " + account + " " + description)
            clearInputAndDismiss()
          }}>Post</PostButton>
          </Aligner>
      </InputRow>
        </SignUpModal>
    </Modal>
  )
}