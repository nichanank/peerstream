import React, { useState, useEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import Box from '3box'
import Typed from 'typed.js'
import PeerCard from '../../components/PeerCard'
import StreamConfigModal from '../../components/StreamConfigModal'
import PeerSignUpModal from '../../components/PeerSignUpModal'
import PeerChatModal from '../../components/PeerChatModal'

import { Jumbotron, JumbotronColumn, MainHeader, OneLinerContainer, OneLiner, SubOneLiner, CTAButtonPrimary, JumbotronButton } from '../../theme/components'

const jumbotronPeerTypes = ['mentor', 'beta tester', 'advisor', 'security expert', 'designer', 'domain specialist']

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

const PeerTypes = styled.span`
  font-size: 1.5rem;
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
  const [userDms, setUserDms] = useState([])
  const [loading, setLoading] = useState(true)
  const [peerSignUpModalIsOpen, setPeerSignUpModalIsOpen] = useState(false)
  const [peerChatModalIsOpen, setPeerChatModalIsOpen] = useState(false)
  const [streamConfigModalIsOpen, setStreamConfigModalIsOpen] = useState(false)
  const [previousPrivateMessages, setPreviousPrivateMessages] = useState([])
  const [activePrivateThread, setActivePrivateThread] = useState({})

  const headingRef = useRef(null)

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

  async function openBoxAndSyncSpace() {
    setLoading(true)
    const box = await Box.openBox(account, library.provider)
    await box.syncDone
    console.log(box)
    
    const space = await box.openSpace('stream')
    await space.syncDone
    console.log(space)
    setSpace(space)

    const thread = await space.joinThreadByAddress("/orbitdb/zdpuAr4w4ZAZm1YyuDKwcRLKtXx78jH95SghFuARwB99mYVJN/3box.thread.stream.peer_list")

    // await thread.deletePost("zdpuB27gHwdiXQnkqbmzYAvrDAg6pPsaUUnhXnzd19zMuEDvD")

    setThread(() => getAppsThread(thread))
  }

  // retrieve public thread information about available peers
  useEffect(() => {
    
    async function getPosts(threadAddress) {
      const posts = await Box.getThreadByAddress(threadAddress)
      return posts
    }

    let isSubscribed = true;
    
    getPosts("/orbitdb/zdpuAr4w4ZAZm1YyuDKwcRLKtXx78jH95SghFuARwB99mYVJN/3box.thread.stream.peer_list")
      .then((result) => {
        if (isSubscribed) {
          setPosts(result)
          const dms = posts.filter((post) => post.message.split(' ')[2] === account || post.message.split(' ')[3] === account)
          setUserDms(dms)
          const peers = posts.filter((post) => post.message.split(' ')[0] === 'peer-signup:')
                            .map(post => ({address: post.message.split(' ')[1], message: post.message.split(' ').slice(2).join(' ')}))
          setPeers(peers)
        }
      })
      .catch(err => isSubscribed ? console.log(err) : null)

    return () => (isSubscribed = false)

  }, [posts, account])
  
  //aysync retrieve people who have signed up to be peers
  async function getAppsThread(thread) {
    console.log('getting into apps thread')
    if (!thread) {
      console.error("apps thread not in react state");
      return;
    }
    setThread(thread)
    // console.log(thread)

    const posts = await thread.getPosts();
    // console.log(posts)
    setPosts(posts)

    const dms = posts.filter((post) => post.message.split(' ')[2] === account || post.message.split(' ')[3] === account)
    // console.log(dms)
    setUserDms(dms)

    const peers = posts.filter((post) => post.message.split(' ')[0] === 'peer-signup:')
                       .map(post => ({address: post.message.split(' ')[1], message: post.message.split(' ').slice(2).join(' ')}))
    // console.log(peers)
    setPeers(peers)

    await thread.onUpdate(async()=> {
      const posts = await thread.getPosts();
      const dms = posts.filter((post) => post.message.split(' ')[2] === account || post.message.split(' ')[3] === account)
      const peers = posts.filter((post) => post.message.split(' ')[0] === 'peer-signup:')
                       .map(post => ({address: post.message.split(' ')[1], message: post.message.split(' ').slice(2).join(' ')}))
      setPeers(peers)
      setUserDms(dms)
      setPosts(posts)
      setLoading(false)
    })
  }

  async function recordNewConfidentialThread(newThread) {
    await thread.post("dm-created " + newThread.threadAddress + " " + newThread.sender + " " + newThread.recipient)
  }

  function checkIfDmAlreadyExists(address) {
    return userDms.filter((dm) => (dm.message.split(' ')[2] === address|| 
                                  (dm.message.split(' ')[3] === address)))
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
                dmThread={checkIfDmAlreadyExists(peer.address)}
                createNewConfidentialThread={(newThread) => recordNewConfidentialThread(newThread)}
                setActiveChat={(activePrivateThread, previousPosts) => setActiveChat(activePrivateThread, previousPosts)}
                openChatModal={() => setPeerChatModalIsOpen(true)}
                configureStream={() => setStreamConfigModalIsOpen(true)} >
              </PeerCard> 
            <StreamConfigModal 
                recipient={peer.address}
                isOpen={streamConfigModalIsOpen}
                onDismiss={() => setStreamConfigModalIsOpen(false)} />
            <PeerChatModal 
                privateThread={activePrivateThread}
                previousMessages={previousPrivateMessages.reverse()}
                isOpen={peerChatModalIsOpen}
                onDismiss={() => setPeerChatModalIsOpen(false)} />
            </React.Fragment>
            )
        })
      } return loading ? <p>loading peers...</p> : <p>no peers yet, sign up to be one!</p>
    }
        
    return (
      <>
        <Jumbotron ref={headingRef}>
          <JumbotronColumn>
            <MainHeader>Find your</MainHeader>
            <div><PeerTypes id='instruction' /></div>
          </JumbotronColumn>
          <JumbotronColumn>
            <JumbotronButton onClick={() => openBoxAndSyncSpace()}>Connect</JumbotronButton>
          </JumbotronColumn>
        </Jumbotron>
        <OneLinerContainer>
          <OneLiner>Someone here might be able to help you...</OneLiner>
          <SubOneLiner>Connect with them to start a chat!</SubOneLiner> 
        </OneLinerContainer>
        <DiscoverContainer>
          {populateDiscover()}
        </DiscoverContainer>
        <OneLinerContainer>
          <SubOneLiner>Want to turn every day into payday? Become a peer</SubOneLiner>
          {Object.keys(thread).length > 0 ? 
            <CTAButtonPrimary onClick={() => setPeerSignUpModalIsOpen(true)}>Sign up</CTAButtonPrimary>  : 
            <CTAButtonPrimary onClick={() => openBoxAndSyncSpace()}>Connect via 3Box</CTAButtonPrimary>}
        </OneLinerContainer>
        <PeerSignUpModal 
          thread={thread}
          isOpen={peerSignUpModalIsOpen}
          onDismiss={() => setPeerSignUpModalIsOpen(false)} />
      </>
    )
  }