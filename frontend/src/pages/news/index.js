import React, { useState } from 'react'
import { storage } from './firebase' // Import storage from firebase.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import axios from 'axios'
import Swal from 'sweetalert2'

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

const PostNews = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState(null) // State for selected image file
  const [imageUrl, setImageUrl] = useState('') // Will store the Firebase image URL
  const [barangay, setBarangay] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [error, setError] = useState('')

  // Handle image file selection
  const handleImageChange = e => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  // Function to handle image upload to Firebase
  const uploadImage = async () => {
    if (!imageFile) return ''

    const storageRef = ref(storage, `news_images/${imageFile.name}`)
    try {
      await uploadBytes(storageRef, imageFile)
      const downloadURL = await getDownloadURL(storageRef)
      return downloadURL
    } catch (error) {
      console.error('Error uploading image: ', error)
      return ''
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const authData = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : {}
    const email = authData.email || ''
    const role = authData.role || 'User'

    if (!email) {
      setError('Email is required')
      return
    }

    // Set status based on user role
    const status = role === 'admin' ? 1 : 0

    try {
      // Upload the image to Firebase and get the image URL
      const uploadedImageUrl = await uploadImage()

      if (!uploadedImageUrl) {
        setError('Image upload failed. Please try again.')
        return
      }

      const formData = {
        title,
        description,
        barangay,
        email,
        imageUrl: uploadedImageUrl, // Pass the Firebase image URL
        status,
        expires_at: expiresAt
      }

      const response = await axios.post('https://dev-noveleno.onrender.com/api/news', formData)
      console.log('News posted successfully:', response.data)

      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'News Posted!',
        text: 'Your news has been posted successfully.'
      })

      // Clear form fields
      setTitle('')
      setDescription('')
      setImageFile(null) // Clear image file
      setImageUrl('')
      setBarangay('')
      setExpiresAt('')
      setError('')
    } catch (error) {
      console.error('Error posting news:', error)
      setError('Failed to post news. Please try again.')
    }
  }

  return (
    <Grid container spacing={3} justifyContent='center'>
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardHeader
            title='Be Ready! Be Alert!'
            subheader='Send an alert informing the residents to prepare in a calamity.'
          />
        </Card>
      </Grid>
      <Grid item xs={12} sm={8} md={6}>
        <Card>
          <CardContent>
            <Typography variant='h4' gutterBottom align='center'>
              Post Your News
            </Typography>
            {error && <Typography color='error'>{error}</Typography>}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label='Title'
                    variant='outlined'
                    fullWidth
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Description'
                    multiline
                    rows={4}
                    variant='outlined'
                    fullWidth
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body1' gutterBottom>
                    Attach Image
                  </Typography>
                  <input type='file' onChange={handleImageChange} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body1' gutterBottom>
                    Barangay:
                  </Typography>
                  <Select value={barangay} onChange={e => setBarangay(e.target.value)} variant='outlined' fullWidth>
                    {barangays.map(barangay => (
                      <MenuItem key={barangay} value={barangay}>
                        {barangay}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Expiration Date'
                    type='date'
                    variant='outlined'
                    fullWidth
                    value={expiresAt}
                    onChange={e => setExpiresAt(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type='submit' variant='contained' color='primary' fullWidth>
                    Post News
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PostNews
