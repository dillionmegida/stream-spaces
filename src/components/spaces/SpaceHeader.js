import { useContext } from 'react'
import styled from 'styled-components'

import { SpacesContext } from './SpacesLayout'

const Container = styled.div`
  position: relative;

  .top,
  .bottom {
    padding-left: 40px;
  }

  .top {
    display: flex;
    align-items: center;

    .arrow-left {
      position: absolute;
      left: 10px;
      img {
        width: 16px;
        height: 16px;
      }
    }

    .details {
      color: #333;
      text-align: left;
      padding: 8px;

      &:hover {
        background-color: rgba(146, 146, 146, 0.233);
        border-radius: 5px;
      }

      &__name {
        display: flex;
        align-items: center;

        &-text {
          font-size: 16px;
        }

        .menu-btn {
          margin-left: 7px;
        }
      }

      &__members {
        display: block;
        margin-top: 3px;
        font-size: 12px;
        color: #818487;
      }
    }
  }

  .menu {
    margin-top: 3px;
    border-bottom: 1px solid rgba(146, 146, 146, 0.233);

    &__btn {
      font-size: 13px;
      color: #818487;

      &:not(:last-child) {
        margin-right: 30px;
      }

      &--active {
        color: #1b72e8;
        position: relative;
        padding-bottom: 8px;

        &::after {
          content: '';
          width: 25px;
          height: 3px;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          margin: 0 auto;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          background-color: #1b72e8;
        }
      }
    }
  }
`

const menus = [
  {
    id: 'chat',
    label: 'Chat',
  },
  {
    id: 'files',
    label: 'Files',
  },
  {
    id: 'tasks',
    label: 'Tasks',
  },
]

export default function SpaceHeader() {
  const { activeSpace } = useContext(SpacesContext)

  return (
    <Container>
      <div className="top">
        <button className="arrow-left">
          <img src="/assets/icons/arrow-left.svg" alt="Go back button" />
        </button>
        <button className="details">
          <div className="details__name">
            <span className="details__name-text">
              {activeSpace?.data?.name}
            </span>
            <img
              className="menu-btn"
              src="/assets/icons/caret-down.svg"
              alt="Space menu button"
            />
          </div>
          <span className="details__members">
            {activeSpace?.data?.member_count} members
          </span>
        </button>
      </div>

      <div className="bottom menu">
        {menus.map((menu) => (
          <button
            className={
              'menu__btn ' + (menu.id === 'chat' ? 'menu__btn--active' : '')
            }
            key={menu.id}
          >
            {menu.label}
          </button>
        ))}
      </div>
    </Container>
  )
}
