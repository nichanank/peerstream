import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { isMobile } from 'react-device-detect'
import { Link } from 'react-router-dom'
import Modal from '../Modal'
import { BorderlessInput } from '../../theme'
import { Spinner } from '../../theme'
import { ReactComponent as Close } from '../../assets/img/x.svg'

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
  :hover {
    border: 1px solid
      ${({ enabled, theme }) => (enabled ? darken(0.1, theme.primaryGreen) : darken(0.1, theme.placeholderGray))};
  }
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

const Input = styled(BorderlessInput)`
  font-size: 1rem;
  color: ${({ error, theme }) => error && theme.pink};
  background-color: ${({ theme }) => theme.tertiaryGreen};
  -moz-appearance: textfield;
`

const MessageListModal = styled.div`
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

export default function MessageModal({
  errorMessage,
  isOpen,
  onDismiss,
  space,
  threads,
  }) {
  
  const [message, setMessage] = useState('')
  const [selectedThreadIndex, setSelectedThreadIndex] = useState('')
  const [selectedThread, setSelectedThread] = useState({})
  const [posts, setPosts] = useState([])
  
  // manage focus on modal show
  const inputRef = useRef()

  function clearInputAndDismiss() {
    onDismiss()
    setPosts([])
    setSelectedThreadIndex('')
    setSelectedThread({})
    setMessage('')
  }

  function onInput(event) {
    const input = event.target.value
    setMessage(input)
  }

  function renderExistingThreads() {
    return threads.map((thread, index) => {
      return (
        <React.Fragment key={index}>
        <ModalRow onClick={async() => {
          if (selectedThreadIndex === index) {
            setSelectedThreadIndex('')
            setSelectedThread({})
            setPosts([])
          } else {
            setSelectedThreadIndex(index)
            try {
              console.log(thread)
              const threadToView = await space.joinThreadByAddress(thread.message.split(' ')[1])
              const postsToView = await threadToView.getPosts()
              setSelectedThread(threadToView)
              setPosts(postsToView)
            } catch (err) {
              console.log(err)
            }
          }
        }}>
          <RowLeft>Message from {thread.message.split(' ')[2]}</RowLeft>
          <RowRight>Click to Expand</RowRight>
        </ModalRow>
        { selectedThreadIndex === index ? <>{renderPosts()}
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
            <InputRow>
              <Aligner>
              <SendButton onClick={async () => {
                await selectedThread.post(message)
                const updatedPosts = await selectedThread.getPosts()
                setPosts(updatedPosts)
                setMessage('')
              }}>Send</SendButton>
              </Aligner>
            </InputRow>
            <InputRow>
              <Aligner>
                <MeetingButton enabled={true}><Link to={"/meeting"} target="_blank" id="navigation">Start a Meeting</Link></MeetingButton>
                <StaticInformation>
                  This connects you to a peer-to-peer video chat room. You'll be given a <strong>peer Id</strong> which you can give to your peer to connect to. Once you the two of you are connected, you can start a call with your peer.
                </StaticInformation>
              </Aligner>
            </InputRow>
          </>
         : null}
      </React.Fragment>
      )
    })
  }

  function renderPosts() {
    return posts.map((post, index) => {
      return (
        <ModalRow key={index}>
          <RowLeft>{post.message}</RowLeft>
          <RowRight>{new Date(post.timestamp * 1000).toLocaleString('en-US')}</RowRight>
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
    <MessageListModal>
        <ModalHeader>
          <p>Peer Chat</p>
          <CloseIcon onClick={clearInputAndDismiss}>
            <CloseColor alt={'close icon'} />
          </CloseIcon>
        </ModalHeader>
        {renderExistingThreads()}
        
        </MessageListModal>
    </Modal>
  )
}