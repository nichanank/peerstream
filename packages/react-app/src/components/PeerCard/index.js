import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import Box from '3box'
import styled from 'styled-components'

//socal icons
import github_icon from '../../assets/img/icon-github.png'
import twitter_icon from '../../assets/img/icon-twitter.png'
import website_icon from '../../assets/img/icon-website.png'
import threeBox_icon from '../../assets/img/icon-3box.png'

const IPFS_URL = 'https://ipfs.infura.io/ipfs/'
const TWITTER_URL = 'https://twitter.com/'
const GITHUB_URL = 'https://github.com/'
const THREEBOX_URL = 'https://3box.io/'

const Card = styled.div`  
  display: flex;
  flex-direction: row;
  align-content: center;
  margin-left: 7%;
  margin-right: 7%;
  margin-bottom: 2%;
  height: 285px;
  background: #F9F8EB;
  border: 1px solid #000000;
  box-sizing: border-box;
  border-radius: 15px;
`

const ProfilePic = styled.img`
  margin-left: 2%;
  margin-top: 2%;
  width: 20%;
  height: 80%;
  border: 3px solid #000000;
  border-radius: 50%;
`

const Name = styled.h3`
  font-family: Ubuntu Helvetica;
  font-style: normal;
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 41px;
  color: #155E63;
`


const SocialIconContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const SocialIcon = styled.img`
  margin-left: 2%;
  margin-top: 2%;
  width: 40px;
  height: 40px;
  border-radius: 50%;
`

const ConnectButton = styled.button`
  height: 20%;
  background: #76B39D;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  font-family: Ubuntu;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 132.13%;
  display: flex;
  align-items: center;
  text-align: center;
  color: #FFFFFF;
`

export default function PeerCard({ space, peer, configureStream, createNewConfidentialThread, dmThread, setActiveChat, openChatModal }) {

  const { account } = useWeb3React()
  
  const [showLoader, setShowLoader] = useState(false)
  const [profile, setProfile] = useState({})
  const [profileImg, setProfileImg] = useState('')
  const [verifiedAccounts, setVerifiedAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // populate card with 3box profile from given ethereum address
  useEffect(() => {
    setLoading(true)
    async function fetchProfile() {
      const profile = await Box.getProfile(peer.address)
      return profile
    }
    async function fetchVerifiedAccounts(profile) {
      const accounts = await Box.getVerifiedAccounts(profile)
      return accounts
    }
    fetchProfile(peer.address).then((result) => {
      setProfile(result)
      setProfileImg(result.image[0].contentUrl['/'])
      fetchVerifiedAccounts(result).then((accounts) => setVerifiedAccounts(accounts))
      setLoading(false)
    })
  }, [peer])
  
    return (
      <Card>
        {profileImg !== "" && !loading ? <ProfilePic src={IPFS_URL + profileImg} alt={profileImg}></ProfilePic> : <ProfilePic src={threeBox_icon} alt={profileImg}></ProfilePic>}
        <Name>{profile.name}</Name>
          <p>{peer.message}</p>
        <SocialIconContainer>
          {verifiedAccounts.github ? <a href={GITHUB_URL + verifiedAccounts.github.username}><SocialIcon src={github_icon} alt={verifiedAccounts.github.proof}></SocialIcon></a> : null}
          {verifiedAccounts.twitter ? <a href={TWITTER_URL + verifiedAccounts.twitter.username}><SocialIcon src={twitter_icon} alt={verifiedAccounts.twitter.proof}></SocialIcon></a> : null}
          {profile.website ? <a href={profile.website}><SocialIcon src={website_icon} alt={profile.website}></SocialIcon></a> : null}
          <a href={THREEBOX_URL + peer.address}><SocialIcon src={threeBox_icon} alt={peer.address}></SocialIcon></a>
        </SocialIconContainer>
        { Object.keys(space).length > 0 ? 

          dmThread.length > 0 ? 

              // if a DM thread with this peer already exists, join it
              <ConnectButton onClick={async () => {
                  const thread = await space.joinThreadByAddress(dmThread[0].message.split(' ')[1])
                  const posts = await thread.getPosts()
                  setActiveChat(thread, posts)
                  openChatModal()
                  }}>
                Send Message
              </ConnectButton> :

              // if a DM thread with this peer does not already exist, create one
              <ConnectButton onClick={async () => {
                  const thread = await space.createConfidentialThread('stream-dms-' + peer.address)
                  await thread.addMember(peer.address)
                  const posts = await thread.getPosts()
                  const newThread = { threadAddress: thread.address, sender: account, recipient: peer.address }
                  createNewConfidentialThread(newThread)
                  setActiveChat(thread, posts)
                  openChatModal()}}>
                Connect
              </ConnectButton>
          :
            <ConnectButton onClick={() => console.log(space)}>Connect 3Box</ConnectButton> 
          }


          { Object.keys(space).length >= 0 ? 
              <ConnectButton onClick={configureStream}>Start Stream</ConnectButton> : 
              <button onClick={() => console.log('boo')}>connect to 3box to continue</button> }
      </Card>
    )
}