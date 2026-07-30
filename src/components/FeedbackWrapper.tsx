'use client'

import { useEffect, useState } from 'react'
import FeedbackButton from './FeedbackButton'

export default function FeedbackWrapper() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  return <FeedbackButton initialToken={token} />
}
