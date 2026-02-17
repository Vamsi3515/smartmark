
import { createClient } from '@/utils/supabase/server'
import { Bookmark, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-4xl space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 shadow-xl">
            <Bookmark className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            SmartMark.
            <span className="block text-blue-600">Your smart bookmark manager.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400">
            Private, lightning fast, and always in sync. The modern way to save your favorite links.
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Get Started
            </Link>
          )}
          
          <a
            href="https://github.com/Vamsi3515/smartmark"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-md ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:shadow-lg dark:bg-zinc-800 dark:text-gray-200 dark:ring-zinc-700 dark:hover:bg-zinc-750"
          >
            View Source
          </a>
        </div>
      </div>
    </div>
  )
}
