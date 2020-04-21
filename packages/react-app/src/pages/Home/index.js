import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useContract } from '../../hooks'
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { Page, Jumbotron, JumbotronColumn, MainHeader, OneLinerContainer, OneLiner, SubOneLiner } from '../../theme/components'

import find_experts from '../../assets/img/find-people.png'
import meeting from '../../assets/img/meeting.png'
import transfer from '../../assets/img/transfer.png'
import sablier from '../../assets/img/logo-sablier.png'
import eth from '../../assets/img/logo-eth.png'
import threeBox from '../../assets/img/logo-3box.png'

const TripletContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.tertiaryGreen};
  padding-left: 10%;
  padding-right: 10%;
  padding-top: 3%;
  padding-bottom: 3%;
`

const TripletRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`

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
  const { loading, error, data } = useQuery(GET_STREAMS);  
  
  async function readOnChainData() {
    const nextStreamId = await sablierContract.nextStreamId();
    console.log({ nextStreamId: nextStreamId.toString() });
  }
  
    useEffect(() => {
      if (!loading && !error && data && data.streams) {
        console.log({ streams: data.streams });
      }
    }, [loading, error, data]);
        
    return (
      <Page>
        <Jumbotron>
          <JumbotronColumn>
            <MainHeader>Stream money</MainHeader>
            <InfoWrapper><Description>Real time payments</Description></InfoWrapper>
          </JumbotronColumn>
          <JumbotronColumn>
            <button onClick={async () => {console.log('hi')}}>Get Started</button>
            <button onClick={() => readOnChainData()}>Read On-Chain Data</button>
          </JumbotronColumn>
        </Jumbotron>
        <OneLinerContainer>
          <OneLiner>Pay-as-you-go online consultations and user interviews</OneLiner>
          <SubOneLiner>Get paid in crypto for your time, no credit card required</SubOneLiner> 
        </OneLinerContainer>
        <TripletContainer>
          <ContainerHeaderRow>
            <ContainerHeader>How it works</ContainerHeader>
            {/* <p>Get paid in crypto for your time, no credit card required, Get paid in crypto for your time, no credit card required, Get paid in crypto for your time, no credit card required</p> */}
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
            <InfoWrapper><Description>Discover specialists who can give you advice, or users who can give product feedback</Description></InfoWrapper>
            <InfoWrapper><Description>Reach out to instantly start a private chat with them to discuss work to be done</Description></InfoWrapper>
            <InfoWrapper><Description>Connect your Ethereum wallet and start a payment stream. No credit card required.</Description></InfoWrapper>
          </TripletRow>
        </TripletContainer>
        <TripletContainer>
          <ContainerHeaderRow>
            <ContainerHeader>Powered by</ContainerHeader>
            {/* <p>Get paid in crypto for your time, no credit card required, Get paid in crypto for your time, no credit card required, Get paid in crypto for your time, no credit card required</p> */}
          </ContainerHeaderRow>
          <TripletRow>
            <Image src={sablier} alt="sablier"></Image>
            <Image src={eth} alt="eth"></Image>
            <Image src={threeBox} alt="threeBox"></Image>
          </TripletRow>
        </TripletContainer>
      </Page>
    )
  }