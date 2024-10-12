import React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/system'
import StormIcon from '@mui/icons-material/FlashOn' // Storm/Flood icon
import FireIcon from '@mui/icons-material/Whatshot' // Fire/Earthquake icon
import FactoryIcon from '@mui/icons-material/Factory' // Factory/Earthquake icon

const CustomButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '120px', // Increased height for larger icons
  fontSize: '1.5rem', // Larger font size for text
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 'bold',
  color: 'white',
  backgroundImage: 'linear-gradient(45deg, #4CAF50, #388E3C)', // Gradient background
  boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
  '&:hover': {
    backgroundImage: 'linear-gradient(45deg, #388E3C, #4CAF50)',
    boxShadow: '0 6px 10px 5px rgba(76, 175, 80, .3)'
  },
  '& .MuiButton-startIcon': {
    fontSize: '5rem', // Larger icon size (adjust as needed)
    color: 'white' // White icon color
  }
}))

const UserMenu = () => {
  // Handler functions for button actions can be added here

  return (
    <Card elevation={3} sx={{ marginBottom: '20px' }}>
      <CardHeader
        title='Calamity Emergency Checklist'
        subheader='Prepare and alert residents about potential calamities.'
      />
      <Stack spacing={2} direction='column' sx={{ width: '100%', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
        <a href='/checklist?value=Flood' style={{ textDecoration: 'none' }}>
          <CustomButton startIcon={<StormIcon />} variant='contained'>
            Flood
          </CustomButton>
        </a>
        <a href='/checklist?value=Fire' style={{ textDecoration: 'none' }}>
          <CustomButton startIcon={<FireIcon />} variant='contained'>
            Fire
          </CustomButton>
        </a>
        <a href='/checklist?value=Earthquake' style={{ textDecoration: 'none' }}>
          <CustomButton startIcon={<FactoryIcon />} variant='contained'>
            Earthquake
          </CustomButton>
        </a>
      </Stack>
    </Card>
  )
}

export default UserMenu
