import React from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import Swal from 'sweetalert2'

const Menu = () => {
  const cardStyle = {
    borderRadius: 16,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden'
  }

  const logoStyle = {
    width: 150,
    height: 150,
    objectFit: 'cover',
    display: 'block',
    margin: 'auto'
  }

  const topOutlineStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 12,
    borderRadius: '16px 16px 0 0',
    zIndex: 1
  }

  const buttonStyle = {
    marginTop: 'auto',
    backgroundColor: '#FFEB3B'
  }

  const getUserId = async email => {
    try {
      const response = await axios.get(`https://dev-noveleno.onrender.com/api/auth/users?email=${email}`)
      return response.data.id
    } catch (error) {
      console.error('Error fetching user ID:', error)
      return null
    }
  }

  const sendAlert = async (level, description) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to send this alert?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, send it!'
      })

      if (result.isConfirmed) {
        const descriptionResult = await Swal.fire({
          title: 'Enter Description',
          input: 'textarea',
          inputLabel: 'Description',
          inputValue: description, // Pre-fill the description here
          inputPlaceholder: 'Type your description here...',
          inputAttributes: {
            'aria-label': 'Type your description here'
          },
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Send'
        })

        if (descriptionResult.isConfirmed) {
          const auth = JSON.parse(localStorage.getItem('auth'))
          const email = auth.email
          const userId = await getUserId(email)

          if (userId) {
            const response = await axios.post('https://dev-noveleno.onrender.com/api/notifications', {
              user_id: userId,
              level: level,
              description: descriptionResult.value
            })

            await Swal.fire('Success!', 'Alert has been sent.', 'success')

            // Refresh the page
            window.location.reload()
          } else {
            console.error('User ID not found')
            Swal.fire('Error', 'User ID not found.', 'error')
          }
        }
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      Swal.fire('Error', 'Failed to send the alert.', 'error')
    }
  }

  return (
    <Grid container spacing={3} alignItems='center'>
      <Grid item xs={12}>
        <Card elevation={3} style={{ ...cardStyle }}>
          <CardHeader
            title='Be Ready! Be Alert!'
            subheader='Send an alert informing the residents to prepare in a calamity.'
          />
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card elevation={3} style={{ ...cardStyle }}>
          <div style={{ ...topOutlineStyle, backgroundColor: '#FFFF00' }}></div>
          <br></br>
          <img src='/images/check-icon.png' alt='Check Alert' style={{ ...logoStyle }} />
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Be Prepare
            </Typography>
            <Typography variant='body1'>
              All users now assigned to prepare food, water, and documents in this level.
            </Typography>
            <br></br>
            <Button
              variant='contained'
              style={{ ...buttonStyle }}
              fullWidth
              onClick={() =>
                sendAlert('1', 'All users now assigned to prepare food, water, and documents in this level.')
              }
            >
              Check Alert
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card elevation={3} style={{ ...cardStyle }}>
          <div style={{ ...topOutlineStyle, backgroundColor: '#FF9800' }}></div>
          <br></br>
          <img src='/images/i-icon.png' alt='Prepare Level' style={{ ...logoStyle }} />
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Test Alert
            </Typography>
            <Typography variant='body1'>
              On this level, residents need to have a safe place for their things as the water level continues to rise.
            </Typography>
            <br></br>
            <Button
              variant='contained'
              style={{ ...buttonStyle, backgroundColor: '#FF9800' }}
              fullWidth
              onClick={() =>
                sendAlert(
                  '2',
                  'On this level, residents need to have a safe place for their things as the water level continues to rise.'
                )
              }
            >
              Test Alert
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card elevation={3} style={{ ...cardStyle }}>
          <div style={{ ...topOutlineStyle, backgroundColor: '#F44336' }}></div>
          <br></br>
          <img src='/images/red-alert.png' alt='Send Alert' style={{ ...logoStyle }} />
          <CardContent>
            <Typography variant='h6' gutterBottom>
              High-Level Alert
            </Typography>
            <Typography variant='body1'>
              Notify the public that the water is now on the verge of the cliff and flooding is expected.
            </Typography>
            <br></br>
            <Button
              variant='contained'
              style={{ ...buttonStyle, backgroundColor: '#F44336' }}
              fullWidth
              onClick={() =>
                sendAlert(
                  '3',
                  'Notify the public that the water is now on the verge of the cliff and flooding is expected.'
                )
              }
            >
              Send High-Level Alert
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Menu
