import React from 'react'
import styled from 'styled-components'
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
  
    return (
      <>
        <HeaderNavigationLink>
          <StyledLink to={"/home"} id="navigation">Home</StyledLink>
        </HeaderNavigationLink>
        <HeaderNavigationLink>
          <StyledLink to={"/discover"} id="navigation">Discover</StyledLink>
        </HeaderNavigationLink>
      </>
    )
}

export default withRouter(HeaderNavigation)