import React, { useState, useEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import Box from '3box'
import Typed from 'typed.js'
import { useAlert } from 'react-alert'
import PeerCard from '../../components/PeerCard'
import StreamConfigModal from '../../components/StreamConfigModal'
import PeerSignUpModal from '../../components/PeerSignUpModal'
import PeerChatModal from '../../components/PeerChatModal'
import MessageModal from '../../components/MessageModal'
import Circle from '../../assets/img/circle.svg'
import { Spinner } from '../../theme'

import { Jumbotron, JumbotronColumn, MainHeader, OneLinerContainer, OneLiner, SubOneLiner, CTAButtonPrimary } from '../../theme/components'

const jumbotronPeerTypes = ['expert advice?', 'programming help?', 'product feedback?', 'career mentors?', 'marketing experts?', 'design feedback?']

const DiscoverContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  padding: 20 20 20 20;
  overflow-y: scroll;
  background: #F9F8EB;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
  }
`

const StaticInformation = styled.p`
  text-align: center;
  font-family: Ubuntu;
  color: ${({ theme }) => theme.primaryGreen};
`

const SpinnerWrapper = styled(Spinner)`
  margin: 0 0.25rem 0 0.25rem;
  color: ${({ theme }) => theme.chaliceGray};
  opacity: 0.6;
`

const JumbotronButton = styled.button`
  background: ${({ theme }) => theme.primaryGreen}; 
  font-family: Ubuntu; 
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  color: white;
  width: 30%;
  height: 10%;
  font-size: 0.9rem;
  :hover {
    background: ${({ theme }) => theme.secondaryGreen}; 
    box-shadow: 0px 7px 7px rgba(0, 0, 0, 0.25);
  }
`

const PeerTypes = styled.span`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.primaryGreen};  
`

const Description = styled.p`
  color: ${({ theme }) => theme.textColor};  
  font-weight: 400;
  font-size: 1rem;
  margin: 0;
  text-align: center;
  padding-left: 15px;
  padding-right: 15px;
