import React, { useEffect, useState } from 'react'
import {
  Typography,
  Card,
  CardMedia,
  Grid,
  CardHeader,
  CardContent,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Button
} from '@mui/material'
import axios from 'axios'
import Swal from 'sweetalert2'

const NewsFeed = () => {
  const [newsItems, setNewsItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredItems, setFilteredItems] = useState([])
  const [selectedBarangay, setSelectedBarangay] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const fetchPendingNews = async () => {
      try {
        const response = await axios.get('https://dev-noveleno.onrender.com/api/pending')
        setNewsItems(response.data)
        setFilteredItems(response.data)
      } catch (err) {
        setError('Failed to fetch pending news')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingNews()
  }, [])

  useEffect(() => {
    const filtered = newsItems.filter(news => {
      const matchesSearch =
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesBarangay = selectedBarangay ? news.barangay === selectedBarangay : true
      return matchesSearch && matchesBarangay
    })
    setFilteredItems(filtered)
  }, [searchTerm, selectedBarangay, newsItems])

  const handleApprove = async id => {
    try {
      await axios.put(`https://dev-noveleno.onrender.com/api/approve/${id}`)

      await Swal.fire({
        icon: 'success',
        title: 'Approved!',
        text: 'News item has been approved successfully.'
      })

      const response = await axios.get('https://dev-noveleno.onrender.com/api/pending')
      setNewsItems(response.data)
      setFilteredItems(response.data)
    } catch (err) {
      setError('Failed to approve news')
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to approve news item.'
      })
    }
  }

  if (loading) return <Typography>Loading...</Typography>
  if (error) return <Typography color='error'>{error}</Typography>

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <Grid container spacing={3} justifyContent='center'>
      <Grid item xs={12}>
        <Card elevation={3} style={{ marginBottom: '20px', padding: '10px' }}>
          <CardHeader title='Pending News' />
          <CardContent>
            <TextField
              label='Search'
              variant='outlined'
              fullWidth
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ marginBottom: '10px' }}
            />
            <FormControl fullWidth style={{ marginBottom: '10px' }}>
              <InputLabel>Barangay</InputLabel>
              <Select value={selectedBarangay} onChange={e => setSelectedBarangay(e.target.value)}>
                <MenuItem value=''>All</MenuItem>
                {[...new Set(newsItems.map(news => news.barangay))].map(barangay => (
                  <MenuItem key={barangay} value={barangay}>
                    {barangay}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
      <Grid container spacing={2}>
        {paginatedItems.map(news => (
          <Grid item xs={12} key={news.id}>
            <Card variant='outlined'>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <CardMedia component='img' height='140' image={news.image_url} alt={news.title} />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <CardContent>
                    <Typography variant='h5' component='div' gutterBottom>
                      {news.title}
                    </Typography>
                    <Typography variant='body1' color='textSecondary'>
                      {news.description.length > 100 ? (
                        <>
                          {news.description.slice(0, 100)}...
                          <Button
                            variant='text'
                            onClick={() =>
                              Swal.fire({
                                title: 'Full Description',
                                text: news.description,
                                confirmButtonText: 'Close'
                              })
                            }
                          >
                            Show More
                          </Button>
                        </>
                      ) : (
                        news.description
                      )}
                    </Typography>
                    <Typography variant='body2' color='textSecondary' style={{ marginTop: '10px' }}>
                      Posted by: <strong>{news.user_fullname}</strong>
                    </Typography>
                    <Typography variant='body2' color='textSecondary' style={{ marginTop: '10px' }}>
                      Barangay: <strong>{news.barangay}</strong>
                    </Typography>
                    <Typography variant='body2' color='textSecondary' style={{ marginTop: '10px' }}>
                      {new Date(news.createdAt).toLocaleDateString()}
                    </Typography>
                    <Button
                      variant='contained'
                      color='primary'
                      style={{ marginTop: '10px' }}
                      onClick={() => handleApprove(news.id)}
                    >
                      Approve
                    </Button>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <Pagination count={totalPages} page={page} onChange={(event, value) => setPage(value)} color='primary' />
      </Grid>
    </Grid>
  )
}

export default NewsFeed
