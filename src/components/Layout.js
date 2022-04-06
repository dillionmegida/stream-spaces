import React, { createContext, useState } from 'react'
import styled from 'styled-components'

import Sidebar from './Sidebar'
import { getFromStorage, saveToStorage } from '../utils/storage'

const Container = styled.div`
  display: flex;
  background-color: #333;
  height: 100vh;
  width: 100%;
  position: relative;
  background: url(/assets/images/colored-background.jpg) center no-repeat;
  &::after {
    position: absolute;
    content: '';
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 0;
  }

  .sidebar,
  .content {
    position: relative;
    z-index: 1;
    height: 100vh;
  }

  .content {
    width: 100%;
    flex: 1;
  }
`

const spacesListStatusFromStorage = getFromStorage('is_spaces_list_open')

export const LayoutContext = createContext()

export default function Layout({ children }) {
  const [isSpacesListOpen, setIsSpacesListOpen] = useState(
    spacesListStatusFromStorage === 'true' ? true : false
  )

  const setSpacesStatus = (status) => {
    const statusToBoolean = status || status === 'true' ? true : false
    saveToStorage('is_spaces_list_open', statusToBoolean)
    setIsSpacesListOpen(statusToBoolean)
  }

  return (
    <LayoutContext.Provider
      value={{
        isSpacesListOpen,
        setIsSpacesListOpen: setSpacesStatus,
      }}
    >
      <Container>
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="content">{children}</div>
      </Container>
    </LayoutContext.Provider>
  )
}
