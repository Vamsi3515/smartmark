
import { createClient } from '@/utils/supabase/server'
import { Bookmark, LogOut } from 'lucide-react'
import { redirect } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <nav className="shadow-sm border-b border-gray-200 bg-white dark:bg-zinc-800 dark:border-zinc-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-600 p-1.5">
                <Bookmark className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                SmartMark.
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span className="text-xs text-gray-400 hidden sm:block">
                {user.email}
              </span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-white transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
