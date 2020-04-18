import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import PeerCard from '../../components/PeerCard'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 0 0;
`

const Jumbotron = styled.div`
  position: relative;
  width: 100vw;
  height: 581px;
  top: 64px;
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

const Image = styled.img`
  height: 12em;
  width: 21em;
  margin-bottom: 0;
  padding-bottom: 0;
`

const Icon = styled.img`
  height: 12em;
  width: 12em;
  margin-bottom: 0;
  padding-bottom: 0;
`

function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue)

  function handleChange(e) {
    setValue(e.target.value)
  }
  return {
    value,
    onChange: handleChange
  }
}

export function Discover() {

  const { library, account } = useWeb3React()

  const [peerList, setPeerList] = useState([])

  //design the discover container
  
  
  //populate the discover list from ethAddresses that have signed up to be a peer
        
    return (
      <Page>
      <Jumbotron>
        <MainHeader>Find your mentor</MainHeader>
      </Jumbotron>
      <OneLinerContainer>
        <OneLiner>Someone here might be able to help you...</OneLiner>
        <SubOneLiner>Connect with them to start a chat!</SubOneLiner> 
      </OneLinerContainer>
      <DiscoverContainer>
        <PeerCard ethAddress='0xdbF14da8949D157B57acb79f6EEE62412b210900'>
          <div>discover</div>
        </PeerCard>
      </DiscoverContainer>
      </Page>
    )
  }