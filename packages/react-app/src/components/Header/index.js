import React from 'react'
import styled from 'styled-components'
import HeaderNavigation from '../HeaderNavigation'
// import { ExternalLink } from '../../theme'
import Web3Status from '../Web3Status'

const HeaderFrame = styled.div`
  display: flex;
  width: 100vw;
  height: 64px;
  align-items: center;
  justify-content: space-between;
  background: #F9F8EB;
`

const HeaderElement = styled.div`
  margin: 1.25rem;
  display: flex;
  min-width: 0;
  display: flex;
  align-items: center;
`

const Rotate = styled.span`
  transform: rotate(0deg);
  transition: transform 1s ease-out;
  :hover {
    transform: rotate(360deg);
  }
`

const Title = styled.div`
  display: flex;
  align-items: center;
  :hover {
    cursor: pointer;
  }
  #link {
    text-decoration-color: ${({ theme }) => theme.textColor};
  }
  #title {
    display: inline;
    font-size: 1rem;
    font-weight: 500;
    margin-right: 25px;
    color: ${({ theme }) => theme.textColor};


  }
  #navigation {
    display: inline;
    font-size: 1rem;
    font-weight: 500;
    margin-right: 15px;
    color: ${({ theme }) => theme.textColor};
  }
`

export default function Header() {
  return (
    <HeaderFrame>
      <HeaderElement>
        <Title>
          <Rotate>
            {/* <ExternalLink id="link" href="https://lastofours.com">
              <span role="img" aria-label="whale">
                🌎{'  '}
              </span>
            </ExternalLink> */}
          </Rotate>
          {/* <ExternalLink id="link" href="https://lastofours.com">
            <h1 id="title">Last of Ours</h1>
          </ExternalLink> */}
          <HeaderNavigation />
        </Title>
      </HeaderElement>
      <HeaderElement>
        <Web3Status />
      </HeaderElement>
    </HeaderFrame>
  )
}