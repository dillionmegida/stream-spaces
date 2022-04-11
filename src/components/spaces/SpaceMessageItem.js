import classNames from 'classnames'
import { format, isToday } from 'date-fns'
import { useRef, useState } from 'react'
import {
  Attachment,
  ReactionSelector,
  SimpleReactionsList,
  useMessageContext,
} from 'stream-chat-react'
import styled from 'styled-components'

import useClickOutside from '../../hooks/useClickOutside'

const MessageBlock = styled.div`
  display: flex;
  margin-bottom: 7px;

  .avatar {
    border-radius: 50%;
    overflow: hidden;
    margin-right: 20px;
    width: 30px;
    height: 0;

    img {
      display: none;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  .message {
    width: 100%;
    &__header {
      display: none;
      padding-left: 5px;
      margin-bottom: 5px;
      align-items: flex-end;
    }

    &__sender {
      font-weight: bold;
      margin-right: 10px;
    }

    &__date {
      color: #acafb1;
      font-size: 14px;
      line-height: 17px;
    }

    &__inner {
      position: relative;
      padding: 4px 6px;
    }

    &__text {
      font-size: 15px;

      &--link {
        color: #1c71e8;
      }
    }

    .str-chat__message-attachment--image {
      max-width: 300px;
    }

    &__options {
      position: absolute;
      display: none;
      background-color: white;
      border-radius: 20px;
      box-shadow: 1px 1px 3px #acafb1;
      right: 20px;
      top: -25px;
      align-items: center;

      &--open {
        display: flex;
      }

      &__btn {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        &:not(:last-child) {
          margin-right: 5px;
        }

        img {
          width: 20px;
          height: 20px;
        }

        &--emoji--active {
          background-color: #e7eaed;
        }
      }
    }

    &__inner:hover {
      background-color: #f6f6f6;
      .message__options {
        display: flex;
      }
    }

    &__reaction-selector {
      position: absolute;
      right: 280px;
      top: -90px;
      z-index: 20;
    }
  }
`

export default function SpaceMessageItem() {
  const { message } = useMessageContext()

  const reactionSelectorRef = useRef(null)
  const [showReactionSelector, setShowReactionSelector] = useState(false)
  useClickOutside(
    {
      ref: reactionSelectorRef,
      cb: () => showReactionSelector && setShowReactionSelector(false),
    },
    [showReactionSelector]
  )

  let messageDateFormatted = ''

  const messageDate = new Date(message?.created_at)
  const isTodayMessage = isToday(messageDate)

  if (isTodayMessage) {
    messageDateFormatted = format(messageDate, 'p')
  } else {
    messageDateFormatted = format(messageDate, 'ccc p')
  }

  return (
    <MessageBlock>
      <div className="avatar">
        <img src={message?.user?.image} alt="" />
      </div>

      <div className="message">
        <div className="message__header">
          <div className="message__sender">{message?.user?.name}</div>
          <div className="message__date">{messageDateFormatted}</div>
        </div>

        <div className="message__inner">
          <p
            className="message__text"
            dangerouslySetInnerHTML={{
              __html: message.text.replace(
                /https?:\/\/.*[^\s]/gi,
                (url) => `<a class='message__text--link' href=${url}>${url}</a>`
              ),
            }}
          />
          <Attachment attachments={message.attachments} />
          <SimpleReactionsList />

          {showReactionSelector && (
            <div
              ref={reactionSelectorRef}
              className="message__reaction-selector"
            >
              <ReactionSelector />
            </div>
          )}
          <div
            className={classNames('message__options', {
              'message__options--open': showReactionSelector,
            })}
          >
            {[
              {
                icon: '/assets/icons/smiling-emoji.svg',
                alt: 'Choose emoji',
                id: 'emoji',
                onClick: () => setShowReactionSelector(true),
              },
              {
                icon: '/assets/icons/pencil.svg',
                alt: 'Edit message',
                id: 'edit',
              },
              {
                icon: '/assets/icons/delete.svg',
                alt: 'Delete message',
                id: 'delete',
              },
            ].map((opt) => (
              <button
                onClick={opt.onClick}
                className={classNames('message__options__btn', {
                  [`message__options__btn--${opt.id}--active`]:
                    showReactionSelector,
                })}
                key={opt.id}
              >
                <img src={opt.icon} alt={opt.alt} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </MessageBlock>
  )
}
