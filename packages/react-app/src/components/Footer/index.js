import React from 'react'
import styled from 'styled-components'
import { ExternalLink } from '../../theme'

const FooterFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: linear-gradient(180deg, #F9F8EB 0%, rgba(255, 255, 255, 0) 100%), #76B39D;
`

const FooterElement = styled.div`
  margin: 1.25rem;
  display: flex;
  justify-content: space-between;
  min-width: 0;
  display: flex;
  align-items: center;
`

const Title = styled.div`
  display: flex;
  flex-direction: row;
  font-family: Ubuntu;
  justify-content: space-between;
  color: ${({ theme }) => theme.primaryGreen};
  :hover {
    cursor: pointer;
  }
  #link {
    text-decoration-color: ${({ theme }) => theme.primaryGreen};
  }
  #title {
    display: inline;
    font-size: 0.825rem;
    font-weight: 400;
    margin-right: 12px;
    color: ${({ theme }) => theme.primaryGreen};
    :hover {
      color: ${({ theme }) => theme.secondaryGreen};
    }
  }
`

export default function Footer() {

  return (
    <FooterFrame>
      <FooterElement>
        <Title>
          <ExternalLink id="link" href="https://github.com/nichanank/peerstream/blob/master/README.md">
            <h1 id="title">About</h1>
          </ExternalLink>
          <ExternalLink id="link" href="https://github.com/nichanank/peerstream">
            <h1 id="title">Code</h1>
          </ExternalLink>
          <ExternalLink id="link" href="https://twitter.com/nichanank">
            <h1 id="title">Twitter</h1>
          </ExternalLink>
        </Title>
      </FooterElement>
      <FooterElement>
        <Title>
          <ExternalLink id="link" href="https://nichanank.com/">
            <h1 id="title"><span role="img" aria-label="heart">Made with ❤️ by Nichanan Kesonpat</span></h1>
          </ExternalLink>
        </Title>
        </FooterElement>
    </FooterFrame>
  )

}