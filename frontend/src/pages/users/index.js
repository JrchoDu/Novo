import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Swal from 'sweetalert2'

const UserDataTable = () => {
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://dev-noveleno.onrender.com/api/auth/userpending')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      const usersWithFullAddress = data.users.map(user => ({
        ...user,
        address: `${user.streetNumber} ${user.streetName}, ${user.barangay}`
      }))
      setFilteredData(usersWithFullAddress)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching users:', error.message)
      setLoading(false)
    }
  }

  const handleSearch = event => {
    const value = event.target.value.toLowerCase()
    setSearchText(value)
    const filteredRows = filteredData.filter(
      row =>
        row.fullname.toLowerCase().includes(value) ||
        row.email.toLowerCase().includes(value) ||
        row.address.toLowerCase().includes(value) ||
        row.birthday.toLowerCase().includes(value)
    )
    setFilteredData(filteredRows)
  }

  const handleAccept = async userId => {
    try {
      const response = await fetch(`https://dev-noveleno.onrender.com/api/auth/acceptuser/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to accept user')
      }

      const user = filteredData.find(user => user.id === userId)

      Swal.fire({
        icon: 'success',
        title: 'User Accepted!',
        text: `User ${user.fullname} has been accepted.`,
        showConfirmButton: false,
        timer: 1500
      })

      fetchUsers()
    } catch (error) {
      console.error('Error accepting user:', error.message)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to accept user. Please try again later.',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  const columns = [
    { field: 'fullname', headerName: 'Fullname', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'address', headerName: 'Address', width: 250 },
    { field: 'birthday', headerName: 'Birthday', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: params => (
        <div>
          <Button
            variant='contained'
            color='primary'
            onClick={() => handleAccept(params.row.id)}
            style={{ marginRight: '10px' }}
          >
            Accept
          </Button>
        </div>
      )
    }
  ]

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  return (
    <Grid container spacing={3} justifyContent='center'>
      <Grid item xs={12}>
        <Card
          elevation={3}
          style={{
            borderRadius: 16,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <CardHeader title='Pending' subheader='List of registered users with their details.' />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant='h4' gutterBottom align='center'>
              Users List
            </Typography>
            <TextField
              label='Search'
              variant='outlined'
              fullWidth
              value={searchText}
              onChange={handleSearch}
              style={{ marginBottom: '20px' }}
            />
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid rows={filteredData} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserDataTable
