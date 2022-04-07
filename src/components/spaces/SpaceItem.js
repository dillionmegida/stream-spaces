import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import useClickOutside from '../../hooks/useClickOutside'
import SpaceContextMenu from './SpaceContextMenu'

const Container = styled.div`
  width: 100%;
  position: relative;
  border-radius: 30px;

  &.active {
    background-color: rgba(255, 255, 255, 0.3);
  }

  &:not(&.active):hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .popup {
    position: absolute;
    max-width: 200px;
    width: 100%;
    left: calc(var(--leftColumnWidth) - 28px);
    top: 4px;
  }

  .preview-btn {
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-right: 40px;

    .emoji {
      padding: 12px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
    }

    .name {
      padding: 10px;
      font-size: 15px;
      color: white;
      flex: 1;
      text-align: left;
    }
  }

  &:hover {
    .more-btn {
      .more-icon {
        display: block;
      }
      .pin-icon {
        display: none;
      }
    }
  }

  .more-btn {
    position: absolute;
    right: 0;
    top: 2px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    padding: 10px;
    display: flex;

    .more-icon {
      display: none;
    }

    .pin-icon {
      display: none;
      &--show {
        display: block;
      }
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.35);
    }

    img {
      width: 16px;
      height: 16px;
    }
  }
`

export default function SpaceItem({
  channel,
  displayTitle,
  active,
  setActiveChannel,
  watchers,
}) {
  const navigate = useNavigate()
  const menuRef = useRef(null)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const onClickSpace = () => {
    navigate('?space_id=' + channel.id)
    setActiveChannel(channel, watchers)
  }

  const onClickSpaceMenu = () => {
    setIsMenuOpen((isMenuOpen) => !isMenuOpen)
  }

  useClickOutside(
    { ref: menuRef, cb: () => isMenuOpen && setIsMenuOpen(false) },
    [isMenuOpen]
  )

  return (
    <Container className={active ? 'active' : ''}>
      {isMenuOpen && (
        <div ref={menuRef} className="popup">
          <SpaceContextMenu
            onClickOption={() => setIsMenuOpen(false)}
            space={channel}
          />
        </div>
      )}
      <button onClick={onClickSpace} className="preview-btn">
        <div className="emoji">
          {channel.data.emoji || channel.data.name.charAt(0)}
        </div>
        <span className="name">{displayTitle}</span>
      </button>
      <button onClick={onClickSpaceMenu} className="more-btn">
        <img
          className="pin-icon"
          src="/assets/icons/pin-white.svg"
          alt="Pin indicator"
        />
        <img
          className="more-icon"
          src="/assets/icons/more.svg"
          alt="More button"
        />
      </button>
    </Container>
  )
}
