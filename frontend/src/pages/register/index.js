import { useState } from 'react'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useSettings } from 'src/@core/hooks/useSettings'
import Swal from 'sweetalert2'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 600,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main + ' !important'
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

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

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullname: '',
    birthday: '',
    streetNumber: '',
    streetName: '',
    barangay: '',
    contactNumber: ''
  })
  const [agreed, setAgreed] = useState(false)

  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const { skin } = settings
  const imageSource = skin === 'bordered' ? 'auth-v2-register-illustration-bordered' : 'auth-v2-register-illustration'

  const validatePassword = password => {
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
    return passwordRegex.test(password)
  }

  const isOldEnough = birthday => {
    const today = new Date()
    const birthDate = new Date(birthday)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age >= 16
  }

  const handleFormSubmit = async e => {
    e.preventDefault()

    if (!agreed) {
      Swal.fire({
        icon: 'error',
        title: 'Agreement Required',
        text: 'Please agree to the privacy policy & terms.'
      })
      return
    }

    if (!validatePassword(formData.password)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Password',
        text: 'Password must be at least 8 characters long and include special characters.'
      })
      return
    }

    const validatePhoneNumber = contactNumber => {
      const phoneRegex = /^(09|\+639)\d{9}$/
      return phoneRegex.test(contactNumber)
    }

    if (!validatePhoneNumber(formData.contactNumber)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Phone Number',
        text: 'The contact number should start with +63 or 09 and contain 11 digits.'
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords Do Not Match',
        text: 'Password and confirm password do not match.'
      })
      return
    }

    if (!isOldEnough(formData.birthday)) {
      Swal.fire({
        icon: 'error',
        title: 'Age Requirement Not Met',
        text: 'You must be at least 16 years old to register.'
      })
      return
    }

    try {
      const response = await fetch('https://dev-noveleno.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You have successfully registered!'
        }).then(result => {
          if (result.isConfirmed) {
            window.location.href = '/login'
          }
        })
      } else {
        const errorData = await response.json()
        console.error('Registration failed:', errorData)
        Swal.fire({
          icon: 'error',
          title: 'Fill up all fields',
          text: 'Failed to register. Please try again.'
        })
      }
    } catch (error) {
      console.error('Registration failed:', error)
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'An unexpected error occurred. Please try again later.'
      })
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <RegisterIllustration
            alt='register-illustration'
            src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 350 }}>
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                Sign up! 🚀
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Make your app management easy and fun!</Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleFormSubmit}>
              <CustomTextField
                fullWidth
                label='Email'
                sx={{ mb: 4 }}
                placeholder='Enter your email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
              />
              <CustomTextField
                fullWidth
                label='Password'
                id='auth-login-v2-password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon fontSize='1.25rem' icon={showPassword ? 'eye-off' : 'eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                sx={{ mb: 4 }}
              />
              <Typography variant='body2' color='text.secondary'>
                Password must be at least 8 characters long and include special characters.
              </Typography>
              <CustomTextField
                fullWidth
                label='Confirm Password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Confirm password'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon fontSize='1.25rem' icon={showPassword ? 'eye-off' : 'eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleInputChange}
                sx={{ mb: 4 }}
              />
              <CustomTextField
                fullWidth
                label='Full Name'
                sx={{ mb: 4 }}
                placeholder='Enter your full name'
                name='fullname'
                value={formData.fullname}
                onChange={handleInputChange}
              />
              <CustomTextField
                fullWidth
                label='Date of Birth'
                type='date'
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 4 }}
                name='birthday'
                value={formData.birthday}
                onChange={handleInputChange}
              />
              <Select
                fullWidth
                sx={{ mb: 4 }}
                value={formData.streetNumber}
                onChange={e => setFormData({ ...formData, streetNumber: e.target.value })}
                name='streetNumber'
                displayEmpty
                inputProps={{ 'aria-label': 'Street Number' }}
                placeholder='Select Street Number'
              >
                <MenuItem value='' disabled>
                  Select Street Number
                </MenuItem>
                {streetNumbers.map((number, index) => (
                  <MenuItem key={index} value={number}>
                    {number}
                  </MenuItem>
                ))}
              </Select>
              <Select
                fullWidth
                sx={{ mb: 4 }}
                value={formData.streetName}
                onChange={e => setFormData({ ...formData, streetName: e.target.value })}
                name='streetName'
                displayEmpty
                inputProps={{ 'aria-label': 'Street Name' }}
                placeholder='Select Street Name'
              >
                <MenuItem value='' disabled>
                  Select Street Name
                </MenuItem>
                {streetNames.map((name, index) => (
                  <MenuItem key={index} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              <Select
                fullWidth
                sx={{ mb: 4 }}
                value={formData.barangay}
                onChange={e => setFormData({ ...formData, barangay: e.target.value })}
                name='barangay'
                displayEmpty
                inputProps={{ 'aria-label': 'Barangay' }}
                placeholder='Select Barangay'
              >
                <MenuItem value='' disabled>
                  Select Barangay
                </MenuItem>
                {barangays.map((barangay, index) => (
                  <MenuItem key={index} value={barangay}>
                    {barangay}
                  </MenuItem>
                ))}
              </Select>
              <CustomTextField
                fullWidth
                label='Contact Number'
                sx={{ mb: 4 }}
                placeholder='Enter your contact number'
                name='contactNumber'
                value={formData.contactNumber}
                onChange={handleInputChange}
              />
              <FormControlLabel
                control={<Checkbox checked={agreed} onChange={() => setAgreed(!agreed)} name='agreement' />}
                label={
                  <Typography variant='body2'>
                    I agree to{' '}
                    <LinkStyled href='#' onClick={e => e.preventDefault()}>
                      privacy policy & terms
                    </LinkStyled>
                  </Typography>
                }
              />
              <Button fullWidth type='submit' variant='contained'>
                Sign up
              </Button>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

Register.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Register
