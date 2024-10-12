import React, { useState, Fragment, useEffect } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'

const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
    color: theme.palette.primary.main
  }
}))

const NotificationsContainer = styled(Box)(({ theme }) => ({
  maxHeight: '400px',
  overflowY: 'auto',
  padding: theme.spacing(1.5),
  width: '100%',
  '&::-webkit-scrollbar': {
    width: 8
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4
  }
}))

const UserDropdown = props => {
  const { settings } = props

  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorElNotif, setAnchorElNotif] = useState(null)
  const [fullname, setFullname] = useState(null)
  const [role, setRole] = useState(null)
  const [notifications, setNotifications] = useState([])

  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('https://dev-noveleno.onrender.com/api/notifications')
        const data = await response.json()

        if (data.success) {
          // Sort notifications to have the latest ones first
          setNotifications(data.data?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) || [])
        } else {
          console.error('Failed to fetch notifications')
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    fetchNotifications()
  }, [])

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('auth'))
    const otpVerify = localStorage.getItem('otpverify')

    if (auth && otpVerify === '{"message":"OTP verified successfully."}') {
      setFullname(auth.fullname)
      setRole(auth.role)
    } else {
      window.location.href = '/login'
    }
  }, [])

  const direction = settings?.direction || 'ltr'

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const handleNotifOpen = event => {
    setAnchorElNotif(event.currentTarget)
  }

  const handleNotifClose = () => {
    setAnchorElNotif(null)
  }

  const styles = {
    px: 4,
    py: 1.75,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2.5,
      fontSize: '1.5rem', // Fixed icon size
      width: '1.5rem', // Fixed icon width
      height: '1.5rem' // Fixed icon height
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    logout()
    handleDropdownClose()
  }

  return (
    <Fragment>
      {fullname && role && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleNotifOpen} color='inherit' sx={{ mr: 2 }}>
            <Badge badgeContent={notifications?.length || 0} color='error'>
              <Icon icon='tabler:bell' />
            </Badge>
          </IconButton>
          <Badge
            overlap='circular'
            onClick={handleDropdownOpen}
            sx={{ cursor: 'pointer' }}
            badgeContent={<BadgeContentSpan />}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Avatar alt={fullname} src='/images/avatars/1.png' sx={{ width: 38, height: 38 }} />
          </Badge>
        </Box>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4.75 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ py: 1.75, px: 6 }}>
          {fullname && role && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Badge
                overlap='circular'
                badgeContent={<BadgeContentSpan />}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Avatar alt={fullname} src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} />
              </Badge>
              <Box sx={{ display: 'flex', ml: 2.5, alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 500 }}>{fullname}</Typography>
                <Typography variant='body2'>{role}</Typography>
              </Box>
            </Box>
          )}
        </Box>
        <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/user-profile')}>
          <a href='/user-profile' style={{ textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%' }}>
            <Box sx={styles}>
              <Icon icon='tabler:user-check' />
              My Profile
            </Box>
          </a>
        </MenuItemStyled>
        <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled sx={{ p: 0 }} onClick={handleLogout}>
          <Box sx={styles}>
            <Icon icon='tabler:logout' />
            Sign Out
          </Box>
        </MenuItemStyled>
      </Menu>
      <Menu
        anchorEl={anchorElNotif}
        open={Boolean(anchorElNotif)}
        onClose={handleNotifClose}
        sx={{ '& .MuiMenu-paper': { width: 300, mt: 4.75 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ py: 1.75, px: 6 }}>
          <Typography variant='h6'>Notifications</Typography>
        </Box>
        <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
        <NotificationsContainer>
          {notifications.map(notification => (
            <MenuItemStyled key={notification.id} sx={{ p: 0 }}>
              <Box
                sx={{
                  ...styles,
                  color:
                    notification.level === 1
                      ? 'success.main'
                      : notification.level === 2
                      ? 'warning.main'
                      : 'error.main',
                  '& svg': {
                    color:
                      notification.level === 1
                        ? 'success.main'
                        : notification.level === 2
                        ? 'warning.main'
                        : 'error.main',
                    fontSize: '1.5rem', // Fixed icon size
                    width: '1.5rem', // Fixed icon width
                    height: '1.5rem' // Fixed icon height
                  },
                  whiteSpace: 'normal', // Ensure text wraps correctly
                  overflow: 'hidden', // Hide overflowing text
                  textOverflow: 'ellipsis' // Add ellipsis if necessary
                }}
              >
                <Icon icon='tabler:alert-circle' />
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Typography variant='body2' sx={{ overflowWrap: 'break-word' }}>
                    {notification.description}
                  </Typography>
                  <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                    {new Date(notification.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </MenuItemStyled>
          ))}
        </NotificationsContainer>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
