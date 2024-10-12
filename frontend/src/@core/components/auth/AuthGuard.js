// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

const AuthGuard = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()
  useEffect(
    () => {
      if (!router.isReady) {
        return
      }
      const storedToken = window.localStorage.getItem('token')
      if (auth.user === null && !storedToken) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace('/login')
        }
      }
    },
    [auth.user, router.asPath, router.isReady] // Dependency array for useEffect
  )

  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
