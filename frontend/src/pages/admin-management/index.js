import React, { useState, useEffect } from 'react'
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
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

const barangays = [
  'Magdiwang',
  'Poblacion',
  'Salcedo I',
  'Salcedo II',
  'San Antonio I',
  'San Antonio II',
  'San Jose I',
  'San Jose II',
  'San Juan I',
  'San Juan II',
  'San Rafael I',
  'San Rafael II',
  'San Rafael III',
  'San Rafael IV',
  'Santa Rosa I',
  'Santa Rosa II'
]

const streetNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

const streetNames = [
  'Main Street',
  '2nd Avenue',
  '3rd Boulevard',
  '4th Road',
  '5th Lane',
  '6th Drive',
  '7th Place',
  '8th Crescent',
  '9th Terrace',
  '10th Way'
]

const AdminManagement = () => {
  const [selectedFullname, setSelectedFullname] = useState('')
  const [selectedEmail, setSelectedEmail] = useState('')
  const [selectedBirthday, setSelectedBirthday] = useState('')
  const [selectedStreetNumber, setSelectedStreetNumber] = useState('')
  const [selectedStreetName, setSelectedStreetName] = useState('')
  const [selectedBarangay, setSelectedBarangay] = useState('')
  const [selectedContactNumber, setSelectedContactNumber] = useState('')
  const [selectedPassword, setSelectedPassword] = useState('') // New password state
  const [dataRows, setDataRows] = useState([])
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('https://dev-noveleno.onrender.com/api/auth/allusers')
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }
      const data = await response.json()
      // Filter users to include only those with the role 'Admin'
      const adminUsers = data
        .filter(user => user.role === 'Admin')
        .map(user => ({
          ...user
        }))
      setDataRows(adminUsers)
    } catch (error) {
      console.error('Error fetching user data:', error.message)
    }
  }

  const handleDelete = async id => {
    try {
      const response = await fetch(`https://dev-noveleno.onrender.com/api/auth/deleteusers/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      const updatedRows = dataRows.filter(row => row.id !== id)
      setDataRows(updatedRows)

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The user has been deleted.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'swal2-container'
        }
      })
    } catch (error) {
      console.error('Error deleting user:', error.message)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to delete user. Please try again later.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'swal2-container'
        }
      })
    }
  }

  const handleSave = async () => {
    if (
      !selectedFullname ||
      !selectedEmail ||
      !selectedBirthday ||
      !selectedStreetNumber ||
      !selectedStreetName ||
      !selectedBarangay ||
      !selectedContactNumber ||
      !selectedPassword // Include password validation
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all fields.',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          container: 'swal2-container'
        }
      })
      return
    }

    try {
      const response = await fetch('https://dev-noveleno.onrender.com/api/auth/adminregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: selectedEmail,
          password: selectedPassword, // Send the password from the input
          fullname: selectedFullname,
          birthday: selectedBirthday,
          role: 'Admin',
          status: '1',
          streetNumber: selectedStreetNumber,
          streetName: selectedStreetName,
          barangay: selectedBarangay,
          contactNumber: selectedContactNumber
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save user')
      }

      const newData = await response.json()
      setDataRows([...dataRows, newData])

      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'The user has been saved.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'swal2-container'
        }
      })

      // Reset the form fields
      setSelectedFullname('')
      setSelectedEmail('')
      setSelectedBirthday('')
      setSelectedStreetNumber('')
      setSelectedStreetName('')
      setSelectedBarangay('')
      setSelectedContactNumber('')
      setSelectedPassword('') // Reset password
      setOpenModal(false)
    } catch (error) {
      console.error('Error saving user:', error.message)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to save user. Please try again later.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'swal2-container'
        }
      })
    }
  }

  const columns = [
    { field: 'fullname', headerName: 'Full Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'birthday', headerName: 'Birthday', width: 150 },
    { field: 'role', headerName: 'Role', width: 150 },
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
          <CardHeader title='Manage Admin' />
          <CardContent>
            <Box display='flex' justifyContent='flex-end'>
              <Button
                variant='contained'
                color='primary'
                onClick={() => setOpenModal(true)}
                style={{ marginBottom: '20px' }}
              >
                Add Admin
              </Button>
            </Box>
            <div style={{ height: '500px', width: '100%' }}>
              <DataGrid rows={dataRows} columns={columns} pageSize={10} />
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add Admin User</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the admin user's details below.</DialogContentText>
          <TextField
            fullWidth
            margin='normal'
            label='Full Name'
            value={selectedFullname}
            onChange={e => setSelectedFullname(e.target.value)}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Email'
            value={selectedEmail}
            onChange={e => setSelectedEmail(e.target.value)}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Birthday'
            type='date'
            value={selectedBirthday}
            onChange={e => setSelectedBirthday(e.target.value)}
            InputLabelProps={{
              shrink: true
            }}
          />
          <FormControl fullWidth margin='normal'>
            <InputLabel>Street Number</InputLabel>
            <Select value={selectedStreetNumber} onChange={e => setSelectedStreetNumber(e.target.value)}>
              {streetNumbers.map(number => (
                <MenuItem key={number} value={number}>
                  {number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <InputLabel>Street Name</InputLabel>
            <Select value={selectedStreetName} onChange={e => setSelectedStreetName(e.target.value)}>
              {streetNames.map(name => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <InputLabel>Barangay</InputLabel>
            <Select value={selectedBarangay} onChange={e => setSelectedBarangay(e.target.value)}>
              {barangays.map(barangay => (
                <MenuItem key={barangay} value={barangay}>
                  {barangay}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin='normal'
            label='Contact Number'
            value={selectedContactNumber}
            onChange={e => setSelectedContactNumber(e.target.value)}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Password'
            type='password'
            value={selectedPassword} // New password field
            onChange={e => setSelectedPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleSave} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default AdminManagement
