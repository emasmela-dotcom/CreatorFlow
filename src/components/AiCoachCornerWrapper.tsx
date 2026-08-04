'use client'

import { useEffect, useState } from 'react'
import AiCoachCorner from './AiCoachCorner'

export default function AiCoachCornerWrapper() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  return <AiCoachCorner token={token} />
}
