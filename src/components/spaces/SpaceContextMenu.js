import classNames from 'classnames'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChatContext } from 'stream-chat-react'
import styled from 'styled-components'

import Dialog from '../Dialog'
import { SpacesContext } from './SpacesLayout'

const Container = styled(Dialog)`
  width: 100%;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  padding: 10px 0;

  .menu-btn {
    display: flex;
    align-items: center;
    width: 100%;
    text-align: left;
    padding: 7px 10px;

    &:hover {
      background-color: #ccc;
    }

    &__icon {
      width: 20px;
      margin-right: 20px;

      &--pin--unpin {
        position: relative;
        &::after {
          content: '';
          width: 2px;
          height: 20px;
          background-color: #5f6367;
          transform: rotate(45deg);
          position: absolute;
          right: 0;
          left: 0;
          margin: auto;
          bottom: 0;
          top: 0;
        }
      }

      img {
        width: 20px;
        height: 20px;
      }
    }

    &__details {
      .main-text {
        display: block;
        margin-bottom: 2px;
      }

      .sub-text {
        color: #666;
        font-size: 13px;
      }
    }
  }
`

export default function SpaceContextMenu({ space, onClickOption }) {
  const { client } = useChatContext()

  const { setActiveSpace, spaces, activeSpace, pinSpace, unpinSpace } =
    useContext(SpacesContext)

  const navigate = useNavigate()

  const onLeave = async () => {
    space.removeMembers([client.user.id])

    if (activeSpace.cid === space.cid) {
      const spacesForThisUser = spaces.filter((s) => s.cid !== space.cid)

      setActiveSpace(spacesForThisUser[0])
      navigate('?space_id=' + spacesForThisUser[0].id)
    }
  }

  const onPin = async () => {
    pinSpace(space.cid)
    onClickOption()
  }

  const onUnpin = async () => {
    unpinSpace(space.cid)
    onClickOption()
  }

  const spaceIsPinned = client.user.pinned_spaces?.includes(space.cid)

  const menu = [
    {
      label: spaceIsPinned ? 'Unpin' : 'Pin',
      icon: '/assets/icons/pin.svg',
      id: 'pin',
    },
    {
      label: 'Leave',
      icon: '/assets/icons/arrow-down.svg',
      subLabel: 'You can always return',
      id: 'leave',
    },
  ]

  const menuClicks = {
    leave: onLeave,
    pin: spaceIsPinned ? onUnpin : onPin,
  }

  return (
    <Container>
      {menu.map((m) => (
        <button
          onClick={() => menuClicks[m.id]()}
          className="menu-btn"
          key={m.id}
        >
          <div
            className={classNames('menu-btn__icon', `menu-btn__icon--${m.id}`, {
              [`menu-btn__icon--${m.id}--unpin`]: spaceIsPinned,
            })}
          >
            <img src={m.icon} alt="" />
          </div>
          <div className="menu-btn__details">
            <span className="main-text">{m.label}</span>
            {m.subLabel && <span className="sub-text">{m.subLabel}</span>}
          </div>
        </button>
      ))}
    </Container>
  )
}
