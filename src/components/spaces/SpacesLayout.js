import { createContext, useContext, useEffect, useState } from 'react'
import { useChatContext } from 'stream-chat-react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'

import Header from './Header'
import SpaceContent from './SpaceContent'
import SpacesList from './SpacesList'
import { LayoutContext } from '../Layout'

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  --leftColumnWidth: 270px;

  .body {
    flex: 1;
    display: flex;
    width: 100%;

    .left-column {
      position: relative;
      z-index: 1;
      transition: visibility 300ms, opacity 300ms, transform 300ms, width 300ms;

      &--hidden {
        opacity: 0;
        transform: translateX(-301px);
        width: 0;
        visibility: hidden;
      }

      &--show {
        opacity: 1;
        visibility: visible;
        transform: translateX(0);
        width: var(--leftColumnWidth);
        transition: transform 300ms, width 300ms;
      }
    }

    .right-column {
      flex: 1;
      width: 100%;
      padding-right: 20px;

      .str-chat,
      .str-chat__container {
        border-radius: 10px;
        height: 100%;
      }

      .str-chat-channel {
        height: 100%;
      }

      .str-chat.messaging {
        background-color: white;
      }

      .str-chat__date-separator {
        display: none;
      }
    }
  }
`

export const SpacesContext = createContext()

export default function SpacesLayout() {
  const navigate = useNavigate()
  const { client, setActiveChannel, channel } = useChatContext()
  const [spaces, setSpaces] = useState(null)

  const setActiveSpace = (space, shouldNavigate = true) => {
    setActiveChannel(space)
    shouldNavigate && navigate('?space_id=' + space.id)
  }

  const { isSpacesListOpen } = useContext(LayoutContext)

  const [channelListKey, setChannelListKey] = useState(Math.random())

  const updateChannelListKey = () => setChannelListKey(Math.random())

  useEffect(() => {
    if (!client) return

    const initChannels = async () => {
      const spaces = await client.queryChannels({
        customType: 'space',
        members: { $in: [client.user.id] },
      })
      setSpaces(spaces)
    }

    initChannels()
  }, [client])

  return (
    <SpacesContext.Provider
      value={{
        updateChannelListKey,
        channelListKey,
        spaces,
        activeSpace: channel,
        setActiveSpace,
      }}
    >
      <Container>
        <div>
          <Header />
        </div>
        <div className="body">
          <div
            className={classNames(
              'left-column',
              isSpacesListOpen ? 'left-column--show' : 'left-column--hidden'
            )}
          >
            <SpacesList />
          </div>

          <div className="right-column">
            <SpaceContent></SpaceContent>
          </div>
        </div>
      </Container>
    </SpacesContext.Provider>
  )
}
