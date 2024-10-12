// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const FallbackSpinner = ({ sx }) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <svg width={82} height={56.375} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <svg width='32' height='22' viewBox='0 0 32 22' xmlns='http://www.w3.org/2000/svg'>
          <image xlinkHref='/images/logo.png' width='32' height='22' />
        </svg>
      </svg>
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
