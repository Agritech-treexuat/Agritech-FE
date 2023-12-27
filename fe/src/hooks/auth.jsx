import React, { useEffect, useState } from 'react'
import FARM from '../services/farmService'
import { Navigate } from 'react-router-dom'

const Auth = (props) => {
  const [handle, setHandle] = useState(false)

  useEffect(() => {
    ;(async () => {
      let result = await FARM.me()
      if (result.data._id && result.data.roles[0] == 'farm') {
        setHandle(true)
      }
    })()
  }, [])

  if (handle === false) {
    return <> </>
  }
  return <>{handle == true ? props.children : <Navigate to={props.path} />}</>
}
export default Auth
