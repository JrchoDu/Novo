import { useState, useEffect } from 'react'
import Link from 'next/link'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import Avatar from '@mui/material/Avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'
import themeConfig from 'src/configs/themeConfig'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  },
  width: '100%'
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
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required()
})

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const auth = useAuth()
  const theme = useTheme()
  const bgColors = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const { skin } = settings

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async data => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('https://dev-noveleno.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      })

      if (!response.ok) {
        const errorResponse = await response.json()
        let errorMessage = errorResponse.message || 'Incorrect Email or Password'
        if (errorResponse.msg === 'Account is not active') {
          errorMessage = 'Please wait for the admin to approve your registration.'
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()

      // Save data to localStorage
      localStorage.setItem('auth', JSON.stringify(result))

      // Check user role and redirect accordingly
      const authData = JSON.parse(localStorage.getItem('auth'))
      const role = authData.role
      if (role === 'User') {
        window.location.href = '/user-menu'
      } else {
        window.location.href = '/home'
      }

      // Handle successful login (redirect, update state, etc.)
      auth.login({ email: data.email, password: data.password, rememberMe })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'
  const images = ['/images/image1.png', '/images/image2.png', '/images/image3.png']

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % images.length)
  }

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + images.length) % images.length)
  }

  const goToSlide = index => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length)
    }, 10000) // Change slide every 10 seconds

    return () => clearInterval(interval)
  }, [images.length])

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
          <IconButton onClick={handlePrevSlide} sx={{ position: 'absolute', left: '16px' }}>
            <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
          </IconButton>
          <LoginIllustration alt='login-illustration' src={images[currentSlide]} />
          <IconButton onClick={handleNextSlide} sx={{ position: 'absolute', right: '16px' }}>
            <Icon fontSize='1.25rem' icon='tabler:chevron-right' />
          </IconButton>
          <Box
            sx={{
              position: 'absolute',
              bottom: '16px',
              display: 'flex',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            {images.map((_, index) => (
              <IconButton
                key={index}
                onClick={() => goToSlide(index)}
                sx={{
                  mx: 0.5,
                  color: currentSlide === index ? theme.palette.primary.main : theme.palette.grey[400]
                }}
              >
                <Icon fontSize='0.75rem' icon='tabler:circle' />
              </IconButton>
            ))}
          </Box>
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
            <Avatar alt='Noveleno Logo' src='/images/logo.png' sx={{ mr: 2 }} />

            <Box sx={{ my: 6, display: 'flex', alignItems: 'center' }}>
              <Box>
                <Typography variant='h3' sx={{ mb: 1.5 }}>
                  {`Welcome to Noveleno! 👋🏻`}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Please sign-in to your account and start the adventure
                </Typography>
              </Box>
            </Box>

            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              {error && <Alert severity='error'>{error}</Alert>}
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Email'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='Enter your email'
                      error={Boolean(errors.email)}
                      {...(errors.email && { helperText: errors.email.message })}
                    />
                  )}
                />
              </Box>
              <Box sx={{ mb: 1.5 }}>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      placeholder='Enter your password'
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      {...(errors.password && { helperText: errors.password.message })}
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>
              <Box
                sx={{
                  mb: 1.75,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <FormControlLabel
                  label='Remember Me'
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                />
                <Typography component={LinkStyled} href='/forgot-password'>
                  Forgot Password?
                </Typography>
              </Box>
              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>New on our platform?</Typography>
                <Typography href='/register' component={LinkStyled}>
                  Create an account
                </Typography>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
