import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send'
import Swal from 'sweetalert2'

const fetchContacts = async () => {
  try {
    const response = await fetch('https://dev-noveleno.onrender.com/api/auth/allusers')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Failed to fetch contacts:', error)
    Swal.fire({
      icon: 'error',
      title: 'Failed to Fetch Contacts',
      text: error.message
    })
    return []
  }
}

const createConversation = async (senderEmail, receiverEmail) => {
  try {
    const response = await fetch('https://dev-noveleno.onrender.com/api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        senderEmail,
        receiverEmail
      })
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to create conversation:', error)
    Swal.fire({
      icon: 'error',
      title: 'Failed to Create Conversation',
      text: error.message
    })
  }
}

const fetchMessages = async (senderEmail, receiverEmail) => {
  try {
    const response = await fetch(
      `https://dev-noveleno.onrender.com/api/messages?senderEmail=${senderEmail}&receiverEmail=${receiverEmail}`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    Swal.fire({
      icon: 'error',
      title: 'Failed to Fetch Messages',
      text: error.message
    })
    return []
  }
}

const getCurrentUserId = async email => {
  try {
    const response = await fetch('https://dev-noveleno.onrender.com/api/auth/allusers')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const users = await response.json()
    const currentUser = users.find(user => user.email === email)
    return currentUser ? currentUser.id : null
  } catch (error) {
    console.error('Failed to fetch current user ID:', error)
    Swal.fire({
      icon: 'error',
      title: 'Failed to Fetch User ID',
      text: error.message
    })
    return null
  }
}

const InboxPage = () => {
  const [contacts, setContacts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContact, setSelectedContact] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState([])
  const [replyText, setReplyText] = useState('')
  const [currentUserEmail, setCurrentUserEmail] = useState('')
  const [currentUserId, setCurrentUserId] = useState('')

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('auth'))
    if (authData) {
      setCurrentUserEmail(authData.email)
      getCurrentUserId(authData.email).then(id => setCurrentUserId(id))
      fetchContacts().then(data => {
        // Exclude current user from contacts list
        const filteredContacts = data.filter(contact => contact.email !== authData.email)
        setContacts(filteredContacts)
      })
    }
  }, [])

  const handleSelectContact = async contact => {
    setSelectedContact(contact)
    const messages = await fetchMessages(currentUserEmail, contact.email)
    if (messages.length === 0) {
      // No messages found, create a new conversation
      const newConversation = await createConversation(currentUserEmail, contact.email)
      if (newConversation) {
        setSelectedMessage([]) // Initialize with empty messages
      }
    } else {
      // Existing messages found
      setSelectedMessage(messages)
    }
  }

  const handleSendReply = async () => {
    if (selectedContact && replyText.trim() !== '') {
      // Check if replyText is not empty
      const newMessage = {
        senderEmail: currentUserEmail,
        receiverEmail: selectedContact.email,
        content: replyText.trim() // Ensure content is not empty or just whitespace
      }

      try {
        const response = await fetch('https://dev-noveleno.onrender.com/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newMessage)
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.message === 'Message sent successfully!') {
          setSelectedMessage(prev => [
            ...prev,
            {
              id: prev.length + 1,
              senderId: currentUserId, // Set senderId based on current user ID
              receiverId: selectedContact.id, // Set receiverId based on selected contact ID
              content: replyText.trim(), // Use trimmed replyText
              createdAt: new Date().toISOString() // Assuming message sent at current time
            }
          ])
          setReplyText('')
        }
      } catch (error) {
        console.error('Failed to send reply:', error)
        Swal.fire({
          icon: 'error',
          title: 'Failed to Send Reply',
          text: error.message
        })
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Message',
        text: 'Please enter a message before sending.'
      })
    }
  }

  const filteredContacts = contacts.filter(contact =>
    contact.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <CardHeader title='Contacts' />
          <CardContent>
            <TextField
              fullWidth
              placeholder='Search Contacts'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              margin='normal'
            />
            <List>
              {filteredContacts.map(contact => (
                <ListItem
                  key={contact.id}
                  button
                  onClick={() => handleSelectContact(contact)}
                  selected={selectedContact?.id === contact.id}
                >
                  <ListItemText primary={contact.fullname} secondary={`${contact.role} - ${contact.barangay}`} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card sx={{ height: '100%' }}>
          <CardHeader title='Conversation' />
          <CardContent>
            {selectedContact ? (
              <>
                <Typography variant='h6'>{selectedContact.fullname}</Typography>
                <List sx={{ mb: 2 }}>
                  {selectedMessage.map(msg => (
                    <Box
                      key={msg.id}
                      sx={{
                        display: 'flex',
                        justifyContent: msg.senderId === currentUserId ? 'flex-end' : 'flex-start',
                        mb: 1
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: msg.senderId === currentUserId ? 'success.main' : 'info.main',
                          color: 'white',
                          py: 1,
                          px: 2,
                          borderRadius: 10,
                          maxWidth: '75%',
                          wordWrap: 'break-word'
                        }}
                      >
                        {msg.content}
                        <Typography variant='caption' sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                          {new Date(msg.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </List>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    label='Reply'
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    variant='outlined'
                    margin='normal'
                    multiline
                    rows={1}
                    sx={{ flexGrow: 1 }}
                  />
                  <IconButton onClick={handleSendReply} color='primary'>
                    <SendIcon />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Typography>Select a contact to start a conversation</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default InboxPage
