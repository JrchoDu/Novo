import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { IconUserPlus, IconAlertCircle, IconUserCheck } from '@tabler/icons-react' // Import the icons
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function Home() {
  const [registeredUsers, setRegisteredUsers] = useState(null)
  const [newUsers, setNewUsers] = useState(null)
  const [pendingUsers, setPendingUsers] = useState(null)
  const [graphData, setGraphData] = useState([]) // State for graph data
  const [mapData, setMapData] = useState([])
  const [role, setRole] = useState('')

  // Fetch registered users count
  useEffect(() => {
    const fetchRegisteredUsers = async () => {
      try {
        const response = await fetch('https://dev-noveleno.onrender.com/api/auth/usercount', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setRegisteredUsers(data.userCount)
      } catch (error) {
        console.error('Error fetching registered users:', error)
      }
    }

    fetchRegisteredUsers()
  }, [])

  // Fetch new users count
  useEffect(() => {
    const fetchNewUsers = async () => {
      try {
        const response = await fetch('https://dev-noveleno.onrender.com/api/auth/usercountNew', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setNewUsers(data.userCountLast14Days) // Corrected key access
      } catch (error) {
        console.error('Error fetching new users:', error)
      }
    }

    fetchNewUsers()
  }, [])

  // Fetch pending users count
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await fetch('https://dev-noveleno.onrender.com/api/auth/usercountpending', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setPendingUsers(data.userCountWithNullStatus) // Correct key
      } catch (error) {
        console.error('Error fetching pending users:', error)
      }
    }

    fetchPendingUsers()
  }, [])

  // Fetch map data
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch('https://dev-noveleno.onrender.com/api/mapdata', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setMapData(data)
      } catch (error) {
        console.error('Error fetching map data:', error)
      }
    }

    fetchMapData()
  }, [])

  // Initialize Google Maps with markers
  useEffect(() => {
    const initMap = () => {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: { lat: 14.4315, lng: 120.8765 }
      })

      const getMarkerIcon = criticalLevel => {
        let iconColor = ''

        switch (criticalLevel) {
          case 'Low':
            iconColor = 'green'
            break
          case 'Medium':
            iconColor = 'orange'
            break
          case 'High':
            iconColor = 'red'
            break
          default:
            iconColor = 'blue'
        }

        return {
          url: `http://maps.google.com/mapfiles/ms/icons/${iconColor}-dot.png`,
          scaledSize: new window.google.maps.Size(32, 32)
        }
      }

      mapData.forEach(markerData => {
        const marker = new window.google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map,
          title: markerData.barangay,
          icon: getMarkerIcon(markerData.criticalLevel)
        })

        const contentString = `
          <div>
            <h3>${markerData.barangay}</h3>
            <p><strong>Description:</strong> ${markerData.description}</p>
            <p><strong>Critical Level:</strong> ${markerData.criticalLevel}</p>
          </div>
        `

        const infowindow = new window.google.maps.InfoWindow({
          content: contentString
        })

        marker.addListener('click', () => {
          infowindow.open(map, marker)
        })
      })
    }

    if (window.google) {
      initMap()
    } else {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCEVBpdnkBtuA03TVMex-4KGgyqstL6JiA&callback=initMap&libraries=places`
      script.async = true
      script.defer = true
      window.initMap = initMap
      document.head.appendChild(script)
    }

    return () => {
      const script = document.querySelector(`script[src*="maps.googleapis.com"]`)
      if (script) {
        script.remove()
      }
    }
  }, [mapData])

  // Fetch graph data from the /graph endpoint
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch('https://dev-noveleno.onrender.com/api/auth/graph', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setGraphData(data) // Set graph data
      } catch (error) {
        console.error('Error fetching graph data:', error)
      }
    }

    fetchGraphData()
  }, [])
  // Check user role from localStorage
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('auth'))
    if (auth && auth.role) {
      setRole(auth.role)
    }
  }, [])

  return (
    <Grid container spacing={6}>
      {role !== 'User' && (
        <>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title='New Users' avatar={<IconUserPlus />} />
              <CardContent>
                <Typography variant='h4'>
                  {newUsers !== null && typeof newUsers === 'number' ? newUsers.toLocaleString() : 'Loading...'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title='Pending Users' avatar={<IconAlertCircle />} />
              <CardContent>
                <Typography variant='h4'>
                  {pendingUsers !== null && typeof pendingUsers === 'number'
                    ? pendingUsers.toLocaleString()
                    : 'Loading...'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title='Registered Users' avatar={<IconUserCheck />} />
              <CardContent>
                <Typography variant='h4'>
                  {registeredUsers !== null && typeof registeredUsers === 'number'
                    ? registeredUsers.toLocaleString()
                    : 'Loading...'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Graph */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title='Users'></CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={300}>
                  <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' /> {/* Assuming 'month' is the key for x-axis */}
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type='monotone' dataKey='count' stroke='#8884d8' activeDot={{ r: 8 }} />{' '}
                    {/* Assuming 'count' is the key for user count */}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}

      {/* Map */}
      <Grid item xs={12} md={role !== 'User' ? 6 : 12}>
        <Card>
          <CardHeader title='Map'></CardHeader>
          <CardContent>
            <div id='map' style={{ height: 300, width: '100%' }}></div>
            <div style={{ marginTop: '10px' }}>
              <Typography variant='subtitle2'>
                <span style={{ marginRight: '10px' }}>
                  <img
                    src='http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                    alt='Low'
                    style={{ width: '20px', height: '20px' }}
                  />{' '}
                  Low
                </span>
                <span style={{ marginRight: '10px' }}>
                  <img
                    src='http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
                    alt='Medium'
                    style={{ width: '20px', height: '20px' }}
                  />{' '}
                  Medium
                </span>
                <span>
                  <img
                    src='http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    alt='High'
                    style={{ width: '20px', height: '20px' }}
                  />{' '}
                  High
                </span>
              </Typography>
            </div>
            <Card variant='outlined' style={{ marginTop: '10px' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <Button variant='contained' color='primary' href='/location' style={{ width: '100%' }}>
                  View Evacuation Map
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Home
