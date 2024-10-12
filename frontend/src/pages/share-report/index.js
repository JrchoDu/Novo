// ** React Imports
import React, { useState, useEffect } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/system'

// ** Firebase Imports
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

// ** SweetAlert2 Import
import Swal from 'sweetalert2'

// Define custom button styling
const CustomButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '50px',
  fontSize: '1rem',
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 'bold',
  backgroundColor: '#4CAF50',
  color: 'white',
  '&:hover': {
    backgroundColor: '#388E3C'
  }
}))

const ReportForm = () => {
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [postUntil, setPostUntil] = useState('')
  const [email, setEmail] = useState('')
  const [barangay, setBarangay] = useState('')
  const [status, setStatus] = useState(0)
  const [imageFile, setImageFile] = useState(null) // New state for selected image file

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('auth')) || {}
    setBarangay(authData.barangay || '')
    setEmail(authData.email || '')
    setStatus(authData.role === 'User' ? 0 : 1)
  }, [])

  // Handle image file selection
  const handleImageChange = e => {
    const file = e.target.files[0]
    setImageFile(file)
  }

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault()

    if (imageFile) {
      try {
        // Create a storage reference for the image
        const storageRef = ref(storage, `images/${imageFile.name}`)
        // Upload the image
        const snapshot = await uploadBytes(storageRef, imageFile)
        // Get the image URL
        const downloadURL = await getDownloadURL(snapshot.ref)
        setImageUrl(downloadURL) // Set the URL after successful upload
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue uploading the image.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        console.error('Error uploading image:', error)
        return
      }
    }

    const requestData = {
      title,
      description,
      barangay,
      email,
      imageUrl, // Use the uploaded image URL
      expires_at: postUntil,
      status
    }

    fetch('https://dev-noveleno.onrender.com/api/news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => response.json())
      .then(data => {
        Swal.fire({
          title: 'Success!',
          text: 'Your report has been submitted successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        setTitle('')
        setImageFile(null) // Clear selected file
        setImageUrl('')
        setDescription('')
        setPostUntil('')
      })
      .catch(error => {
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue submitting your report.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        console.error('Error creating news:', error)
      })
  }

  return (
    <Box sx={{ maxWidth: 'auto' }}>
      <Card elevation={3} sx={{ marginBottom: '20px' }}>
        <CardHeader title='Report' subheader='Send a report alerting residents to prepare for a calamity.' />
      </Card>
      <Card elevation={3}>
        <CardContent>
          <Typography variant='h5' sx={{ textAlign: 'center', marginBottom: '20px' }}>
            Share Report
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                required
                fullWidth
                label='Title'
                variant='outlined'
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <TextField
                required
                fullWidth
                label='Post Until'
                type='date'
                variant='outlined'
                value={postUntil}
                onChange={e => setPostUntil(e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange} // Handle image selection
                style={{ marginBottom: '20px' }}
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt='Image Preview'
                  style={{ maxWidth: '100%', borderRadius: '10px', marginTop: '10px' }}
                />
              )}
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label='Description'
                variant='outlined'
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              <CustomButton type='submit'>SUBMIT</CustomButton>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ReportForm
