import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import Box from '3box'
import PeerCard from '../../components/PeerCard'
import StreamConfigModal from '../../components/StreamConfigModal'
import { useBox } from '../../hooks/'
import { Page, Jumbotron, JumbotronColumn, MainHeader, OneLinerContainer, OneLiner, SubOneLiner } from '../../theme/components'

const MOCK_PEER_LIST = ['0xdbF14da8949D157B57acb79f6EEE62412b210900', '0x8aDa904a7Df2088024eabD0de41a880AD9ECe4d3', '0xdbF14da8949D157B57acb79f6EEE62412b210900', '0xdbF14da8949D157B57acb79f6EEE62412b210900']

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
  const [userDms, setUserDms] = useState([])
  const [loading, setLoading] = useState(true)
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

    posts.map((post) => console.log(post.message))
    const dms = posts.filter((post) => post.message.split(' ')[2] === account || post.message.split(' ')[3] === account)
    console.log(dms)
    setUserDms(dms)

    await thread.onUpdate(async()=> {
      const posts = await thread.getPosts();
      console.log(posts)
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
            <PeerCard ethAddress={peer} 
                      space={space} 
                      box={box}
                      mainThread={thread}
                      dmThread={checkIfDmAlreadyExists(peer)}
                      createNewConfidentialThread={(newThread) => recordNewConfidentialThread(newThread)}
                      configureStream={() => setStreamConfigModalIsOpen(true)} >
            </PeerCard> 
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
        <JumbotronColumn>
          <MainHeader>Find your</MainHeader>
        </JumbotronColumn>
        <JumbotronColumn>
          <button onClick={async () => {
            const thread = await space.joinThreadByAddress("/orbitdb/zdpuAr4w4ZAZm1YyuDKwcRLKtXx78jH95SghFuARwB99mYVJN/3box.thread.stream.peer_list")
            
            await thread.deletePost("zdpuAmP2BEe9fRiwF5VSKrcJwCP9pec3f9XWw9dNAbwUPDwHj")
            await thread.deletePost("zdpuAqEoTaEcNR7CJEnf33KpdTE5JjmV5zL4zGR4dXGGqjgmP")
            await thread.deletePost("zdpuAyg7pTrjAT8ki2ouekZt1kWdWFnePKgykXsNyf5cduSy8")
            await thread.deletePost("zdpuAkWo9AcZY6F2ZR2mKp9nihcuXQXYC2Rpxb5CuV8L6twVh")
            await thread.deletePost("zdpuAnuFFbznkqVCsjQ3RUcUMWkgeEECruCKH483chUCNRTYW")

            
            setThread(() => getAppsThread(thread))
               
            }}>
            Read app thread</button>
          <button onClick={async () => {
            const thread = await space.joinThreadByAddress("/orbitdb/zdpuAr4w4ZAZm1YyuDKwcRLKtXx78jH95SghFuARwB99mYVJN/3box.thread.stream.peer_list")
            await thread.post("careers, investment, networking")
          setThread(() => getAppsThread(thread))}}>Post to thread</button>
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