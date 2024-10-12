import React, { useEffect, useState } from 'react'
import {
  Typography,
  Card,
  CardMedia,
  Grid,
  CardHeader,
  CardContent,
  Link,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination
} from '@mui/material'
import axios from 'axios' // Make sure to install axios

const NewsFeed = () => {
  const [newsItems, setNewsItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredItems, setFilteredItems] = useState([])
  const [selectedBarangay, setSelectedBarangay] = useState('')
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState(null) // Track expanded description
  const itemsPerPage = 5

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://dev-noveleno.onrender.com/api/news')
        setNewsItems(response.data)
        setFilteredItems(response.data)
      } catch (err) {
        setError('Failed to fetch news')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
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

  if (loading) return <Typography>Loading...</Typography>
  if (error) return <Typography color='error'>{error}</Typography>

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <Grid container spacing={3} justifyContent='center'>
      <Grid item xs={12}>
        <Card elevation={3} style={{ marginBottom: '20px', padding: '10px' }}>
          <CardHeader title='News Posted' />
          <CardContent>
            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={12} md={6}>
                <TextField
                  label='Search'
                  variant='outlined'
                  fullWidth
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ marginBottom: '10px' }}
                  InputProps={{
                    style: { fontSize: '1rem' }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth style={{ marginBottom: '10px' }}>
                  <InputLabel>Barangay</InputLabel>
                  <Select
                    value={selectedBarangay}
                    onChange={e => setSelectedBarangay(e.target.value)}
                    InputProps={{
                      style: { fontSize: '1rem' }
                    }}
                  >
                    <MenuItem value=''>All</MenuItem>
                    {[...new Set(newsItems.map(news => news.barangay))].map(barangay => (
                      <MenuItem key={barangay} value={barangay}>
                        {barangay}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
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
                    <Typography variant='h6' component='div' gutterBottom style={{ fontSize: '1.25rem' }}>
                      {news.title}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      style={{ marginBottom: '10px', fontSize: '1rem' }}
                    >
                      {news.user_fullname}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      style={{ marginBottom: '10px', fontSize: '1rem' }}
                    >
                      Barangay: <strong>{news.barangay}</strong>
                    </Typography>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      style={{ marginBottom: '10px', fontSize: '1rem' }}
                    >
                      {expanded === news.id
                        ? news.description
                        : news.description.length > 50
                        ? `${news.description.slice(0, 50)}...`
                        : news.description}
                      {news.description.length > 50 && (
                        <Link
                          href='#'
                          color='primary'
                          onClick={() => setExpanded(expanded === news.id ? null : news.id)}
                        >
                          {expanded === news.id ? ' Show Less' : ' Show More'}
                        </Link>
                      )}
                    </Typography>
                    <Typography
                      variant='caption'
                      color='textSecondary'
                      style={{ marginTop: '10px', display: 'block', fontSize: '0.875rem' }}
                    >
                      {new Date(news.createdAt).toLocaleDateString()} {/* Format the date */}
                    </Typography>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid item xs={12} style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <Pagination count={totalPages} page={page} onChange={(event, value) => setPage(value)} color='primary' />
      </Grid>
    </Grid>
  )
}

export default NewsFeed
