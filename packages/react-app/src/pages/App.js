import React, { useEffect, Suspense, lazy,  } from 'react'
import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import styled from 'styled-components'
import { Home } from './Home'
import { Discover } from './Discover'
import { useWeb3React } from '@web3-react/core'
import Web3ReactManager from '../components/Web3ReactManager'

// import Header from '../components/Header'
// import Footer from '../components/Footer'

import { isAddress } from '../utils'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  height: 100vh;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const FooterWrapper = styled.div`
  width: 100%;
  min-height: 30px;
  align-self: flex-end;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`

const Body = styled.div`
  /* margin: 0 1.25rem 1.25rem 0; */
  `
  
export default function App() {

  const context = useWeb3React()

  if (!context.active && !context.error) {
    console.log('loading...')
    console.log(context)
  } else if (context.error) {
    console.log('error')
    console.log(context)
  } else {
    console.log('success')
    console.log(context)
  }

  return (
    <>
      <Suspense fallback={null}>
        <AppWrapper>
          <BrowserRouter>
            <HeaderWrapper>
              {/* <Header /> */}
            </HeaderWrapper>
            <BodyWrapper>
              <Body>
                <Web3ReactManager>
                  <Suspense fallback={null}>
                    <Route exact path="/" component={Home} />
                    <Route path={"/home"} component={Home} />
                    <Route path={"/discover"} component={Discover} />
                  </Suspense>
                </Web3ReactManager>
              </Body>
            </BodyWrapper>
            <FooterWrapper>
              {/* <Footer /> */}
            </FooterWrapper>
          </BrowserRouter>
        </AppWrapper>
      </Suspense>
    </>
  )
}