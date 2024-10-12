import React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/system'
import ClothesIcon from '@mui/icons-material/ShoppingBag' // Clothes icon
import LocalHospitalIcon from '@mui/icons-material/LocalHospital' // Medic icon
import FastfoodIcon from '@mui/icons-material/Fastfood' // Food icon
import DescriptionIcon from '@mui/icons-material/Description' // File icon
import Grid from '@mui/material/Grid'

const CustomButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '120px', // Increased height for larger icons
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 'bold',
  color: '#4CAF50', // Green color for secondary buttons
  border: '2px solid #4CAF50', // Green border
  '&:hover': {
    color: 'white' // White text on hover
  },
  '& .MuiButton-startIcon': {
    fontSize: '5rem', // Larger icon size (adjust as needed)
    color: '#4CAF50', // Green icon color
    marginBottom: '10px' // Optional: Adjust icon position
  }
}))

const UserMenu = () => {
  // Handler functions for button actions can be added here

  return (
    <Card elevation={3} sx={{ marginBottom: '20px' }}>
      <CardHeader
        title='Flood Preparedness Kits'
        subheader='Ensure essentials are ready for immediate use during floods.'
      />
      <Stack spacing={2} sx={{ width: '100%', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <CustomButton startIcon={<ClothesIcon />} variant='outlined'>
              {/* No label */}
            </CustomButton>
          </Grid>
          <Grid item xs={6} md={3}>
            <CustomButton startIcon={<LocalHospitalIcon />} variant='outlined'>
              {/* No label */}
            </CustomButton>
          </Grid>
          <Grid item xs={6} md={3}>
            <CustomButton startIcon={<FastfoodIcon />} variant='outlined'>
              {/* No label */}
            </CustomButton>
          </Grid>
          <Grid item xs={6} md={3}>
            <CustomButton startIcon={<DescriptionIcon />} variant='outlined'>
              {/* No label */}
            </CustomButton>
          </Grid>
        </Grid>
      </Stack>
    </Card>
  )
}

export default UserMenu
