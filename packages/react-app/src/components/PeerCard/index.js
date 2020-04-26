import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import Box from '3box'
import styled from 'styled-components'

import { CTAButtonSecondary } from '../../theme/components'

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
  justify-content: space-between;
  align-items: center;
  margin-left: 7%;
  margin-right: 7%;
  margin-bottom: 2%;
  height: 285px;
  background: #F9F8EB;
  border: 1px solid ${({ theme }) => theme.primaryGreen};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  border-radius: 15px;
`

const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  height: 80%;
  justify-content: center;
  padding-left: 10%;
`

const CardIconsAndButtons = styled.div`
  display: flex;
  flex-direction: column;
  height: 80%;
  justify-content: center;
  align-items: center;
  width: 30%;
`

const ProfilePic = styled.img`
  margin-left: 2%;
  width: 20%;
  height: 80%;
  border: 3px solid #000000;
  border-radius: 50%;
`

const Name = styled.h3`
  font-family: Ubuntu;
  font-style: normal;
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 41px;
  color: ${({ theme }) => theme.primaryGreen};
`

const SkillDescription = styled.p`
  font-family: Ubuntu;
  color: ${({ theme }) => theme.primaryGreen};
`

const SocialIconContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 20%;
`

const SocialIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`

export default function PeerCard({ space, peer, configureStream, createNewConfidentialThread, dmThread, setActiveChat, openChatModal, mainThread }) {

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
    let isSubscribed = true
    if (isSubscribed) {
      fetchProfile(peer.address).then((result) => {
        setProfile(result)
        setProfileImg(result.image[0].contentUrl['/'])
        fetchVerifiedAccounts(result).then((accounts) => setVerifiedAccounts(accounts))
        setLoading(false)
      })
    }
    return () => (isSubscribed = false)
  }, [peer])
  
    return (
      <Card>
        {profileImg !== "" ? <ProfilePic src={IPFS_URL + profileImg} alt={profileImg}></ProfilePic> : <ProfilePic src={threeBox_icon} alt={profileImg}></ProfilePic>}
        <CardDetails>
          <Name>{profile.name && profile.name !== "" ? profile.name : peer.address}</Name>
          <SkillDescription>{peer.message}</SkillDescription>
        </CardDetails>
        <CardIconsAndButtons>
          <SocialIconContainer>
            {verifiedAccounts.github ? <a href={GITHUB_URL + verifiedAccounts.github.username} rel="noopener noreferrer" target="_blank"><SocialIcon src={github_icon} alt={verifiedAccounts.github.proof}></SocialIcon></a> : null}
            {verifiedAccounts.twitter ? <a href={TWITTER_URL + verifiedAccounts.twitter.username} rel="noopener noreferrer" target="_blank"><SocialIcon src={twitter_icon} alt={verifiedAccounts.twitter.proof}></SocialIcon></a> : null}
            {profile.website ? <a href={profile.website} rel="noopener noreferrer" target="_blank"><SocialIcon src={website_icon} alt={profile.website}></SocialIcon></a> : null}
            <a href={THREEBOX_URL + peer.address} rel="noopener noreferrer" target="_blank"><SocialIcon src={threeBox_icon} alt={peer.address}></SocialIcon></a>
          </SocialIconContainer>
          { Object.keys(space).length > 0 ? 

            dmThread.length > 0 ? 

              // if a DM thread with this peer already exists, join it
              <CTAButtonSecondary onClick={async () => {
                  const thread = await space.joinThreadByAddress(dmThread[0].message.split(' ')[1])
                  const posts = await thread.getPosts()
                  setActiveChat(thread, posts)
                  openChatModal()
                  }}>
                Message
              </CTAButtonSecondary> :

              // if a DM thread with this peer does not already exist, create one
              <CTAButtonSecondary onClick={async () => {
                  const thread = await space.createConfidentialThread('stream-dms-' + peer.address)
                  await thread.addMember(peer.address)
                  const posts = await thread.getPosts()
                  const newThread = { threadAddress: thread.address, sender: account, recipient: peer.address }
                  createNewConfidentialThread(newThread)
                  setActiveChat(thread, posts)
                  openChatModal()}}>
                Reach out
              </CTAButtonSecondary> :
            <CTAButtonSecondary onClick={() => console.log(space)}>Connect 3Box</CTAButtonSecondary> }
            { Object.keys(space).length >= 0 ? 
                <CTAButtonSecondary onClick={configureStream}>Start Stream</CTAButtonSecondary> : 
                <button onClick={() => console.log('boo')}>connect to 3box to continue</button> }
            { peer.address === account && Object.keys(space).length ? <button onClick={async () => await mainThread.deletePost(peer.postId)}>Remove myself from list</button> : null}
        </CardIconsAndButtons>
      </Card>
    )
}