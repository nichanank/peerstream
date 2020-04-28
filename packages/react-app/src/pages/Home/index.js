import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Typed from 'typed.js'
import { useWeb3React } from '@web3-react/core'
import { useContract } from '../../hooks'
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { useWalletModalToggle } from '../../contexts/Application'
import { Jumbotron, JumbotronColumn, MainHeader, OneLinerContainer, OneLiner, SubOneLiner, TripletRow, TripletContainer, CTAButtonPrimary, JumbotronButton } from '../../theme/components'

import find_experts from '../../assets/img/find-people.png'
import meeting from '../../assets/img/meeting.png'
import transfer from '../../assets/img/transfer.png'
import sablier from '../../assets/img/logo-sablier.png'
import eth from '../../assets/img/logo-eth.png'
import threeBox from '../../assets/img/logo-3box.png'

const jumbotronMessages = ['Live conversations, live payments', '1:1 text and video chat with mentors', 'Discover domain experts and get help', 'Get feedback on your project', 'No hidden fees, instant earnings withdraw']

const ContainerHeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 3%;
`

const ContainerHeader = styled.h2`
  font-family: Ubuntu;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.primaryGreen};
`

const InfoWrapper = styled.div`
  width: 30%;
  text-align: center;
`

const InfoHeading = styled.h3`
  font-family: Ubuntu;
  color: ${({ theme }) => theme.primaryGreen};
`

const PeerTypes = styled.span`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.primaryGreen};  
`

const Description = styled.p`
  font-family: Ubuntu;
  text-align: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.primaryGreen};
`

const Image = styled.img`
  width: 25%;
  height: 80%;
`

const StyledLink = styled(Link)`
  background: ${({ theme }) => theme.primaryGreen}; 
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Ubuntu; 
  text-decoration: none;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  color: white;
  width: 10%;
  height: 15%;
  font-size: 1rem;
`

const GET_STREAMS = gql`
  {
    streams(first: 10, orderBy: timestamp, orderDirection: desc) {
      id
      cancellation {
        recipientBalance
        recipientInterest
        timestamp
        txhash
      }
      deposit
      exchangeRateInitial
      ratePerSecond
      recipient
      recipientSharePercentage
      sender
      senderSharePercentage
      startTime
      stopTime
      timestamp
      token {
        id
        decimals
        name
        symbol
      }
      txs {
        id
        block
        event
        from
        timestamp
        to
      }
      withdrawals {
        id
        amount
      }
    }
  }
`;

export function Home() {

  const sablierContract = useContract("Sablier")
  const { account } = useWeb3React() 
  const toggleWalletModal = useWalletModalToggle()

  const { loading, error, data } = useQuery(GET_STREAMS)

  useEffect(() => {
    const options = {
        strings: jumbotronMessages,
        typeSpeed: 50,
        loop: true
    }
    const typed = new Typed('#instruction', options)
    
    // destroy typed instance on unmounting to prevent memory leaks
    return () => {
        typed.destroy()
    }

}, [])

  
  async function readOnChainData() {
    const nextStreamId = await sablierContract.nextStreamId();
    console.log({ nextStreamId: nextStreamId.toString() });
  }

  const learnMoreRef = useRef(null)
  
  useEffect(() => {
    if (!loading && !error && data && data.streams) {
      console.log({ streams: data.streams });
    }
  }, [loading, error, data]);
        
  return (
    <>
      <Jumbotron>
        <JumbotronColumn>
          <MainHeader>Peer Stream</MainHeader>
          <div><PeerTypes id='instruction' /></div>
        </JumbotronColumn>
        <JumbotronColumn>
          <JumbotronButton onClick={() => learnMoreRef.current.scrollIntoView({ behavior: 'smooth' })}>Learn more</JumbotronButton>
          {/* <CTAButtonPrimary onClick={() => readOnChainData()}>Read On-Chain Data</CTAButtonPrimary> */}
        </JumbotronColumn>
      </Jumbotron>
      <OneLinerContainer ref={learnMoreRef}>
        <OneLiner>Pay-as-you-go online consultations and user interviews</OneLiner>
        <SubOneLiner>Get paid in crypto for your time, no credit card required</SubOneLiner> 
      </OneLinerContainer>
      <TripletContainer>
        <ContainerHeaderRow>
          <ContainerHeader>How it works</ContainerHeader>
        </ContainerHeaderRow>
        <TripletRow>
          <Image src={find_experts} alt="find_experts"></Image>
          <Image src={meeting} alt="meeting"></Image>
          <Image src={transfer} alt="transfer"></Image>
        </TripletRow>
        <TripletRow>
          <InfoWrapper><InfoHeading>Find experts</InfoHeading></InfoWrapper>
          <InfoWrapper><InfoHeading>Get 1-1 help</InfoHeading></InfoWrapper>
          <InfoWrapper><InfoHeading>Pay as you go</InfoHeading></InfoWrapper>
        </TripletRow>
        <TripletRow>
          <InfoWrapper><Description>Discover specialists who can give you advice, or users who can give product feedback.</Description></InfoWrapper>
          <InfoWrapper><Description>Reach out to instantly start a private chat with peers to discuss work to be done.</Description></InfoWrapper>
          <InfoWrapper><Description>Connect your Ethereum wallet and start a payment stream. No credit card required.</Description></InfoWrapper>
        </TripletRow>
      </TripletContainer>
      <TripletContainer>
        <ContainerHeaderRow>
          <ContainerHeader>Powered by</ContainerHeader>
        </ContainerHeaderRow>
        <TripletRow>
          <Image src={sablier} alt="sablier"></Image>
          <Image src={eth} alt="eth"></Image>
          <Image src={threeBox} alt="threeBox"></Image>
        </TripletRow>
      </TripletContainer>
      <OneLinerContainer>
        <SubOneLiner>Ready to get started?</SubOneLiner>
          {!account ? 
            <CTAButtonPrimary onClick={toggleWalletModal}>Connect Wallet</CTAButtonPrimary>  : 
            <StyledLink to={"/discover"}>Find a peer</StyledLink>}
      </OneLinerContainer>
    </>
  )
}