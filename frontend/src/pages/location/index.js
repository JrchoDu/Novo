import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import styled from 'styled-components'

const MapContainer = styled.div`
  width: 100%;
  height: 400px;

  @media (max-width: 600px) {
    height: 300px;
  }
`

const UserDataTable = () => {
  const [selectedMap, setSelectedMap] = useState(null)
  const [mapData, setMapData] = useState([])
  const [evacuationData, setEvacuationData] = useState([])

  const handleMapChange = mapName => {
    setSelectedMap(mapName)
  }

  const handleCloseMap = () => {
    setSelectedMap(null)
  }

  useEffect(() => {
    const fetchEvacuationData = async () => {
      try {
        const response = await fetch('https://dev-noveleno.onrender.com/api/evacuation', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setEvacuationData(data)
        // Automatically select the first map by default
        if (data.length > 0) {
          setSelectedMap(data[0].title)
        }
      } catch (error) {
        console.error('Error fetching evacuation data:', error)
      }
    }

    fetchEvacuationData()
  }, [])

  useEffect(() => {
    const initMap = () => {
      let mapOptions = {}
      let mapCenter = { lat: 0, lng: 0 }

      const selectedLocation = evacuationData.find(location => location.title === selectedMap)

      if (selectedLocation) {
        mapCenter = { lat: selectedLocation.lat, lng: selectedLocation.lng }
      }

      mapOptions = {
        zoom: 15,
        center: mapCenter
      }

      const mapDiv = document.getElementById('map')
      if (mapDiv) {
        const map = new window.google.maps.Map(mapDiv, mapOptions)

        // Add markers for map data
        evacuationData.forEach(markerData => {
          const marker = new window.google.maps.Marker({
            position: { lat: markerData.lat, lng: markerData.lng },
            map,
            title: markerData.barangay,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Default marker icon
              scaledSize: new window.google.maps.Size(32, 32) // Adjust the size of the marker icon as needed
            }
          })

          // Info window content
          const contentString = `
            <div>
              <h3>${markerData.title}</h3>
              <p><strong>Barangay:</strong> ${markerData.barangay}</p>
            </div>
          `

          // Create info window
          const infowindow = new window.google.maps.InfoWindow({
            content: contentString
          })

          // Open info window on marker click
          marker.addListener('click', () => {
            infowindow.open(map, marker)
          })
        })
      }
    }

    if (window.google) {
      initMap()
    } else {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCEVBpdnkBtuA03TVMex-4KGgyqstL6JiA&callback=initMap&libraries=places`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
      script.onload = () => {
        initMap()
      }
    }

    return () => {
      const script = document.querySelector(`script[src*="maps.googleapis.com"]`)
      if (script) {
        script.remove()
      }
    }
  }, [selectedMap, evacuationData])

  return (
    <Grid container spacing={3} justifyContent='center'>
      {/* Left Side: Buttons */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ py: 2 }}>
            <Typography variant='h6' gutterBottom>
              Choose Location
            </Typography>
            {evacuationData.map(location => (
              <Button
                key={location.id}
                variant='contained'
                color='primary'
                fullWidth
                onClick={() => handleMapChange(location.title)}
                sx={{ mb: 2 }}
              >
                {location.title}
              </Button>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Right Side: Maps */}
      <Grid item xs={12} md={8}>
        {selectedMap && (
          <Card>
            <CardHeader title={selectedMap} action={<Button onClick={handleCloseMap}>Close Map</Button>} />
            <CardContent>
              <MapContainer id='map'></MapContainer>

              {/* Legends */}
              <div style={{ marginTop: '10px' }}>
                <Typography variant='subtitle2'>
                  <span>
                    <img
                      src='http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                      alt='Marker'
                      style={{ width: '20px', height: '20px' }}
                    />{' '}
                    Marker
                  </span>
                </Typography>
              </div>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  )
}

export default UserDataTable
