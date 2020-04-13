import React, { useState } from 'react'
import styled from 'styled-components'

const Jumbotron = styled.div`
  text-align: center;
  padding-top: 86px;
  padding-bottom: 115px;
  background-size: cover;
  margin-bottom: 7%;
`

const MainHeader = styled.h1`
  color: rgb(31, 31, 31);
  font-weight: 800;
  font-size: 3.7rem;
  text-align: center;
`

const SubHeader = styled.p`
  color: rgb(31, 31, 31);
  font-weight: 800;
  font-size: 1.5rem;
  text-align: center;
`

const OneLinerWrapper = styled.div`
  font-size: 0.9em;  
  margin-bottom: 2em;
  margin-top: 2em;
  margin-left: 1em;
  margin-right: 1em;
  
`

const OneLiner = styled.h5`
  color: ${({ theme }) => theme.textColor};
  text-align: center;
  word-spacing: 2px;
`

const Header = styled.h3`
  color: ${({ theme }) => theme.textColor};  
  font-weight: 600;
  font-size: 1.5rem;
  padding-top: 4px;
  letter-spacing: 1px
`

const Description = styled.p`
  color: ${({ theme }) => theme.textColor};  
  font-weight: 400;
  font-size: 1rem;
  margin: 0;
  text-align: center;
  padding-left: 15px;
  padding-right: 15px;
`

const Image = styled.img`
  height: 12em;
  width: 21em;
  margin-bottom: 0;
  padding-bottom: 0;
`

const Icon = styled.img`
  height: 12em;
  width: 12em;
  margin-bottom: 0;
  padding-bottom: 0;
`

function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue)

  function handleChange(e) {
    setValue(e.target.value)
  }
  return {
    value,
    onChange: handleChange
  }
}

export function Discover() {
        
    return (
      <>
        <div>discover</div>
      </>
    )
  }