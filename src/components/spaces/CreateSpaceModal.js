import classNames from 'classnames'
import { Picker } from 'emoji-mart'
import { useContext, useRef, useState } from 'react'
import { useChatContext } from 'stream-chat-react'
import styled from 'styled-components'

import useClickOutside from '../../hooks/useClickOutside'
import { LayoutContext } from '../Layout'
import { removeSpaces } from '../../utils/string'
import Dialog from '../Dialog'
import { SpacesContext } from './SpacesLayout'

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-container {
    width: 100%;
    max-width: 600px;
  }
`

const Modal = styled(Dialog)`
  background-color: white;
  padding: 30px 0;

  form {
    padding: 0 20px;

    h2 {
      font-weight: 400;
      font-size: 20px;
      margin-bottom: 20px;
    }

    .space-name {
      display: flex;
      align-items: center;
      margin-bottom: 25px;

      &__input-group {
        flex: 1;

        input {
          background-color: #f8f9fa;
          height: 40px;
          width: 100%;
          padding: 8px 8px;
          border-bottom: 1px solid #e5e5e6;
          &::placeholder {
            color: #8e9295;
          }
        }
      }

      .emoji-container {
        width: 40px;
        height: 40px;
        margin-right: 15px;
        position: relative;
      }

      .emoji-btn {
        width: 40px;
        height: 40px;
        font-size: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f8f9fa;
        border-radius: 3px;
        position: relative;

        img {
          width: 25px;
          height: 25px;
        }

        &::after {
          content: '+';
          position: absolute;
          color: #1b72e8;
          bottom: 0;
          right: 0;
          width: 18px;
          height: 18px;
          font-size: 18px;
          border-radius: 3px;
          background-color: white;
        }
      }
    }

    .add-users-container {
      position: relative;
      .input-group {
        background-color: #f8f9fa;
        width: 100%;
        border-bottom: 1px solid #e5e5e6;
        display: flex;
        align-items: center;
        padding: 0 10px;

        .added-user {
          border: 1px solid #ccc;
          border-radius: 30px;
          display: flex;
          align-items: center;
          height: 30px;
          margin-right: 10px;

          &__img {
            height: 25px;
            width: 25px;
            margin-left: 2px;
            border-radius: 50%;
            margin-right: 7px;
          }

          &__name {
            color: #333;
            margin-right: 10px;
          }

          &__remove-btn {
            color: #333;
            font-size: 15px;
            margin-right: 5px;
          }
        }

        input {
          height: 40px;
          padding: 8px 8px;
          background: none;
          width: 100%;
          outline: none;
          &::placeholder {
            color: #8e9295;
          }
        }
      }

      .users-popup {
        position: absolute;
        z-index: 6;
        padding: 15px 20px 10px 0;
        left: 0;
        width: 100%;
        border-top: 1px solid #1b72e8;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;

        &__user {
          display: flex;
          align-items: center;
          padding: 10px 0 10px 30px;
          border-top-right-radius: 30px;
          border-bottom-right-radius: 30px;
          width: 100%;

          &:hover {
            background-color: #eee;
          }

          &__image {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 10px;

            img {
              width: 100%;
              height: 100%;
            }
          }

          &__details {
            display: flex;
            .online-indicator {
              margin-right: 5px;
              width: 8px;
              height: 8px;
              border: 1px solid #333;
              border-radius: 50%;

              &--online {
                background-color: green;
              }
            }
          }

          &__name {
            font-weight: bold;
            position: relative;
            top: -3px;
          }
        }
      }
    }

    .emoji-picker {
      position: absolute;
      right: 0;
      top: 50px;
      z-index: 2;
    }

    .actions {
      margin-top: 30px;
      border-top: 1px solid #e5e5e6;
      padding: 30px 20px 0;
      width: calc(100% + 40px);
      position: relative;
      left: -20px;
      display: flex;
      justify-content: flex-end;

      button {
        width: 80px;
        height: 30px;
        border-radius: 3px;
      }

      &__cancel {
        color: #1b72e8;
      }

      &__submit {
        background-color: #1b72e8;
        color: white;

        &:disabled {
          background-color: #f0f3f4;
          color: #c4c8cb;
          cursor: not-allowed;
        }
      }
    }
  }
