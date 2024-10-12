// ** React Imports
import React from 'react'

const CanViewNavLink = props => {
  // ** Props
  const { children, navLink } = props

  if (navLink && navLink.auth === false) {
    return <>{children}</>
  } else {
    // No ability check for navLink action and subject
    return <>{children}</>
  }
}

export default CanViewNavLink
