import styled, { keyframes } from 'styled-components'
import { darken } from 'polished'
import '../index.css';

export const Button = styled.button.attrs(({ warning, theme }) => ({
  backgroundColor: warning ? theme.salmonRed : theme.royalBlue
}))`
  padding: 1rem 2rem 1rem 2rem;
  border-radius: 3rem;
  cursor: pointer;
  user-select: none;
  font-size: 1rem;
  border: none;
  outline: none;
  background-color: ${({ backgroundColor }) => backgroundColor};
  transition: background-color 150ms ease-out;
  color: ${({ theme }) => theme.white};
  width: 100%;
  :hover,
  :focus {
    background-color: ${({ backgroundColor }) => darken(0.05, backgroundColor)};
  }
  :active {
    background-color: ${({ backgroundColor }) => darken(0.1, backgroundColor)};
  }
  :disabled {
    background-color: ${({ theme }) => theme.concreteGray};
    color: ${({ theme }) => theme.silverGray};
    cursor: auto;
  }
`

export const Link = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer'
})`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primaryGreen};
  :focus {
    outline: none;
    text-decoration: underline;
  }
  :active {
    text-decoration: none;
  }
`

export const ExternalLink = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer'
})`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => darken(0.3, theme.primaryGreen)};
  :focus {
    outline: none;
    text-decoration: underline;
  }
  :active {
    text-decoration: none;
  }
`

export const FooterNavigationLink = styled.div`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.secondaryGreen};
  :focus {
    outline: none;
    text-decoration: underline;
  }
  :active {
    text-decoration: none;
  }
`

export const HeaderNavigationLink = styled.div`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primaryGreen};
  :focus {
    outline: none;
    text-decoration: underline;
  }
  :active {
    text-decoration: none;
  }
`

export const BorderlessInput = styled.input`
  color: ${({ theme }) => theme.textColor};
  font-size: 1rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  background-color: ${({ theme }) => theme.inputBackground};
  [type='number'] {
    -moz-appearance: textfield;
  }
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  ::placeholder {
    color: ${({ theme }) => theme.chaliceGray};
  }
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const Spinner = styled.img`
  animation: 2s ${rotate} linear infinite;
  width: 16px;
  height: 16px;
`

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 0 0;
`

export const Jumbotron = styled.div`
  position: relative;
  font-family: Ubuntu;
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #76B39D 0%, rgba(255, 255, 255, 0) 100%), #F9F8EB;
`

export const JumbotronColumn = styled.div`
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
`

export const MainHeader = styled.h1`
  color: black;  
  font-family: Ubuntu;
  font-weight: 600;
  font-size: 2rem;
  padding-top: 4px;
  letter-spacing: 1px
`

export const OneLinerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 376px;
  background: #F9F8EB;
`

export const OneLiner = styled.h3`
  font-family: Ubuntu;
  font-style: normal;
  font-weight: normal;
  font-size: 2.5rem; 
  text-align: center;
  color: #155E63;
`

export const SubOneLiner = styled.h4`
  font-family: Ubuntu;
  font-style: normal;
  font-weight: normal;
  font-size: 1.5rem;
  text-align: center;
  color: #155E63;
`