import { useChatContext } from 'stream-chat-react'
import styled from 'styled-components'

const StyledHeader = styled.header`
  padding: 15px 0 10px;
  display: flex;

  .left-column {
    width: var(--leftColumnWidth);

    .gmail-logo {
      margin-left: 20px;
      img {
        height: 40px;
      }
    }
  }

  .right-column {
    flex: 1;
    display: flex;
    align-items: center;

    .search-input {
      position: relative;
      height: 50px;
      width: 600px;
      color: blue;

      img {
        position: absolute;
        left: 20px;
        bottom: 0;
        top: 0;
        margin: auto 0;
      }

      input {
        background-color: rgba(255, 255, 255, 0.1);
        height: 100%;
        width: 100%;
        border-radius: 10px;
        padding-left: 50px;
        outline: none;
        font-size: 16px;

        &::placeholder {
          color: white;
        }
      }
    }

    .other-options {
      padding-right: 20px;
      margin-left: auto;
      display: flex;
      align-items: center;
      .option-btn {
        margin-right: 10px;
        img {
          width: 20px;
          height: 20px;
        }
      }

      .user-icon {
        img {
          object-fit: cover;
          border-radius: 50%;
          width: 30px;
          height: 30px;
        }
      }
    }
  }
`

export default function Header() {
  const { client } = useChatContext()

  return (
    <StyledHeader>
      <div className="left-column">
        <div className="gmail-logo">
          <img
            src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_dark_2x_r4.png"
            alt="Gmail logo"
          />
        </div>
      </div>

      <div className="right-column">
        <div className="search-input">
          <img src="/assets/icons/search.svg" alt="" />
          <input placeholder="Search spaces" />
        </div>

        <div className="other-options">
          {[
            { img: '/assets/icons/question.svg', alt: 'Help icon' },
            { img: '/assets/icons/settings.svg', alt: 'Settings icon' },
            { img: '/assets/icons/tiny-grid.svg', alt: 'Google apps icon' },
          ].map((option) => (
            <button className="option-btn" key={option.alt}>
              <img src={option.img} alt={option.alt} />
            </button>
          ))}
          <button className="user-icon">
            <img src={client.user.image} alt="Profile icon" />
          </button>
        </div>
      </div>
    </StyledHeader>
  )
}
