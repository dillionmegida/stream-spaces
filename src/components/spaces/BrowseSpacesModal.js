import classNames from 'classnames'
import { useContext, useEffect, useRef, useState } from 'react'
import { useChatContext } from 'stream-chat-react'
import styled from 'styled-components'

import useClickOutside from '../../hooks/useClickOutside'
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
  z-index: 5;

  .modal-container {
    width: 100%;
    max-width: 500px;
  }
`

const Modal = styled(Dialog)`
  width: 100%;
  background-color: white;

  .header {
    display: flex;
    align-items: center;
    padding: 20px 20px;
    box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%),
      0 3px 1px -2px rgb(0 0 0 / 20%);

    h2 {
      font-weight: 400;
      flex: 1;
    }

    .nav {
      width: 80px;
      display: flex;
      justify-content: space-between;
    }
  }

  .body {
    padding: 40px 20px;

    &__content {
      width: 100%;
      min-height: 350px;
      input {
        background-color: #f8f9fa;
        height: 40px;
        width: 100%;
        padding: 10px 8px;
        border-bottom: 1px solid #e5e5e6;
        &::placeholder {
          color: #8e9295;
          width: 100%;
        }
      }

      &__space-list {
        border: 1px solid #eaeaea;
        border-radius: 5px;
        margin-top: 40px;

        &--empty {
          display: none;
        }

        &__item {
          position: relative;
          display: flex;
          padding: 15px 30px;
          justify-content: space-between;

          &:hover {
            background-color: #eee;
          }

          .details {
            text-align: left;
            flex: 1;
            .name {
              display: block;
              font-size: 15px;
              margin-bottom: 6px;
            }
            .members-count {
              font-size: 13px;
              color: #5f6367;
            }
          }

          &:not(:last-child) {
            border-bottom: 1px solid #e5e5e6;
          }

          .add-btn {
          }
        }
      }

      .empty-list {
        margin-top: 40px;
        border: 1px solid #eaeaea;
        height: 240px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        &--empty {
          display: none;
        }

        img {
          width: 100px;
        }

        p {
          margin: 15px 0 25px;
        }

        button {
          background-color: #1b72e8;
          color: white;
          border-radius: 3px;
          padding: 10px 20px;
        }
      }
    }
  }
`

export default function BrowseSpacesModal() {
  const { client } = useChatContext()

  const {
    updateChannelListKey,
    setActiveSpace,
    isBrowsingSpaces,
    setIsBrowsingSpaces,
    setIsCreatingSpace,
  } = useContext(SpacesContext)

  const [spaces, setSpaces] = useState([])
  const [filteredSpaces, setFilteredSpaces] = useState([])

  const modalRef = useRef(null)

  const [inputValue, setInputValue] = useState('')

  useClickOutside(
    {
      ref: modalRef,
      cb: () => setIsBrowsingSpaces(false),
    },
    [isBrowsingSpaces]
  )

  useEffect(() => {
    const getSpaces = async () => {
      const spaces = await client.queryChannels({
        customType: 'space',
        members: { $nin: [client.user.id] },
      })

      setSpaces(spaces)
      setFilteredSpaces(spaces)
    }

    getSpaces()
  }, [])

  useEffect(() => {
    const filteredSpaces = spaces.filter((s) =>
      s.data.name.toLowerCase().startsWith(inputValue.toLowerCase())
    )

    setFilteredSpaces(filteredSpaces)
  }, [inputValue])

  return (
    <Container>
      <div ref={modalRef} className="modal-container">
        <Modal>
          <div className="header">
            <h2>Browse Spaces</h2>
            <div className="nav">
              {[
                {
                  icon: '/assets/icons/more-dark.svg',
                  alt: 'Menu',
                  id: 'menu',
                },
                { icon: '/assets/icons/close.svg', alt: 'Close', id: 'close' },
              ].map((m) => {
                const actions = {
                  close: () => setIsBrowsingSpaces(false),
                }

                return (
                  <button onClick={() => actions[m.id]()} key={m.id}>
                    <img src={m.icon} alt={m.alt} />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="body">
            <div className="body__content">
              <input
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Space name"
              />

              <ul
                className={classNames(
                  'body__content__space-list',
                  filteredSpaces.length < 1 &&
                    'body__content__space-list--empty'
                )}
              >
                {filteredSpaces.map((s) => {
                  const membersCount = Object.keys(s.state.members).length

                  const joinSpace = async () => {
                    await s.addMembers([client.user.id])
                    await s.watch()

                    setActiveSpace(s)

                    setIsBrowsingSpaces(false)
                    updateChannelListKey(true)
                  }

                  return (
                    <li className="body__content__space-list__item" key={s.id}>
                      <div className="details">
                        <span className="name">{s.data.name}</span>
                        <span className="members-count">
                          {membersCount} members
                        </span>
                      </div>
                      <button onClick={joinSpace} className="add-btn">
                        <img
                          src="/assets/icons/add-blue.svg"
                          alt="Join space"
                        />
                      </button>
                    </li>
                  )
                })}
              </ul>

              <div
                className={classNames(
                  'empty-list',
                  filteredSpaces.length > 0 && 'empty-list--empty'
                )}
              >
                <img
                  src="https://www.gstatic.com/dynamite/images/room_doesnot_exist_2x.png"
                  alt=""
                />
                <p>Can't find a matching space or you've already joined it</p>
                <button
                  onClick={() => {
                    setIsBrowsingSpaces(false)
                    setIsCreatingSpace(true)
                  }}
                >
                  Create space
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </Container>
  )
}
