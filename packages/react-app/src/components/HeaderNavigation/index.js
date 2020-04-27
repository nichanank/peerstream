import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Link, withRouter } from 'react-router-dom'
import { darken } from 'polished'
import { HeaderNavigationLink } from '../../theme'

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  font-family: Ubuntu;
  :hover {
    cursor: pointer;
  }
  #navigation {
    display: inline;
    font-size: 1rem;
    margin-right: 15px;
    font-weight: 500;
    color: ${({ theme }) => theme.primaryGreen};
    :hover {
      color: ${({ theme }) => darken(0.2, theme.primaryGreen)};
    }
  }
`

function HeaderNavigation() {

  const { library } = useWeb3React()
  
    return (
      <>
        <HeaderNavigationLink>
          <StyledLink to={"/home"} id="navigation">Home</StyledLink>
        </HeaderNavigationLink>
        {library ? 
          <HeaderNavigationLink>
            <StyledLink to={"/discover"} id="navigation">Discover</StyledLink>
          </HeaderNavigationLink>
        : null}
        {/* {library ? 
          <HeaderNavigationLink>
            <StyledLink to={"/meeting"} id="navigation">Meeting</StyledLink>
          </HeaderNavigationLink>
        : null} */}
      </>
    )
}

export default withRouter(HeaderNavigation)