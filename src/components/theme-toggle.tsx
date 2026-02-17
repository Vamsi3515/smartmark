
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-9 w-9 rounded-md bg-gray-100 dark:bg-zinc-800" />
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-100 text-black dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-gray-400"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <Moon className="absolute h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    </button>
  )
}
