import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button, TextField, Alert, Box, Typography, Paper } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const schema = yup.object().shape({
  otp: yup
    .string()
    .required('OTP is required')
    .length(6, 'OTP must be 6 digits')
    .matches(/^\d+$/, 'OTP must be numeric')
})

const OTPPage = () => {
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const auth = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const generateOTP = async email => {
    try {
      const response = await fetch('https://dev-noveleno.onrender.com/api/auth/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Error generating OTP')
      }

      setSuccess('OTP sent successfully via SMS.')
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    const authData = localStorage.getItem('auth')
    if (authData) {
      const { email } = JSON.parse(authData)
      generateOTP(email)
    }
  }, [])

  const onSubmit = async data => {
    const authData = localStorage.getItem('auth')
    let email = null
    if (authData) {
      email = JSON.parse(authData).email
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('https://dev-noveleno.onrender.com/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode: data.otp })
      })

      if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.message || 'Invalid OTP')
      }

      const result = await response.json()
      localStorage.setItem('otpverify', JSON.stringify(result)) // Save response to localStorage with key 'otpverify'

      // Get the role from the auth data in localStorage
      const authData = localStorage.getItem('auth')
      if (authData) {
        const { role } = JSON.parse(authData) // Get the role from auth

        // Redirect based on the role
        if (role === 'User') {
          window.location.href = '/user-menu'
        } else if (role === 'Admin') {
          window.location.href = '/menu'
        } else {
          window.location.href = '/home'
        }
      }

      auth.login({})
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const resendOTP = async () => {
    const authData = localStorage.getItem('auth')
    if (authData) {
      const { email } = JSON.parse(authData)
      await generateOTP(email)
    }
    setTimer(30)
    setCanResend(false)
  }

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  return (
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: '8px', maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <img
          alt='Logo'
          src='/images/logo.png'
          style={{ width: 56, height: 56, margin: 'auto', marginBottom: '16px' }}
        />
        <Typography variant='h4' sx={{ mb: 2 }}>
          Enter OTP
        </Typography>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity='success' sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='otp'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='OTP'
                variant='outlined'
                fullWidth
                error={Boolean(errors.otp)}
                helperText={errors.otp ? errors.otp.message : ''}
                inputProps={{ maxLength: 6 }}
                sx={{ mb: 2 }}
              />
            )}
          />
          <Button fullWidth type='submit' variant='contained' sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
          <Button fullWidth variant='text' sx={{ mt: 2 }} disabled={!canResend} onClick={resendOTP}>
            {canResend ? 'Resend OTP' : `Resend OTP in ${timer} seconds`}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

OTPPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
OTPPage.guestGuard = true

export default OTPPage
