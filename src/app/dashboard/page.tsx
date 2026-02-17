
import { createClient } from '@/utils/supabase/server'
import { BookmarkManager } from '@/components/bookmark-manager'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Fetch initial data on the server
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          My Bookmarks
        </h1>
      </div>
      
      {/* Pass initial data to client component */}
      <BookmarkManager initialBookmarks={bookmarks || []} />
    </div>
  )
}
