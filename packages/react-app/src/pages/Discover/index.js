import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import Box from '3box'
import PeerCard from '../../components/PeerCard'
import StreamConfigModal from '../../components/StreamConfigModal'
import PeerSignUpModal from '../../components/PeerSignUpModal'
import { useBox } from '../../hooks/'
import { Page, Jumbotron, JumbotronColumn, MainHeader, OneLinerContainer, OneLiner, SubOneLiner } from '../../theme/components'

//design the discover container
const DiscoverContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 1284px;
  background: #F9F8EB;
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

  // const { box, space } = useBox()

  const [box, setBox] = useState({})
  const [space, setSpace] = useState({})
  const [posts, setPosts] = useState([])
  const [thread, setThread] = useState({})
  const [peers, setPeers] = useState([])
  const [userDms, setUserDms] = useState([])
  const [loading, setLoading] = useState(true)
  const [peerSignUpModalIsOpen, setPeerSignUpModalIsOpen] = useState(false)
  const [streamConfigModalIsOpen, setStreamConfigModalIsOpen] = useState(false)

  // create a 3box instance and open space
  useEffect(() => {

    async function openBox() {
      const box = await Box.openBox(account, library.provider)
      await box.syncDone
      console.log(box)
      return box        
    }
    async function openSpace(boxInstance) {
      const space = await boxInstance.openSpace('stream')
      await space.syncDone
      console.log(space)
      return space
    }

    async function openAppThread(spaceInstance) {
      const thread = await spaceInstance.joinThreadByAddress("/orbitdb/zdpuAr4w4ZAZm1YyuDKwcRLKtXx78jH95SghFuARwB99mYVJN/3box.thread.stream.peer_list")
      return thread
    }

    const timer = setTimeout(() => {
      setLoading(true)
      console.log('opening box...')
      openBox(account, library.provider).then((box) => {
        setBox(box)
        openSpace(box).then((space) => setSpace(space))
        setLoading(false)
      })
    }, 25000);
    return () => clearTimeout(timer);

  }, [account, library.provider])
  
  //aysync retrieve people who have signed up to be peers
  //TODO: change logic so that people should be able to see the public thread without auth?
  async function getAppsThread(thread) {
    console.log('getting into apps thread')
    if (!thread) {
      console.error("apps thread not in react state");
      return;
    }
    setThread(thread)
    console.log(thread)

    const posts = await thread.getPosts();
    console.log(posts)
    setPosts(posts)

    posts.map((post) => console.log(post.message))
    const dms = posts.filter((post) => post.message.split(' ')[2] === account || post.message.split(' ')[3] === account)
    console.log(dms)
    setUserDms(dms)

    posts.map((post) => console.log(post.message))
    const peers = posts.filter((post) => post.message.split(' ')[0] === 'peer-signup:')
                       .map(post => ({address: post.message.split(' ')[1], message: post.message.split(' ').slice(2).join(' ')}))
    console.log(peers)
    setPeers(peers)

    await thread.onUpdate(async()=> {
      const posts = await thread.getPosts();
      const dms = posts.filter((post) => post.message.split(' ')[2] === account || post.message.split(' ')[3] === account)
      const peers = posts.filter((post) => post.message.split(' ')[0] === 'peer-signup:')
                       .map(post => ({address: post.message.split(' ')[1], message: post.message.split(' ').slice(2).join(' ')}))
      setPeers(peers)
      setUserDms(dms)
      setPosts(posts);
    })
  }

  async function recordNewConfidentialThread(newThread) {
    await thread.post("dm-created " + newThread.threadAddress + " " + newThread.sender + " " + newThread.recipient)
  }

  function checkIfDmAlreadyExists(address) {
    return userDms.filter((dm) => (dm.message.split(' ')[2] === address|| 
                                  (dm.message.split(' ')[3] === address)))
  }

  //populate the discover list from ethAddresses that have signed up to be a peer. this should read from a public thread
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
                configureStream={() => setStreamConfigModalIsOpen(true)} >
              </PeerCard> 
            <StreamConfigModal 
                recipient={peer.address}
                isOpen={streamConfigModalIsOpen}
                onDismiss={() => setStreamConfigModalIsOpen(false)} />
            </React.Fragment>
            )
        })
      } return loading ? <p>loading peers...</p> : <p>no peers yet, sign up to be one!</p>
    }
        
    return (
      <Page>
      <Jumbotron>
        <JumbotronColumn>
          <MainHeader>Find your</MainHeader>
        </JumbotronColumn>
        <JumbotronColumn>
          <button onClick={async () => {
            const thread = await space.joinThreadByAddress("/orbitdb/zdpuAr4w4ZAZm1YyuDKwcRLKtXx78jH95SghFuARwB99mYVJN/3box.thread.stream.peer_list")

            await thread.deletePost("zdpuB27gHwdiXQnkqbmzYAvrDAg6pPsaUUnhXnzd19zMuEDvD")

            setThread(() => getAppsThread(thread))
               
            }}>
            Read app thread</button>
          
          {Object.keys(thread).length > 0 ? <button onClick={() => setPeerSignUpModalIsOpen(true)}>Sign up to be a peer</button>  : null}

          <PeerSignUpModal 
                thread={thread}
                isOpen={peerSignUpModalIsOpen}
                onDismiss={() => setPeerSignUpModalIsOpen(false)} />
        </JumbotronColumn>
      </Jumbotron>
      <OneLinerContainer>
        <OneLiner>Someone here might be able to help you...</OneLiner>
        <SubOneLiner>Connect with them to start a chat!</SubOneLiner> 
      </OneLinerContainer>
      <DiscoverContainer>
        {populateDiscover()}
      </DiscoverContainer>
      </Page>
    )
  }