`

export default function CreateSpaceModal() {
  const modalRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const addUserInputRef = useRef(null)
  const peoplePopupRef = useRef(null)

  const [emojiPickerOpened, setEmojiPickerOpened] = useState(false)
  const [peoplePopupOpened, setPeoplePopupOpened] = useState(false)

  const [selectedEmoji, setSelectedEmoji] = useState(null)
  const [name, setName] = useState('')
  const [usersSearch, setUsersSearch] = useState('')
  const [addedUsers, setAddedUsers] = useState([])

  const { isSpacesListOpen, setIsSpacesListOpen } = useContext(LayoutContext)

  const { users, setActiveSpace, setIsCreatingSpace } =
    useContext(SpacesContext)

  const { client } = useChatContext()

  const onSelectEmoji = (emojiObject) => {
    setSelectedEmoji(emojiObject)
    setEmojiPickerOpened(false)
  }

  useClickOutside(
    {
      ref: modalRef,
      cb: () => !emojiPickerOpened && setIsCreatingSpace(false),
    },
    [emojiPickerOpened]
  )

  useClickOutside(
    {
      ref: emojiPickerRef,
      cb: () => emojiPickerOpened && setEmojiPickerOpened(false),
    },
    [emojiPickerOpened]
  )

  useClickOutside(
    {
      ref: peoplePopupRef,
      cb: () => {
        if (
          !peoplePopupOpened ||
          addUserInputRef.current === document.activeElement
        ) {
          return
        }

        addUserInputRef.current.blur()
        setPeoplePopupOpened(false)
      },
    },
    [peoplePopupOpened]
  )

  const otherUsers = users?.filter(({ id }) => id !== client.user.id)

  const filteredUsers = otherUsers?.filter(({ name, id }) => {
    const doesSearchMatch = name
      .toLowerCase()
      .startsWith(usersSearch.toLowerCase())

    if (!doesSearchMatch) return false

    const isUserAdded = addedUsers.find((user) => id === user.id)

    if (isUserAdded) return false

    return true
  })

  const addUser = (e, u) => {
    e.stopPropagation()
    setAddedUsers((addedUsers) => [...addedUsers, u])
    addUserInputRef.current.focus()
    setUsersSearch('')
  }

  const removeAddedUser = (e, user) => {
    e.stopPropagation()
    const newUsersState = addedUsers.filter(({ id }) => id !== user.id)
    setAddedUsers(newUsersState)
    addUserInputRef.current.focus()
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const data = {
      emoji: selectedEmoji?.native || null,
      name,
    }

    const channel = client.channel(
      'messaging',
      'space-' + removeSpaces(data.name),
      {
        name: data.name,
        emoji: data.emoji,
        members: [client.user.id, ...addedUsers.map(({ id }) => id)],
        customType: 'space',
      }
    )

    await channel.watch()

    setActiveSpace(channel)

    setIsCreatingSpace(false)

    if (!isSpacesListOpen) setIsSpacesListOpen(true)
  }

  return (
    <Container>
      <div className="modal-container" ref={modalRef}>
        <Modal>
          <form onSubmit={onSubmit}>
            <h2>Create a space</h2>
            <div className="space-name">
              <div className="emoji-container">
                <button
                  onClick={() =>
                    !emojiPickerOpened && setEmojiPickerOpened(true)
                  }
                  className="emoji-btn"
                  type="button"
                >
                  {selectedEmoji ? (
                    selectedEmoji.native
                  ) : (
                    <img
                      src="/assets/icons/smiling-emoji.svg"
                      alt="Placeholder emoji"
                    />
                  )}
                </button>

                {emojiPickerOpened && (
                  <div ref={emojiPickerRef} className="emoji-picker">
                    <Picker onSelect={onSelectEmoji} />
                  </div>
                )}
              </div>

              <div className="space-name__input-group">
                <input
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Space name"
                />
              </div>
            </div>

            <div className="add-users-container">
              <div className="input-group">
                {addedUsers.length > 0 &&
                  addedUsers.map((u) => (
                    <div className="added-user" key={u.id}>
                      <img className="added-user__img" src={u.image} alt="" />
                      <span className="added-user__name">{u.name}</span>
                      <button
                        onClick={(e) => removeAddedUser(e, u)}
                        type="button"
                        className="added-user__remove-btn"
                      >
                        X
                      </button>
                    </div>
                  ))}
                <input
                  onFocus={() => setPeoplePopupOpened(true)}
                  ref={addUserInputRef}
                  onChange={({ target }) => setUsersSearch(target.value)}
                  value={usersSearch}
                  placeholder={
                    addedUsers.length < 1 ? 'Enter name of person' : ''
                  }
                />
              </div>
              {peoplePopupOpened && filteredUsers && filteredUsers.length > 0 && (
                <div ref={peoplePopupRef}>
                  <Dialog className="users-popup">
                    <ul>
                      {filteredUsers.map((u) => (
                        <li key={u.id}>
                          <button
                            onClick={(e) => addUser(e, u)}
                            className="users-popup__user"
                          >
                            <div className="users-popup__user__image">
                              <img src={u.image} alt="" />
                            </div>
                            <div className="users-popup__user__details">
                              <div
                                className={classNames(
                                  'online-indicator',
                                  u.online && 'online-indicator--online'
                                )}
                              ></div>
                              <span className="users-popup__user__name">
                                {u.name}
                              </span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </Dialog>
                </div>
              )}
            </div>

            <div className="actions">
              <button
                onClick={() => setIsCreatingSpace(false)}
                className="actions__cancel"
                type="button"
              >
                Cancel
              </button>
              <button
                disabled={!name.length}
                className="actions__submit"
                type="submit"
              >
                Create
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Container>
  )
}
