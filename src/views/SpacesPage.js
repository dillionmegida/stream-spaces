import React, { useEffect, useState } from 'react'
import { StreamChat } from 'stream-chat'
import { useNavigate } from 'react-router-dom'
import { Chat, LoadingIndicator } from 'stream-chat-react'

import Layout from '../components/Layout'
import { getFromStorage } from '../utils/storage'
import users from '../users'

import 'stream-chat-react/dist/css/index.css'

const API_KEY = 'f5wu7bvh4xg5'

export default function SpacesPage() {
  const [chatClient, setChatClient] = useState(null)
  const navigate = useNavigate()

  const userId = getFromStorage('user')

  const user = users.find(({ id }) => id === userId)

  useEffect(() => {
    if (!user) return navigate('/')

    const client = StreamChat.getInstance(API_KEY)

    client.connectUser(user, client.devToken(user.id))

    setChatClient(client)

    return () => {
      client?.disconnectUser()
    } // cleanup user connection on unmount
  }, [])

  return (
    <Layout>
      {!chatClient ? <LoadingIndicator /> : <Chat client={chatClient}></Chat>}
    </Layout>
  )
}
