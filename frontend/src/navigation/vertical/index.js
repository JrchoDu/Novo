import { useEffect, useState } from 'react'

const navigation = () => {
  const [navItems, setNavItems] = useState([])

  useEffect(() => {
    // This will run only on the client side
    const auth = JSON.parse(localStorage.getItem('auth'))

    if (auth && auth.role === 'User') {
      setNavItems([
        {
          title: 'Home',
          path: '/home',
          icon: 'tabler:smart-home',
          subject: 'General Home'
        },
        {
          title: 'Menu',
          path: '/user-menu',
          icon: 'tabler:menu',
          subject: 'Menu'
        },
        {
          title: 'Messages',
          path: '/chat',
          icon: 'tabler:message',
          subject: 'Chat'
        },
        {
          title: 'News Management',
          icon: 'tabler:news',
          subject: 'News',
          children: [
            {
              title: 'Share Report',
              path: '/share-report',
              icon: 'tabler:news',
              subject: 'News'
            },
            {
              title: 'News Feed',
              path: '/news/news-feed',
              icon: 'tabler:news',
              subject: 'News'
            }
          ]
        },
        {
          title: 'Calamity Emergency',
          path: '/calamity-emergency',
          icon: 'tabler:ambulance',
          subject: 'News'
        },
        {
          title: 'Emergency Hotlines',
          path: '/emergency-hotlines',
          icon: 'tabler:phone',
          subject: 'Emergency Hotlines'
        }
      ])
    } else {
      const adminItems =
        auth && auth.role === 'Superadmin'
          ? [
              {
                title: 'Admin Management',
                path: '/admin-management',
                icon: 'tabler:users',
                subject: 'Admin Management'
              }
            ]
          : []

      setNavItems([
        {
          title: 'Dashboard',
          path: '/home',
          icon: 'tabler:smart-home',
          subject: 'General Home'
        },
        {
          title: 'Menu',
          path: '/menu',
          icon: 'tabler:menu',
          subject: 'Menu'
        },
        {
          title: 'Messages',
          path: '/chat',
          icon: 'tabler:message',
          subject: 'Chat'
        },
        {
          title: 'Post Alert',
          path: '/alert',
          icon: 'tabler:alert-circle',
          subject: 'Alerts'
        },
        {
          title: 'Users Pending',
          path: '/users',
          icon: 'tabler:users',
          subject: 'User Management'
        },
        ...adminItems,
        {
          title: 'Emergency Contact',
          path: '/manage-contact',
          icon: 'tabler:phone',
          subject: 'Emergency'
        },
        {
          title: 'Manage Map',
          path: '/manage-map',
          icon: 'tabler:map',
          subject: 'Alerts'
        },
        {
          title: 'Manage Evacuation',
          path: '/manage-evacuation',
          icon: 'tabler:map',
          subject: 'Alerts'
        },
        {
          title: 'News Management',
          icon: 'tabler:news',
          subject: 'News',
          children: [
            {
              title: 'Post News',
              path: '/news',
              icon: 'tabler:news',
              subject: 'News'
            },
            {
              title: 'News Feed',
              path: '/news/news-feed',
              icon: 'tabler:news',
              subject: 'News'
            },
            {
              title: 'Report Approval',
              path: '/news/approval',
              icon: 'tabler:news',
              subject: 'News'
            }
          ]
        }
      ])
    }
  }, [])

  return navItems
}

export default navigation
