import { useContext } from 'react'
import { Channel } from 'stream-chat-react'
import styled from 'styled-components'

import SpacesEmpty from './SpacesEmpty'
import { SpacesContext } from './SpacesLayout'

const Container = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
`

export default function SpaceContent() {
  const { spaces } = useContext(SpacesContext)

  if (!spaces) return <></>

  if (spaces.length < 1)
    return (
      <Container>
        <SpacesEmpty />
      </Container>
    )

  return (
    <Channel>
      <Container></Container>
    </Channel>
  )
}
