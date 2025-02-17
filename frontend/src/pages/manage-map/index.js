import React, { useState, useEffect, useRef } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import Swal from 'sweetalert2'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import GoogleMapReact from 'google-map-react'

const DraggableMarker = ({ lat, lng, onDragEnd }) => {
  const markerRef = useRef(null)

  useEffect(() => {
    if (markerRef.current) {
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: markerRef.current.map,
        draggable: true,
        icon: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png'
      })

      marker.addListener('dragend', e => {
        onDragEnd({
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        })
      })

      return () => marker.setMap(null)
    }
  }, [lat, lng, onDragEnd])

  return <div ref={markerRef} />
}

const ManageMap = () => {
  const [selectedCoordinates, setSelectedCoordinates] = useState(null)
  const [selectedCriticalLevel, setSelectedCriticalLevel] = useState('')
  const [selectedBarangay, setSelectedBarangay] = useState('')
  const [selectedDescription, setSelectedDescription] = useState('')
  const [dataRows, setDataRows] = useState([])
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    fetchMapData()
  }, [])

  const fetchMapData = async () => {
    try {
      const response = await fetch('https://dev-noveleno.onrender.com/api/mapdata')
      if (!response.ok) {
        throw new Error('Failed to fetch map data')
      }
      const data = await response.json()
      setDataRows(data)
    } catch (error) {
      console.error('Error fetching map data:', error.message)
    }
  }

  const handleDelete = async id => {
    try {
      const response = await fetch(`https://dev-noveleno.onrender.com/api/mapdata/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete map data')
      }

      const updatedRows = dataRows.filter(row => row.id !== id)
      setDataRows(updatedRows)

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The map data entry has been deleted.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'swal2-container'
        }
      })
    } catch (error) {
      console.error('Error deleting map data:', error.message)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to delete map data. Please try again later.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'swal2-container'
        }
      })
    }
  }

  const handleSave = async () => {
    if (!selectedCoordinates || !selectedCriticalLevel || !selectedBarangay || !selectedDescription) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please select coordinates, barangay, description, and enter a critical level.',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          container: 'swal2-container'
        }
      })
      return
    }

    try {
      const response = await fetch('https://dev-noveleno.onrender.com/api/mapdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coordinates: selectedCoordinates,
          criticalLevel: selectedCriticalLevel,
          barangay: selectedBarangay,
          description: selectedDescription
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save map data')
      }

      const newData = await response.json()
      setDataRows([...dataRows, newData])

      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'The map data has been saved.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'swal2-container'
        }
      })

      setSelectedCoordinates(null)
      setSelectedCriticalLevel('')
      setSelectedBarangay('')
      setSelectedDescription('')
      setOpenModal(false)
    } catch (error) {
      console.error('Error saving map data:', error.message)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to save map data. Please try again later.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'swal2-container'
        }
      })
    }
  }

  const handleMapClick = ({ lat, lng }) => {
    setSelectedCoordinates({ lat, lng })
  }

  const handleMarkerDragEnd = ({ lat, lng }) => {
    setSelectedCoordinates({ lat, lng })
  }

  const criticalLevels = ['Low', 'Medium', 'High']

  const columns = [
    {
      field: 'coordinates',
      headerName: 'Coordinates',
      width: 300,
      renderCell: params => `${params.row.lat}, ${params.row.lng}`
    },
    { field: 'barangay', headerName: 'Barangay', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'criticalLevel', headerName: 'Critical Level', width: 200 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: params => (
        <Button variant='contained' color='secondary' onClick={() => handleDelete(params.row.id)}>
          Delete
        </Button>
      )
    }
  ]

  return (
    <Grid container spacing={3} justifyContent='center'>
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardHeader title='Manage Map Data' />
          <CardContent>
            <Box display='flex' justifyContent='flex-end'>
              <Button
                variant='contained'
                color='primary'
                onClick={() => setOpenModal(true)}
                style={{ marginBottom: '20px' }}
              >
                Add Map Data
              </Button>
            </Box>
            <div style={{ height: '500px', width: '100%' }}>
              <DataGrid rows={dataRows} columns={columns} pageSize={10} />
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add Map Data</DialogTitle>
        <DialogContent>
          <DialogContentText>Click on the map to select coordinates, and drag the pin to adjust.</DialogContentText>
          <div style={{ height: '300px', width: '100%' }}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: 'AIzaSyCEVBpdnkBtuA03TVMex-4KGgyqstL6JiA'
              }}
              defaultCenter={{ lat: 14.398, lng: 120.934 }}
              defaultZoom={12}
              onClick={handleMapClick}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => {
                const marker = new maps.Marker({
                  position: { lat: 14.398, lng: 120.934 },
                  map,
                  draggable: true,
                  icon: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png'
                })

                maps.event.addListener(marker, 'dragend', e => {
                  handleMarkerDragEnd({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                  })
                })

                return () => {
                  marker.setMap(null)
                }
              }}
            />
            {selectedCoordinates && (
              <DraggableMarker
                lat={selectedCoordinates.lat}
                lng={selectedCoordinates.lng}
                onDragEnd={handleMarkerDragEnd}
              />
            )}
          </div>
          <FormControl fullWidth style={{ marginTop: '20px' }}>
            <InputLabel id='criticalLevel-label'>Select Critical Level</InputLabel>
            <Select
              labelId='criticalLevel-label'
              id='criticalLevel'
              value={selectedCriticalLevel}
              onChange={e => setSelectedCriticalLevel(e.target.value)}
              label='Select Critical Level'
            >
              {criticalLevels.map(level => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginTop: '20px' }}>
            <InputLabel id='barangay-label'>Select Barangay</InputLabel>
            <Select
              labelId='barangay-label'
              id='barangay'
              value={selectedBarangay}
              onChange={e => setSelectedBarangay(e.target.value)}
              label='Select Barangay'
            >
              <MenuItem value={'Magdiwang'}>Magdiwang</MenuItem>
              <MenuItem value={'Poblacion'}>Poblacion</MenuItem>
              <MenuItem value={'Salcedo I'}>Salcedo I</MenuItem>
              <MenuItem value={'Salcedo II'}>Salcedo II</MenuItem>
              <MenuItem value={'San Antonio I'}>San Antonio I</MenuItem>
              <MenuItem value={'San Antonio II'}>San Antonio II</MenuItem>
              <MenuItem value={'San Jose I'}>San Jose I</MenuItem>
              <MenuItem value={'San Jose II'}>San Jose II</MenuItem>
              <MenuItem value={'San Juan I'}>San Juan I</MenuItem>
              <MenuItem value={'San Juan II'}>San Juan II</MenuItem>
              <MenuItem value={'San Rafael I'}>San Rafael I</MenuItem>
              <MenuItem value={'San Rafael II'}>San Rafael II</MenuItem>
              <MenuItem value={'San Rafael III'}>San Rafael III</MenuItem>
              <MenuItem value={'San Rafael IV'}>San Rafael IV</MenuItem>
              <MenuItem value={'Santa Rosa I'}>Santa Rosa I</MenuItem>
              <MenuItem value={'Santa Rosa II'}>Santa Rosa II</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginTop: '20px' }}>
            <InputLabel htmlFor='description'>Description</InputLabel>
            <Select
              labelId='description-label'
              id='description'
              value={selectedDescription}
              onChange={e => setSelectedDescription(e.target.value)}
              label='Description'
            >
              <MenuItem value={'Description A'}>Description A</MenuItem>
              <MenuItem value={'Description B'}>Description B</MenuItem>
              <MenuItem value={'Description C'}>Description C</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleSave} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
          .swal2-container {
            z-index: 20000 !important;
          }
        `}
      </style>
    </Grid>
  )
}

export default ManageMap
