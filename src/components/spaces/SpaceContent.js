import { useContext } from 'react'
import { Channel, MessageList } from 'stream-chat-react'
import styled from 'styled-components'
import { formatDistance } from 'date-fns'

import SpacesEmpty from './SpacesEmpty'
import { SpacesContext } from './SpacesLayout'
import SpaceHeader from './SpaceHeader'
import SpaceMessageItem from './SpaceMessageItem'
import SpaceMessageInput from './SpaceMessageInput'

const Container = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 10px;
  overflow: hidden;

  .chat-body {
    height: calc(100vh - 180px);
    background-color: white;
    overflow-y: auto;
    border-radius: 10px;
    &__details {
      height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .chat-icon {
        width: 150px;
        margin-bottom: 10px;
      }

      .date {
        font-size: 12px;
        color: #b0b3b4;
        text-align: center;
      }

      .action-btns {
        margin-top: 20px;
        display: flex;
        justify-content: center;

        button {
          border: 1px solid #f4f5f6;
          border-radius: 3px;
          display: flex;
          align-items: center;
          color: #5494ee;
          padding: 10px 8px;

          &:not(:last-child) {
            margin-right: 10px;
          }

          img {
            margin-right: 7px;
          }
        }
      }

      .history-details {
        margin-top: 20px;

        &__heading {
          display: flex;
          justify-content: center;
          color: #7f8082;
          font-size: 12px;
          text-transform: uppercase;

          img {
            margin-right: 10px;
          }
        }

        p {
          text-align: center;
          font-size: 12px;
          color: #a6a8ab;
          margin-top: 3px;
        }
      }
    }

    .str-chat__list {
      padding-bottom: 100px;
      height: calc(100%);
    }

    .str-chat__li {
      &--top,
      &--single {
        .avatar {
          height: 30px;
        }
        img {
          display: block;
        }

        .message__header {
          display: flex;
        }
      }

      .str-chat__simple-reactions-list {
        border: 1px solid #d9dce0;
        border-radius: 20px;
        display: inline-flex;
        align-items: center;

        .emoji-mart-emoji span {
          width: 16px !important;
          height: 16px !important;
        }

        &-item--last-number {
          color: #1b72e8;
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 2px;
        }
      }

      .str-chat__message-simple {
        &--me {
          justify-content: flex-start;
        }

        .str-chat__reaction-list--reverse {
          left: 15px;
          right: initial;
        }

        .str-chat__reaction-list--reverse::before {
          left: -26px;
          width: 26px;
          background-position: 0 0;
        }

        .str-chat__reaction-list--reverse::after {
          right: -13px;
          width: 13px;
          background-position: -46px 0;
        }

        .str-chat__reaction-list--reverse ul {
          margin: -1px -4px 0 -16px;
        }

        .str-chat__message-simple-status {
          display: none;
        }

        .str-chat__avatar {
          order: 1;
          margin-left: 0;
          margin-right: 15px;
          position: relative;
        }

        .str-chat__message-inner {
          order: 2;
          margin-left: 0;
        }

        .str-chat__message-text-inner {
          background: transparent;
          padding: 0;
          min-height: unset;
        }

        .str-chat__message-data {
          left: 0;
        }
      }

      &--bottom {
        margin-bottom: 30px;
      }
    }
  }
`

export default function SpaceContent() {
  const { spaces, activeSpace } = useContext(SpacesContext)

  if (!spaces) return <></>

  if (spaces.length < 1)
    return (
      <Container>
        <SpacesEmpty />
      </Container>
    )

  return (
    <Channel>
      <Container>
        <SpaceHeader />
        <div className="chat-body">
          <div className="chat-body__details">
            <img
              className="chat-icon"
              src="https://www.gstatic.com/dynamite/images/new_chat_room_1x.png"
              alt=""
            />
            <p className="date">
              You created this space{' '}
              {formatDistance(
                new Date(),
                new Date(activeSpace?.data?.created_at)
              )}{' '}
              ago
            </p>
            <div className="action-btns">
              {[
                {
                  icon: '/assets/icons/user-add.svg',
                  label: 'Add people & bots',
                },
                {
                  icon: '/assets/icons/google-drive.svg',
                  label: 'Share a file',
                },
                {
                  icon: '/assets/icons/checkbox-circle.svg',
                  label: 'Assign tasks',
                },
              ].map((action) => (
                <button key={action.label}>
                  <img src={action.icon} alt="" />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>

            <div className="history-details">
              <div className="history-details__heading">
                <img src="/assets/icons/history-line.svg" alt="" />
                History is on
              </div>
              <p>Messages sent with history on are saved</p>
            </div>
          </div>
          <MessageList Message={SpaceMessageItem} />
          <SpaceMessageInput />
        </div>
      </Container>
    </Channel>
  )
}
