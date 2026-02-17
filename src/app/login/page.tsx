
'use client'

import { createClient } from '@/utils/supabase/client'
import { Bookmark, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error logging in:', error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl bg-blue-600 p-3 shadow-lg">
            <Bookmark className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            SmartMark.
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your smart, private bookmark manager.
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-md ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed dark:bg-zinc-800 dark:text-gray-200 dark:ring-zinc-700 dark:hover:bg-white dark:hover:text-black"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            ) : (
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-5 w-5"
              />
            )}
            <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
          </button>
        </div>
        
        <p className="mt-4 text-xs text-gray-400">
          By clicking continue, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
