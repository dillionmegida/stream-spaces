import styled from 'styled-components'
import { useContext } from 'react'
import { SpacesContext } from './SpacesLayout'

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 100%;

  .img-block {
    width: 300px;
    height: 250px;

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  h3 {
    font-family: 'Open Sans';
    font-size: 22px;
    font-weight: 600;
    line-height: 40px;
    color: #202124;
    margin: 0 0 10px;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #5f6368;
  }

  .create-space-btn {
    background-color: #1b72e8;
    color: white;
    margin-top: 30px;
    width: 130px;
    height: 35px;
    border-radius: 3px;
  }

  .browse-spaces-btn {
    margin-top: 25px;
    color: #1b72e8;
  }
`

export default function SpacesEmpty() {
  const { setIsCreatingSpace, setIsBrowsingSpaces } = useContext(SpacesContext)

  return (
    <Container>
      <div className="img-block">
        <img
          src="http://ssl.gstatic.com/ui/v1/icons/mail/rfr/zero_state_rooms_2x.png"
          alt=""
        />
      </div>
      <h3>Do more together in spaces</h3>
      <p>
        Tackle group projects, chat with your team, or share your interests 🍰
      </p>
      <button
        onClick={() => setIsCreatingSpace(true)}
        className="create-space-btn"
      >
        Create a space
      </button>
      <button
        onClick={() => setIsBrowsingSpaces(true)}
        className="browse-spaces-btn"
      >
        Browse spaces
      </button>
    </Container>
  )
}
