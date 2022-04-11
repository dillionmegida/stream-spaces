import { Picker } from 'emoji-mart'
import { useRef, useState } from 'react'
import { useChannelActionContext } from 'stream-chat-react'
import styled from 'styled-components'

import useClickOutside from '../../hooks/useClickOutside'

const Container = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  height: 100px;
  padding: 0 20px;
  background-color: white;
  display: flex;
  align-items: center;

  .input-block {
    display: flex;
    position: relative;
    bottom: 0;
    align-items: center;
    width: 100%;
  }

  .add-btn {
    width: 22px;
    height: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #707377;
    border: 2px solid #707377;
    font-size: 13px;
    font-weight: bold;
    border-radius: 50%;
    padding-bottom: 2px;
  }

  form {
    display: flex;
    align-items: center;
    margin-left: 20px;
    flex: 1;
    width: 100%;

    .text-input-group {
      position: relative;
      height: 50px;
      width: 100%;

      .text-input {
        height: 100%;
        border: 1px solid #dbdde1;
        width: 100%;
        border-radius: 50px;
        padding: 0 20px;
      }

      .input-options {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
        padding: 0 10px;
        display: flex;
        align-items: center;

        .emoji-input {
          width: 34px;
          height: 34px;
          position: relative;

          &--open::before {
            content: '';
            width: 38px;
            height: 38px;
            background-color: #e5eefc;
            border-radius: 50%;
            position: absolute;
            left: -3px;
            top: -3px;
          }

          .default-emoji {
            width: 100%;
            height: 100%;
            position: relative;
            z-index: 1;
          }

          .emoji-picker {
            position: absolute;
            right: 0;
            bottom: 40px;
          }
        }
      }
    }

    .submit-btn {
      margin-left: 10px;
      &:disabled {
        opacity: 0.5;
      }
    }
  }
`

export default function SpaceMessageInput() {
  const emojiPickerRef = useRef(null)
  const { sendMessage } = useChannelActionContext()

  const [text, setText] = useState('')

  const [isEmojiOpen, setIsEmojiOpen] = useState(false)

  const onClickEmoji = (emojiObj) => {
    console.log({ emojiObj })
    setText(text + emojiObj.native)
  }

  useClickOutside(
    {
      ref: emojiPickerRef,
      cb: () => isEmojiOpen && setIsEmojiOpen(false),
    },
    [isEmojiOpen]
  )

  const onSubmit = async (e) => {
    e.preventDefault()

    await sendMessage({ text })
    setText('')
  }

  return (
    <Container>
      <div className="input-block">
        <button className="add-btn">+</button>
        <form onSubmit={onSubmit}>
          <div className="text-input-group">
            <input
              onChange={(e) => setText(e.target.value)}
              placeholder="History is on"
              className="text-input"
              value={text}
            />
            <div className="input-options">
              <button
                type="button"
                onClick={() => setIsEmojiOpen(true)}
                className={
                  'emoji-input' + (isEmojiOpen ? ' emoji-input--open' : '')
                }
              >
                <img
                  className="default-emoji"
                  src="/assets/icons/smiling-emoji.svg"
                  alt="Emoji icon"
                />
                {isEmojiOpen && (
                  <div ref={emojiPickerRef} className="emoji-picker">
                    <Picker onSelect={onClickEmoji} />
                  </div>
                )}
              </button>
            </div>
          </div>
          <button
            className="submit-btn"
            disabled={text.length < 1}
            type="submit"
          >
            <img src="/assets/icons/send.svg" alt="Send message" />
          </button>
        </form>
      </div>
    </Container>
  )
}
