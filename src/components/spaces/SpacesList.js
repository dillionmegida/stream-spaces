import { useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChannelList, useChatContext } from 'stream-chat-react'
import styled from 'styled-components'
import queryString from 'query-string'

import SpaceItem from '../spaces/SpaceItem'
import Dialog from '../Dialog'
import useClickOutside from '../../hooks/useClickOutside'
import { SpacesContext } from './SpacesLayout'

const Container = styled.div`
  width: var(--leftColumnWidth);
  padding: 0 15px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  .new-space-container {
    position: relative;

    .new-btn {
      max-width: 200px;
      border-radius: 30px;
      background-color: white;
      display: flex;
      align-items: center;
      padding: 10px 20px;
      margin: 0 0 20px;

      img {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
    }

    .new-space-dialog {
      padding: 10px 0;
      padding-right: 5px;
      position: absolute;
      right: -100px;
      top: 0;
      z-index: 5;

      .menu-btn {
        padding: 10px 20px;
        width: 100%;
        display: flex;
        align-items: center;
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;

        &:hover {
          background-color: #eee;
        }

        .icon {
          margin-right: 30px;

          img {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }

  .spaces-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;

    img {
      width: 40px;
      height: 40px;
      margin-bottom: 20px;
    }

    .no-spaces-text {
      color: #80868a;
      text-align: center;
      display: block;
      margin-bottom: 4px;
      font-size: 12px;
    }

    .create-space-btn {
      color: #7895dd;
      text-align: center;
      font-size: 12px;
    }
  }

  .spaces-list {
    .str-chat {
      width: 100%;
      height: 100%;

      &.messaging {
        background-color: transparent;
      }
    }

    .str-chat__channel-list-messenger {
      background: transparent;
      width: 100%;
      min-width: 100%;
    }

    .str-chat-channel-list .str-chat__channel-list-messenger__main {
      padding: 0;
      overflow: visible;
    }

    .str-chat__loading-channels {
      width: var(--leftColumnWidth);
      height: 100%;
      background: transparent;
    }
  }
`

export default function SpacesList() {
  const { channelListKey, spaces, setActiveSpace, setIsCreatingSpace } =
    useContext(SpacesContext)
  const { client } = useChatContext()

  const location = useLocation()

  const newSpaceDialogRef = useRef(null)
  const [showNewSpaceDialog, setShowNewSpaceDialog] = useState(false)

  useClickOutside(
    {
      ref: newSpaceDialogRef,
      cb: () => showNewSpaceDialog && setShowNewSpaceDialog(false),
    },
    [showNewSpaceDialog]
  )

  const { space_id } = queryString.parse(location.search)

  useEffect(() => {
    if (!spaces) return

    async function init() {
      if (space_id) {
        const spaceById = spaces.find((s) => s.id === space_id)
        if (spaceById) return setActiveSpace(spaceById)
      }

      setActiveSpace(spaces[0], false)
    }

    init()
  }, [space_id, spaces])

  const noSpaces = spaces?.length < 1

  return (
    <Container>
      <div className="new-space-container">
        <button onClick={() => setShowNewSpaceDialog(true)} className="new-btn">
          <img src="/assets/icons/add.svg" alt="" />
          New space
        </button>
        {showNewSpaceDialog && (
          <div ref={newSpaceDialogRef}>
            <Dialog className="new-space-dialog">
              {[
                {
                  icon: '/assets/icons/people.svg',
                  label: 'Create space',
                  id: 'create',
                },
                {
                  icon: '/assets/icons/grid.svg',
                  label: 'Browse spaces',
                  id: 'browse',
                },
              ].map((menu) => {
                const actions = {
                  create: () => setIsCreatingSpace(true),
                  browse: () => null,
                }

                return (
                  <button
                    onClick={() => {
                      setShowNewSpaceDialog(false)
                      actions[menu.id]()
                    }}
                    className="menu-btn"
                    key={menu.id}
                  >
                    <div className="icon">
                      <img src={menu.icon} alt="" />
                    </div>
                    <span className="label">{menu.label}</span>
                  </button>
                )
              })}
            </Dialog>
          </div>
        )}
      </div>

      {noSpaces ? (
        <div className="spaces-empty">
          <img src="/assets/icons/grid.svg" alt="" />
          <span className="no-spaces-text">No spaces yet</span>
          <button className="create-space-btn">Create or find a space</button>
        </div>
      ) : (
        <div className="spaces-list">
          <ChannelList
            key={channelListKey}
            Preview={SpaceItem}
            filters={{
              customType: 'space',
              members: { $in: [client.user.id] },
            }}
          />
        </div>
      )}
    </Container>
  )
}
