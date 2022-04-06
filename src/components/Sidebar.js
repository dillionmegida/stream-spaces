import { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { LayoutContext } from './Layout'

const links = [
  { icon: '/assets/icons/mail.svg', label: 'Mail', href: '#' },
  { icon: '/assets/icons/chat.svg', label: 'Chat', href: '#' },
  { icon: '/assets/icons/people.svg', label: 'Spaces', href: '/spaces' },
]

const Container = styled.div`
  padding: 5px;
  --borderRightColor: ${({ rightBorderVisible }) =>
    rightBorderVisible ? 'rgba(146, 146, 146, 0.433)' : 'transparent'};
  border-right: 1px solid var(--borderRightColor);
  height: 100%;

  .toggle-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 10px;

    .toggle-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 26px;
        height: 26px;
      }

      &:hover {
        background-color: rgba(146, 146, 146, 0.233);
      }
    }
  }
  .nav-links {
    display: flex;
    flex-direction: column;

    .link {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: white;
      margin-bottom: 20px;
      text-align: center;
      font-size: 12px;

      &:nth-child(3) {
        font-weight: bold;
        .img-block {
          background-color: rgba(146, 146, 146, 0.533);
        }
      }

      .img-block {
        width: 45px;
        height: 35px;
        margin-bottom: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;

        img {
          width: 20px;
          height: 20px;
        }

        &:hover {
          background-color: rgba(146, 146, 146, 0.533);
        }
      }
    }
  }
`

export default function Sidebar() {
  const { isSpacesListOpen, setIsSpacesListOpen } = useContext(LayoutContext)

  return (
    <Container rightBorderVisible={isSpacesListOpen}>
      <div className="toggle-container">
        <button
          onClick={() => setIsSpacesListOpen(!isSpacesListOpen)}
          className="toggle-btn"
        >
          <img src="/assets/icons/hamburger.svg" alt="Toggle icon" />
        </button>
      </div>
      <div className="nav-links">
        {links.map((link) => (
          <Link key={link.label} className="link" to={link.href}>
            <div className="img-block">
              <img src={link.icon} alt="" />
            </div>
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </Container>
  )
}
