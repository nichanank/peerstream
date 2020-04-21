import React from 'react'
import styled from 'styled-components'
import { darken, transparentize } from 'polished'
// import FooterNavigation from '../FooterNavigation'

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
  min-width: 0;
  display: flex;
  align-items: center;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textColor};
  :hover {
    cursor: pointer;
  }
  #link {
    text-decoration-color: ${({ theme }) => theme.primaryGreen};
  }
  #title {
    display: inline;
    font-size: 0.825rem;
    margin-right: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.textColor};
    :hover {
      color: ${({ theme }) => theme.textColor};
    }
  }
`

export default function Footer() {

  return (
    <FooterFrame>
      <FooterElement>
        <Title>
          <ExternalLink id="link" href="https://nichanank.com/">
            <h1 id="title">About</h1>
          </ExternalLink>
          {/* <FooterNavigation /> */}
        </Title>
      </FooterElement>
    </FooterFrame>
  )

}