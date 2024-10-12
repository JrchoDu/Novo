// ** React Imports
import { useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

const CanViewNavGroup = props => {
  // ** Props
  const { children, navGroup } = props

  // ** Context
  const ability = useContext(AbilityContext)

  // ** Function to check if any child is visible
  const checkForVisibleChild = arr => {
    return arr.some(i => {
      if (i.children) {
        return checkForVisibleChild(i.children)
      } else {
        return true // No ability check for children
      }
    })
  }

  // ** Function to check if menu group can be viewed
  const canViewMenuGroup = item => {
    const hasAnyVisibleChild = item.children && checkForVisibleChild(item.children)
    if (!(item.action && item.subject)) {
      return hasAnyVisibleChild
    }

    // No ability check for item action and subject
    return hasAnyVisibleChild
  }

  // ** Render based on auth and ability checks
  if (navGroup && navGroup.auth === false) {
    return <>{children}</>
  } else {
    return navGroup && canViewMenuGroup(navGroup) ? <>{children}</> : null
  }
}

export default CanViewNavGroup
