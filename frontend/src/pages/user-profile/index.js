import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Avatar from '@mui/material/Avatar'

const UserDataTable = () => {
  const [profile, setProfile] = useState({
    fullname: '',
    email: '',
    role: '',
    birthday: '',
    streetNumber: '',
    streetName: '',
    barangay: '',
    contactNumber: ''
  })

  // Fetch data from localStorage on component mount
  useEffect(() => {
    const authData = localStorage.getItem('auth')
    if (authData) {
      const parsedData = JSON.parse(authData)
      setProfile({
        fullname: parsedData.fullname,
        email: parsedData.email,
        role: parsedData.role,
        birthday: parsedData.birthday,
        streetNumber: parsedData.streetNumber,
        streetName: parsedData.streetName,
        barangay: parsedData.barangay,
        contactNumber: parsedData.contactNumber
      })
    }
  }, [])

  return (
    <Grid container spacing={3} justifyContent='center'>
      {/* User Profile Card */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader title={`${profile.fullname}`} subheader={`Role: ${profile.role}`} />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Avatar
                  alt={profile.fullname}
                  src='/images/avatars/1.png'
                  style={{ width: 150, height: 150, marginBottom: '20px' }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={8}>
                <Typography variant='h6'>Email: {profile.email}</Typography>
                <Typography variant='h6'>Birthday: {new Date(profile.birthday).toLocaleDateString()}</Typography>
                <Typography variant='h6'>
                  Address: {`${profile.streetNumber} ${profile.streetName}, ${profile.barangay}`}
                </Typography>
                <Typography variant='h6'>Contact: {profile.contactNumber}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserDataTable
