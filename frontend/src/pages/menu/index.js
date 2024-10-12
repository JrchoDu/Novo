import React from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

const Menu = () => {
  return (
    <Grid container spacing={3} alignItems='center'>
      <Grid item xs={12}>
        <Card elevation={3} style={{ borderRadius: 16 }}>
          <CardHeader title="What's for Menu?" />
          <CardContent>
            <Typography variant='body1'>
              Welcome to Menu! In the menu tab, we will let you choose what you wish to do. Help us fulfill that.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card elevation={3} style={{ borderRadius: 16 }}>
          <img
            src='/images/alert.jpeg'
            alt='Menu Options'
            style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: '16px 16px 0 0' }}
          />
          <Button href='/alert' variant='contained' color='primary' fullWidth style={{ borderRadius: '0 0 16px 16px' }}>
            Post Alert
          </Button>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card elevation={3} style={{ borderRadius: 16 }}>
          <img
            src='/images/news.jpg'
            alt='Menu Options'
            style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: '16px 16px 0 0' }}
          />
          <Button href='/news' variant='contained' color='primary' fullWidth style={{ borderRadius: '0 0 16px 16px' }}>
            Share News
          </Button>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card elevation={3} style={{ borderRadius: 16 }}>
          <img
            src='/images/message.jpeg'
            alt='Menu Options'
            style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: '16px 16px 0 0' }}
          />
          <Button href='/chat' variant='contained' color='primary' fullWidth style={{ borderRadius: '0 0 16px 16px' }}>
            Check Message
          </Button>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Menu
