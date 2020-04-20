import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import Box from '3box'
import PeerCard from '../../components/PeerCard'
import StreamConfigModal from '../../components/StreamConfigModal'

const MOCK_PEER_LIST = ['0xdbF14da8949D157B57acb79f6EEE62412b210900', '0xdbF14da8949D157B57acb79f6EEE62412b210900', '0xdbF14da8949D157B57acb79f6EEE62412b210900', '0xdbF14da8949D157B57acb79f6EEE62412b210900']

const Page = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 0 0;
`

const Jumbotron = styled.div`
  position: relative;
  width: 100vw;
  height: 581px;
  background: linear-gradient(180deg, #76B39D 0%, rgba(255, 255, 255, 0) 100%), #F9F8EB;
`

const MainHeader = styled.h1`
  color: black;  
  font-weight: 600;
  font-size: 1.5rem;
  padding-top: 4px;
  letter-spacing: 1px
`

const OneLinerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 376px;
  background: #F9F8EB;
`

const OneLiner = styled.h3`
  font-family: Ubuntu Helvetica;
  font-style: normal;
  font-weight: normal;
  font-size: 3.5rem; 
  text-align: center;
  color: #155E63;
`

const SubOneLiner = styled.h4`
  font-family: Ubuntu Helvetica;
  font-style: normal;
  font-weight: normal;
  font-size: 1.5rem;
  text-align: center;
  color: #155E63;
`

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

  const [box, setBox] = useState({})
  const [space, setSpace] = useState({})
  const [posts, setPosts] = useState([])
  const [thread, setThread] = useState({})
  const [loading, setLoading] = useState(true)
  const [streamConfigModalIsOpen, setStreamConfigModalIsOpen] = useState(false)

  // create a 3box instance and open space
  useEffect(() => {
    setLoading(true)
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
    openBox(account, library.provider).then((box) => {
      setBox(box)
      openSpace(box).then((space) => setSpace(space))
      setLoading(false)
    })
  }, [account, library.provider])
  
  //aysync retrieve people who have signed up to be peers and set peerList to this
  //people should be able to see the public thread without auth
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

    await thread.onUpdate(async()=> {
      const posts = await thread.getPosts();
      console.log(posts)
      setPosts(posts);
    })
  }

  async function recordNewConfidentialThread(newThread) {
    await thread.post("dm-start " + newThread.account + " " + newThread.recipient + " " + newThread.postId)
    // const posts = await thread.getPosts()
    // setPosts(posts)
  }

  //populate the discover list from ethAddresses that have signed up to be a peer. this should read from a public thread
  function populateDiscover() {
      // if (peers.length > 0) {
      //   return peers.map((peer, index) => {
      //     return(
      //       <React.Fragment key={index}>
      //         <PeerCard ethAddress={peer} space={space} box={box} configureStream={() => setStreamConfigModalIsOpen(true)} ></PeerCard> 
      //       <StreamConfigModal 
      //           recipient={peer}
      //           isOpen={streamConfigModalIsOpen}
      //           onDismiss={() => setStreamConfigModalIsOpen(false)} />
      //       </React.Fragment>
      //       )
      //   })
      // } return null
      return MOCK_PEER_LIST.map((peer, index) => {
        return(
          <React.Fragment key={index}>
            <PeerCard ethAddress={peer} space={space} box={box} mainThread={thread} createNewConfidentialThread={() => recordNewConfidentialThread()} configureStream={() => setStreamConfigModalIsOpen(true)} ></PeerCard> 
          <StreamConfigModal 
              recipient={peer}
              isOpen={streamConfigModalIsOpen}
              onDismiss={() => setStreamConfigModalIsOpen(false)} />
          </React.Fragment>
          )
      })
    }
        
    return (
      <Page>
      <Jumbotron>
        <MainHeader>Find your mentor</MainHeader>
        <button onClick={async () => {
          // const thread = await space.joinThread("peer_list", {
          //   firstModerator: account,
          //   members: true
          // })
          const thread = await space.joinThreadByAddress("/orbitdb/zdpuAr4w4ZAZm1YyuDKwcRLKtXx78jH95SghFuARwB99mYVJN/3box.thread.stream.peer_list")
          // await thread.post("web3, solidity, reactJS")

          setThread(() => getAppsThread(thread))
        }
      }>Read app thread</button>
      <button onClick={async () => {
          // const thread = await space.joinThread("peer_list", {
          //   firstModerator: account,
          //   members: true
          // })
          const thread = await space.joinThreadByAddress("/orbitdb/zdpuAr4w4ZAZm1YyuDKwcRLKtXx78jH95SghFuARwB99mYVJN/3box.thread.stream.peer_list")
          await thread.post("careers, investment, networking")

          setThread(() => getAppsThread(thread))
        }
      }>Post to thread</button>
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