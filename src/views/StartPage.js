import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import users from '../users'
import { saveToStorage } from '../utils/storage'

const Main = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  background-color: #eee;

  h1 {
    text-align: center;
    font-size: 20px;
    margin-bottom: 20px;
  }

  .users {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 300px;
    margin: 0 auto;

    &__user {
      display: flex;
      flex-direction: column;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-bottom: 5px;
      }
      .name {
        margin: 0 auto;
        text-align: center;
      }
    }
  }
`

export default function Startpage() {
  const navigate = useNavigate()

  const onClickUser = (id) => {
    saveToStorage('user', id)
    navigate('/spaces')
  }

  return (
    <Main>
      <h1>Select a user</h1>
      <div className="users">
        {users.map((u) => (
          <button
            onClick={() => onClickUser(u.id)}
            className="users__user"
            key={u.id}
          >
            <img src={u.image} />
            <span className="name">{u.name}</span>
          </button>
        ))}
      </div>
    </Main>
  )
}
