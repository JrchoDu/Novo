import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Stack from '@mui/material/Stack'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import { Typography, styled } from '@mui/material'
import axios from 'axios'

const DarkListItem = styled(ListItem)(({ theme, checked }) => ({
  backgroundColor: checked ? theme.palette.primary.dark : 'inherit',
  '&:hover': {
    backgroundColor: checked ? theme.palette.primary.dark : theme.palette.action.hover
  }
}))

const FloodChecklist = () => {
  const [checkedItems, setCheckedItems] = useState({})
  const [checklistTitle, setChecklistTitle] = useState('Flood Preparedness Checklist')
  const [authData, setAuthData] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const checklistType = params.get('value')

    if (checklistType) {
      setChecklistTitle(`${checklistType} Preparedness Checklist`)
      const storedAuth = localStorage.getItem('auth')
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth)
        setAuthData(parsedAuth)
        fetchChecklist(checklistType, parsedAuth.email)
      }
    }
  }, [])

  const fetchChecklist = async (checklistType, email) => {
    try {
      const response = await axios.get('https://dev-noveleno.onrender.com/api/checklist', {
        params: {
          email,
          checklistType
        }
      })
      const rawData = response.data.checklistData
      const parsedData = rawData ? JSON.parse(JSON.parse(rawData)) : {}
      setCheckedItems(parsedData)
    } catch (error) {
      console.error('Error fetching checklist:', error)
    }
  }

  const saveChecklist = async (checklistType, email, updatedItems) => {
    try {
      await axios.post('https://dev-noveleno.onrender.com/api/checklist', {
        email,
        checklistData: JSON.stringify(updatedItems),
        checklistType
      })

      // Second POST request (optional for logging, notifications, etc.)
      await axios.post('https://dev-noveleno.onrender.com/api/checklist', {
        email,
        action: 'Checklist Updated',
        checklistData: JSON.stringify(updatedItems),
        checklistType
      })
    } catch (error) {
      console.error('Error saving checklist:', error)
    }
  }

  const handleToggle = item => async () => {
    const updatedItems = {
      ...checkedItems,
      [item]: !checkedItems[item] // Toggle true/false
    }

    // Update the state immediately in the UI
    setCheckedItems(updatedItems)

    if (authData) {
      const params = new URLSearchParams(window.location.search)
      const checklistType = params.get('value')

      if (checklistType) {
        // Send updated items to the server immediately
        await saveChecklist(checklistType, authData.email, updatedItems)
      }
    }
  }

  return (
    <Card elevation={3} sx={{ marginBottom: '20px' }}>
      <CardHeader title={checklistTitle} subheader='Ensure essentials are ready for immediate use during floods.' />
      <Stack spacing={2} sx={{ width: '100%', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
        <List>
          {['Food', 'Water', 'PowerBank', 'Clothes', 'Flashlight', 'Candles', 'First Aid Kit'].map((item, index) => (
            <DarkListItem
              key={index}
              button
              disablePadding
              checked={checkedItems[item] || false}
              onClick={handleToggle(item)}
            >
              <Checkbox
                checked={checkedItems[item] || false}
                onChange={handleToggle(item)} // Directly toggle the checked status
                color='primary'
              />
              <ListItemText
                primary={<Typography variant='body1'>{item}</Typography>}
                sx={{ color: checkedItems[item] ? '#fff' : 'inherit' }}
              />
            </DarkListItem>
          ))}
        </List>
      </Stack>
    </Card>
  )
}

export default FloodChecklist