`

export function Discover() {

  const { library, account } = useWeb3React()

  const [space, setSpace] = useState({})
  const [posts, setPosts] = useState([])
  const [thread, setThread] = useState({})
  const [peers, setPeers] = useState([])
  const [isAPeer, setIsAPeer] = useState(false)
  const [userDms, setUserDms] = useState([])
  const [peerSignUpModalIsOpen, setPeerSignUpModalIsOpen] = useState(false)
  const [peerChatModalIsOpen, setPeerChatModalIsOpen] = useState(false)
  const [streamConfigModalIsOpen, setStreamConfigModalIsOpen] = useState(false)
  const [messageModalIsOpen, setMessageModalIsOpen] = useState(false)
  const [previousPrivateMessages, setPreviousPrivateMessages] = useState([])
  const [activePrivateThread, setActivePrivateThread] = useState({})

  const [boxIsLoading, setBoxIsLoading] = useState(false)
  const [peerListIsLoading, setPeerListIsLoading] = useState(false)

  const headingRef = useRef(null)

  const alert = useAlert()

  useEffect(() => {
    headingRef.current.scrollIntoView()
    const options = {
        strings: jumbotronPeerTypes,
        typeSpeed: 50,
        loop: true
    }
    const typed = new Typed('#instruction', options)
    
    // destroy typed instance on unmounting to prevent memory leaks
    return () => {
        typed.destroy()
    }

}, [])

  // retrieve public thread information about available peers
  useEffect(() => {
    
    async function getPosts(threadAddress) {
      const posts = await Box.getThreadByAddress(threadAddress)
      return posts
    }

    let isSubscribed = true
    setPeerListIsLoading(true)
    getPosts("/orbitdb/zdpuAr4w4ZAZm1YyuDKwcRLKtXx78jH95SghFuARwB99mYVJN/3box.thread.stream.peer_list")
      .then((result) => {
        if (isSubscribed) {
          setPosts(result)
          const dms = posts.filter((post) => post.message.split(' ')[2] === account || post.message.split(' ')[3] === account)
          setUserDms(dms)
          const peers = posts.filter((post) => post.message.split(' ')[0] === 'peer-signup:')
                            .map(post => ({postId: post.postId, address: post.message.split(' ')[1], message: post.message.split(' ').slice(2).join(' ')}))
          setPeers(peers)
          const mySignup = posts.filter((post) => post.message.split(' ')[0] === 'peer-signup:').filter((signup) => signup.message.split(' ')[1] === account)
          if (mySignup.length > 0) {
            setIsAPeer(true)
          }
          setPeerListIsLoading(false)
        }
      })
      .catch(err => isSubscribed ? console.log(err) : null)

    return () => (isSubscribed = false)

  }, [posts, account])

  async function openBoxAndSyncSpace() {
    setBoxIsLoading(true)
    try {
      const box = await Box.openBox(account, library.provider)
      await box.syncDone
      console.log(box)
      
      const space = await box.openSpace('stream')
      await space.syncDone
      console.log(space)
      setSpace(space)

      // join the main peer list public thread.
      const thread = await space.joinThreadByAddress("/orbitdb/zdpuAr4w4ZAZm1YyuDKwcRLKtXx78jH95SghFuARwB99mYVJN/3box.thread.stream.peer_list")
      setThread(() => getAppsThread(thread))
    } catch (err) {
      alert.show(err.toString() + ". Please refresh and try again")
    }
  }
  
  //aysync retrieve people who have signed up to be peers
  async function getAppsThread(thread) {
    if (!thread) {
      console.error("apps thread not in react state");
      return;
    }
    setThread(thread)
    // console.log(thread)

    const posts = await thread.getPosts()
    setPosts(posts)

    const dms = posts.filter((post) => post.message.split(' ')[2] === account || post.message.split(' ')[3] === account)
    // console.log(dms)
    setUserDms(dms)
    const peers = posts.filter((post) => post.message.split(' ')[0] === 'peer-signup:')
                      .map(post => ({postId: post.postId, address: post.message.split(' ')[1], message: post.message.split(' ').slice(2).join(' ')}))
    // console.log(peers)
    setPeers(peers)
    setBoxIsLoading(false)
    await thread.onUpdate(async()=> {
      const posts = await thread.getPosts()
      const dms = posts.filter((post) => post.message.split(' ')[2] === account || post.message.split(' ')[3] === account)
      const peers = posts.filter((post) => post.message.split(' ')[0] === 'peer-signup:')
                      .map(post => ({postId: post.postId, address: post.message.split(' ')[1], message: post.message.split(' ').slice(2).join(' ')}))
      const mySignup = posts.filter((post) => post.message.split(' ')[0] === 'peer-signup:').filter((signup) => signup.message.split(' ')[1] === account)
      if (mySignup.length > 0) {
        setIsAPeer(true)
      } else { setIsAPeer(false) }
      setPeers(peers)
      setUserDms(dms)
      setPosts(posts)
    })
  }

  async function recordNewConfidentialThread(newThread) {
    await thread.post("dm-created " + newThread.threadAddress + " " + newThread.sender + " " + newThread.recipient)
  }

  function checkIfThreadAlreadyExists(address) {
    return userDms.filter((dm) => (dm.message.split(' ')[2] === account && 
                                  (dm.message.split(' ')[3] === address)))
  }

  function getExistingThreads() {
    return userDms.filter((dm) => (dm.message.split(' ')[3] === account))
  }

  function setActiveChat(thread, posts) {
    setActivePrivateThread(thread)
    setPreviousPrivateMessages(posts)
  }

  //populate the discover list from ethAddresses that have signed up to be a peer, this should read from a public thread
  function populateDiscover() {
      if (peers.length > 0) {
        return peers.map((peer, index) => {
          return(
            <React.Fragment key={index}>
              <PeerCard 
                peer={peer}
                space={space}
                mainThread={thread}
                dmThread={checkIfThreadAlreadyExists(peer.address)}
                createNewConfidentialThread={(newThread) => recordNewConfidentialThread(newThread)}
                setActiveChat={(activePrivateThread, previousPosts) => setActiveChat(activePrivateThread, previousPosts)}
                viewMessages={() => setMessageModalIsOpen(true)}
                openChatModal={() => setPeerChatModalIsOpen(true)}
                configureStream={() => setStreamConfigModalIsOpen(true)} >
              </PeerCard> 
            {streamConfigModalIsOpen ?
              <StreamConfigModal 
              recipient={peer.address}
              isOpen={streamConfigModalIsOpen}
              onDismiss={() => setStreamConfigModalIsOpen(false)} />
               : null }
            {peerChatModalIsOpen ?
              <PeerChatModal 
                privateThread={activePrivateThread}
                previousMessages={previousPrivateMessages}
                onNewMessageSent={(thread, posts) => setActiveChat(thread, posts)}
                isOpen={peerChatModalIsOpen}
                onDismiss={() => setPeerChatModalIsOpen(false)} />
              : null }
            </React.Fragment>
            )
        })
      } return peerListIsLoading ? <><Spinner src={Circle} alt="loader" /><StaticInformation>Loading peers...</StaticInformation></> : <StaticInformation>No peers yet, sign up to be one!</StaticInformation>
    }
        
    return (
      <>
        <Jumbotron ref={headingRef}>
          <JumbotronColumn>
            <MainHeader>Looking for</MainHeader>
            <div><PeerTypes id='instruction' /></div>
          </JumbotronColumn>
          <JumbotronColumn>
            { boxIsLoading ? <Spinner src={Circle} alt="loader" /> : Object.keys(space).length === 0 ? <JumbotronButton onClick={() => openBoxAndSyncSpace()}>Sign in with 3Box</JumbotronButton> : null}
          </JumbotronColumn>
        </Jumbotron>
        <OneLinerContainer>
          <OneLiner>Someone here might be able to help...</OneLiner>
          <SubOneLiner>Connect with them to start a chat!</SubOneLiner> 
        </OneLinerContainer>
        <DiscoverContainer>
          {populateDiscover()}
        </DiscoverContainer>
        <OneLinerContainer>
          <SubOneLiner>Want to turn every day into payday? Become a peer</SubOneLiner>
          {Object.keys(thread).length > 0 ? 
            isAPeer ? <p>You're already a peer!</p> : <CTAButtonPrimary onClick={() => setPeerSignUpModalIsOpen(true)}>Sign up</CTAButtonPrimary> : 
            <CTAButtonPrimary onClick={() => openBoxAndSyncSpace()}>Sign in with 3Box</CTAButtonPrimary>
          }
        </OneLinerContainer>
        {peerSignUpModalIsOpen ? 
          <PeerSignUpModal 
            thread={thread}
            isOpen={peerSignUpModalIsOpen}
            onDismiss={() => setPeerSignUpModalIsOpen(false)} 
          /> : null}
        {messageModalIsOpen ? 
          <MessageModal 
            space={space}
            threads={getExistingThreads()} //existing messages to user
            isOpen={messageModalIsOpen}
            onDismiss={() => setMessageModalIsOpen(false)} 
          /> : null}
      </>
    )
  }