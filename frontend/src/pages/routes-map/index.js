import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { createTheme, ThemeProvider } from '@mui/material/styles' // Import ng createTheme at ThemeProvider
import MapIcon from '@mui/icons-material/Map' // Import ng MapIcon

// Custom theme na may yellow color
const theme = createTheme({
  palette: {
    primary: {
      main: '#ffff00' // Yellow color
    }
  }
})

const UserDataTable = () => {
  const [selectedMap, setSelectedMap] = useState(null)

  const handleMapChange = mapName => {
    setSelectedMap(mapName)
  }

  const handleCloseMap = () => {
    setSelectedMap(null)
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={3} justifyContent='center'>
        {/* Left Side: Buttons */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ py: 2 }}>
              <CardHeader title='Noveleta Evacuation Centers' />
              <Button
                variant='contained'
                color='primary' // Color set to primary, which we have overridden as yellow in the custom theme
                fullWidth
                onClick={() => handleMapChange('Route 1')}
                sx={{ mb: 2, bgcolor: '#ffff00', '&:hover': { bgcolor: '#e6e600' } }} // Override ng background color at hover state
                startIcon={<MapIcon />} // Map icon
              >
                Route 1
              </Button>
              <Button
                variant='contained'
                color='primary' // Color set to primary, which we have overridden as yellow in the custom theme
                fullWidth
                onClick={() => handleMapChange('Route 2')}
                sx={{ mb: 2, bgcolor: '#ffff00', '&:hover': { bgcolor: '#e6e600' } }} // Override ng background color at hover state
                startIcon={<MapIcon />} // Map icon
              >
                Route 2
              </Button>
              <Button
                variant='contained'
                color='primary' // Color set to primary, which we have overridden as yellow in the custom theme
                fullWidth
                onClick={() => handleMapChange('Route 3')}
                sx={{ mb: 2, bgcolor: '#ffff00', '&:hover': { bgcolor: '#e6e600' } }} // Override ng background color at hover state
                startIcon={<MapIcon />} // Map icon
              >
                Route 3
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side: Maps */}
        <Grid item xs={12} md={8}>
          {selectedMap && (
            <Card>
              <CardHeader
                title={selectedMap}
                action={
                  <Button onClick={handleCloseMap} color='inherit'>
                    Close Map
                  </Button>
                }
              />
              <CardContent>
                {selectedMap === 'Route 1' && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant='h5' gutterBottom>
                      Title 1
                    </Typography>
                    <iframe
                      title='Route 1'
                      width='100%'
                      height='400'
                      frameBorder='0'
                      scrolling='no'
                      marginHeight='0'
                      marginWidth='0'
                      src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.5085582859677!2d120.96841131467858!3d14.455053989835248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f72e07f0df3f%3A0x679ebfcf59dcebb2!2sSan%20Jose%20Dos%2C%20Noveleta%2C%20Cavite!5e0!3m2!1sen!2sph!4v1623970119743!5m2!1sen!2sph'
                      style={{ border: 0 }}
                      allowFullScreen=''
                      loading='lazy'
                    ></iframe>
                    <img
                      src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQreT_-8zQsgxy6Pp_VQeT3Ax1m_99n4xuW9A&s'
                      alt='Route 1 Image'
                      style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', marginTop: '20px' }}
                    />
                  </Box>
                )}
                {selectedMap === 'Route 2' && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant='h5' gutterBottom>
                      Title 2
                    </Typography>
                    <iframe
                      title='Route 2'
                      width='100%'
                      height='400'
                      frameBorder='0'
                      scrolling='no'
                      marginHeight='0'
                      marginWidth='0'
                      src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.4221025050154!2d120.94711161467866!3d14.447196989834512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f6fae4b16c2b%3A0x258f7b7cdd04713b!2sNoveleta%20Elementary%20School!5e0!3m2!1sen!2sph!4v1623970212025!5m2!1sen!2sph'
                      style={{ border: 0 }}
                      allowFullScreen=''
                      loading='lazy'
                    ></iframe>
                    <img
                      src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQreT_-8zQsgxy6Pp_VQeT3Ax1m_99n4xuW9A&s'
                      alt='Route 2 Image'
                      style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', marginTop: '20px' }}
                    />
                  </Box>
                )}
                {selectedMap === 'Route 3' && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant='h5' gutterBottom>
                      Title 3
                    </Typography>
                    <iframe
                      title='Route 3'
                      width='100%'
                      height='400'
                      frameBorder='0'
                      scrolling='no'
                      marginHeight='0'
                      marginWidth='0'
                      src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.477961080413!2d120.96161191467863!3d14.448136989835004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f6faa3323f7b%3A0x3e1e2e0bda3f9f15!2sPhilippine%20Ostrich%20and%20Emu%20Adventure%20Safari%20(POAES)!5e0!3m2!1sen!2sph!4v1623970293467!5m2!1sen!2sph'
                      style={{ border: 0 }}
                      allowFullScreen=''
                      loading='lazy'
                    ></iframe>
                    <img
                      src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQreT_-8zQsgxy6Pp_VQeT3Ax1m_99n4xuW9A&s'
                      alt='Route 3 Image'
                      style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', marginTop: '20px' }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default UserDataTable
