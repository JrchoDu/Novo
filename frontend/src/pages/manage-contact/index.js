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

const ManageContact = () => {
  const [selectedName, setSelectedName] = useState('')
  const [selectedContact, setSelectedContact] = useState('')
  const [dataRows, setDataRows] = useState([])
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    fetchContactData()
  }, [])

  const fetchContactData = async () => {
    try {
      const response = await fetch('https://dev-noveleno.onrender.com/api/contacts')
      if (!response.ok) {
        throw new Error('Failed to fetch contact data')
      }
      const data = await response.json()
      setDataRows(data)
    } catch (error) {
      console.error('Error fetching contact data:', error.message)
    }
  }

  const handleDelete = async id => {
    try {
      const response = await fetch(`https://dev-noveleno.onrender.com/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete contact')
      }

      const updatedRows = dataRows.filter(row => row.id !== id)
      setDataRows(updatedRows)

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The contact has been deleted.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'swal2-container'
        }
      })
    } catch (error) {
      console.error('Error deleting contact:', error.message)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to delete contact. Please try again later.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'swal2-container'
        }
      })
    }
  }

  const handleSave = async () => {
    const contactRegex = /^(09|\+639)\d{9}$/ // Regular expression for +639 or 09 followed by 9 digits

    if (!selectedName || !selectedContact) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter both name and contact information.',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          container: 'swal2-container'
        }
      })
      return
    }

    if (!contactRegex.test(selectedContact)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter a valid Philippine contact number starting with +639 or 09, followed by 9 digits.',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          container: 'swal2-container'
        },
        willOpen: () => {
          document.querySelector('.swal2-container').style.zIndex = '9999999999'
        }
      })
      return
    }

    try {
      const response = await fetch('https://dev-noveleno.onrender.com/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: selectedName,
          contact_no: selectedContact
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save contact')
      }

      const newData = await response.json()
      setDataRows([...dataRows, newData])

      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'The contact has been saved.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'swal2-container'
        }
      })

      setSelectedName('')
      setSelectedContact('')
      setOpenModal(false)
    } catch (error) {
      console.error('Error saving contact:', error.message)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to save contact. Please try again later.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'swal2-container'
        }
      })
    }
  }

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'contact_no', headerName: 'Contact', width: 300 },
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
          <CardHeader title='Manage Contact Data' />
          <CardContent>
            <Box display='flex' justifyContent='flex-end'>
              <Button
                variant='contained'
                color='primary'
                onClick={() => setOpenModal(true)}
                style={{ marginBottom: '20px' }}
              >
                Add Contact
              </Button>
            </Box>
            <div style={{ height: '500px', width: '100%' }}>
              <DataGrid rows={dataRows} columns={columns} pageSize={10} />
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add Contact</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the contact's name and phone number below.</DialogContentText>
          <TextField
            fullWidth
            margin='normal'
            label='Name'
            value={selectedName}
            onChange={e => setSelectedName(e.target.value)}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Contact'
            value={selectedContact}
            onChange={e => setSelectedContact(e.target.value)}
          />
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
    </Grid>
  )
}

export default ManageContact
