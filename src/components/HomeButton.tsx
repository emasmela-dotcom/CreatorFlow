 'use client'

 import { useRouter } from 'next/navigation'
 import { Home } from 'lucide-react'
 import { useCallback } from 'react'

 /**
  * Global "Home" button visible on every page.
  * - If signed in (token exists), go to /dashboard
  * - Otherwise, go to /
  */
 export default function HomeButton() {
   const router = useRouter()

   const handleHome = useCallback(() => {
     const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
     router.push(token ? '/dashboard' : '/')
   }, [router])

   return (
     <button
       type="button"
       onClick={handleHome}
       aria-label="Home"
       className="fixed bottom-6 left-6 z-50 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/30 transition-colors"
     >
       <Home className="w-4 h-4" />
       <span className="text-sm font-semibold">Home</span>
     </button>
   )
 }

