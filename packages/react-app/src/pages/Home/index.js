import React, { useState } from 'react'
import styled from 'styled-components'
import { useContract } from '../../hooks'
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"

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
    // A pre-defined address that owns some cDAI tokens
    const nextStreamId = await sablierContract.nextStreamId();
    console.log({ nextStreamId: nextStreamId.toString() });
  }
  
    React.useEffect(() => {
      if (!loading && !error && data && data.streams) {
        console.log({ streams: data.streams });
      }
    }, [loading, error, data]);
        
    return (
      <>
        <div>hi</div>
        <button onClick={() => readOnChainData()} style={{ display: "none" }}>
          Read On-Chain Data
        </button>
      </>
    )
  }