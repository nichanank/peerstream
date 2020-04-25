import React from 'react'
import { ThemeProvider as StyledComponentsThemeProvider, createGlobalStyle, css } from 'styled-components'

export * from './components'

const MEDIA_WIDTHS = {
  upToSmall: 600,
  upToMedium: 960,
  upToLarge: 1280
}

const mediaWidthTemplates = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
  accumulator[size] = (...args) => css`
    @media (max-width: ${MEDIA_WIDTHS[size]}px) {
      ${css(...args)}
    }
  `
  return accumulator
}, {})

const flexColumnNoWrap = css`
  display: flex;
  flex-flow: column nowrap;
`

const flexRowNoWrap = css`
  display: flex;
  flex-flow: row nowrap;
`

const white = '#FFFFFF'
const black = '#000000'

export default function ThemeProvider({ children }) {
  return <StyledComponentsThemeProvider theme={theme()}>{children}</StyledComponentsThemeProvider>
}

const theme = () => ({
  white,
  black,
  inputBackground: white,
  placeholderGray: '#E1E1E1',
  shadowColor: '#2F80ED',

  // pink
  pink: '#DC6BE5',
  // greens
  darkMint: '#67ce81',
  primaryGreen: '#155E63',
  secondaryGreen: '#76B39D',
  tertiaryGreen: '#F9F8EB',
  connectedGreen: '#27AE60',

  // media queries
  mediaWidth: mediaWidthTemplates,
  
  // css snippets
  flexColumnNoWrap,
  flexRowNoWrap
})

export const GlobalStyle = createGlobalStyle`
  @import url('https://rsms.me/inter/inter.css');
  html { font-family: 'Inter', sans-serif; }
  @supports (font-variation-settings: normal) {
    html { font-family: 'Inter var', sans-serif; }
  }
  
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;    
  }
  body > div {
    height: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
}
  html {
    font-size: 16px;
    font-variant: none;
    color: ${({ theme }) => theme.textColor};
    background-color: ${({ theme }) => theme.backgroundColor};
    transition: color 150ms ease-out, background-color 150ms ease-out;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
`