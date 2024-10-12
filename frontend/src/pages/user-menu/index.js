// ** React Import
import React from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/system'
import DescriptionIcon from '@mui/icons-material/Description'
import DirectionsIcon from '@mui/icons-material/Directions'
import ContactsIcon from '@mui/icons-material/Contacts'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'

// ** Custom Layout Import
//import BlankLayout from 'src/@core/layouts/BlankLayout'

const CustomButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '80px',
  fontSize: '1.2rem',
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 'bold',
  backgroundImage: 'linear-gradient(45deg, #4CAF50, #388E3C)',
  boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
  color: 'white',
  '&:hover': {
    backgroundImage: 'linear-gradient(45deg, #388E3C, #4CAF50)',
    boxShadow: '0 6px 10px 5px rgba(76, 175, 80, .3)'
  }
}))

const UserMenu = () => {
  const handleLogout = () => {
    // Clear authentication data from local storage
    localStorage.removeItem('auth')
    // Optionally, you can redirect to the login page or home page
    window.location.href = '/login'
  }

  return (
    <Stack spacing={2} direction='column' sx={{ width: '100%', maxWidth: '600px', margin: 'auto' }}>
      <br></br>
      <Stack direction='row' spacing={2}>
        <CustomButton startIcon={<DescriptionIcon />} variant='contained' component='a' href='/news'>
          News
        </CustomButton>
        <CustomButton startIcon={<DirectionsIcon />} variant='contained' component='a' href='/location'>
          Emergency Routes
        </CustomButton>
      </Stack>
      <Stack direction='row' spacing={2}>
        <CustomButton startIcon={<ContactsIcon />} variant='contained' component='a' href='/emergency-hotlines'>
          Contacts
        </CustomButton>
        <CustomButton startIcon={<LocalHospitalIcon />} variant='contained' component='a' href='/calamity-emergency'>
          Emergency Kit
        </CustomButton>
      </Stack>
      <Stack direction='row' spacing={2} sx={{ mt: 4 }}></Stack>
    </Stack>
  )
}

// Define the layout and guard properties for the UserMenu component
//UserMenu.getLayout = page => <BlankLayout>{page}</BlankLayout>
//UserMenu.guestGuard = true

export default UserMenu
