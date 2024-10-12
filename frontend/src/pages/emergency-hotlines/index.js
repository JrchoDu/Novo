import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import PhoneIcon from '@mui/icons-material/Phone' // Import PhoneIcon
import { styled } from '@mui/system' // Import styled function

const ListItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.getContrastText(theme.palette.primary.main), // Get contrasting text color
  marginBottom: theme.spacing(2)
}))

const IconContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: theme.spacing(6),
  height: theme.spacing(6),
  borderRadius: '50%',
  background: `linear-gradient(to right, ${theme.palette.success.light}, ${theme.palette.success.main})`, // Green gradient
  marginRight: theme.spacing(2)
}))

const Icon = styled(PhoneIcon)(({ theme }) => ({
  fontSize: theme.typography.h4.fontSize,
  color: theme.palette.primary.contrastText // White color
}))

const AgencyName = styled(Typography)(({ theme }) => ({
  color: 'inherit', // Inherit text color from parent (ListItem)
  fontWeight: 'bold'
}))

const PhoneNumber = styled(Typography)(({ theme }) => ({
  color: 'inherit' // Inherit text color from parent (ListItem)
}))

const EmergencyHotlines = () => {
  const [hotlines, setHotlines] = useState([])

  // Fetch the hotlines data from the API
  const fetchContactData = async () => {
    try {
      const response = await fetch('https://dev-noveleno.onrender.com/api/contacts')
      if (!response.ok) {
        throw new Error('Failed to fetch contact data')
      }
      const data = await response.json()
      setHotlines(data)
    } catch (error) {
      console.error('Error fetching contact data:', error.message)
    }
  }

  useEffect(() => {
    fetchContactData()
  }, [])

  return (
    <Grid container spacing={3} justifyContent='center'>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title='Noveleta Emergency Hotlines' />
          <CardContent>
            {hotlines.map((item, index) => (
              <ListItem key={index}>
                <IconContainer>
                  <Icon />
                </IconContainer>
                <div>
                  <AgencyName variant='body1'>{item.name}</AgencyName> {/* Using item.name for the title */}
                  <PhoneNumber variant='body1'>{item.contact_no}</PhoneNumber>{' '}
                  {/* Using item.contact_no for the contact number */}
                </div>
              </ListItem>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default EmergencyHotlines
