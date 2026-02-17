

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Bookmark as BookmarkIcon, Loader2, Save, Trash2, Link as LinkIcon, Plus, Search } from 'lucide-react'
import type { Bookmark } from '@/types/custom'
import { fetchUrlMetadata } from '@/app/actions'

export function BookmarkManager({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
  const [loading, setLoading] = useState(false)
  const [fetchingTitle, setFetchingTitle] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setURL] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [supabase] = useState(() => createClient())
  
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  
  // Realtime subscription
  useEffect(() => {
    // Unique channel name to avoid collisions in dev mode
    const channelName = `realtime-bookmarks-${Math.random()}`
    
    // Clean up any existing subscription first
    // supabase.removeAllChannels() 

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'bookmarks' 
      }, (payload) => {
        const newBookmark = payload.new as Bookmark
        setBookmarks((prev) => {
            if (prev.some(b => b.id === newBookmark.id)) return prev
            return [newBookmark, ...prev]
        })
      })
      .on('postgres_changes', { 
        event: 'DELETE', 
        schema: 'public', 
        table: 'bookmarks' 
      }, (payload) => {
        setBookmarks((prev) => prev.filter(b => b.id !== payload.old.id))
      })
      .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            // console.log('Ready for realtime updates')
          }
          if (status === 'CHANNEL_ERROR') {
              console.error('Realtime Error:', err)
          }
      })

    return () => {
      // Robust cleanup
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const handleUrlBlur = async () => {
    // Only fetch if URL is present and title is empty
    if (!url || title) return

    try {
        setFetchingTitle(true)
        let validUrl = url
        if (!/^https?:\/\//i.test(validUrl)) {
            validUrl = 'https://' + validUrl
            setURL(validUrl)
        }

        const { title: fetchedTitle } = await fetchUrlMetadata(validUrl)
        if (fetchedTitle) {
            setTitle(fetchedTitle)
        }
    } catch (e) {
        // Silent fail is fine here
    } finally {
        setFetchingTitle(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !url) return

    setLoading(true)
    
    // Auto-fix URL protocol
    let finalUrl = url
    if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl
    }

    try {
        const { data, error } = await supabase
        .from('bookmarks')
        .insert({ title, url: finalUrl })
        .select()
        .single()
        
        if (error) throw error
        
        
        if (data) {
            const newBookmark = data as Bookmark
            setBookmarks((prev) => [newBookmark, ...prev])
        }
        
        // Clear form on success
        setTitle('')
        setURL('')
    } catch (error) {
        console.error('Error adding bookmark:', error)
        alert('Failed to add bookmark. Please try again.')
    } finally {
        setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const oldBookmarks = [...bookmarks]
    setBookmarks(prev => prev.filter(b => b.id !== id))

    try {
        const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)
        
        if (error) throw error
    } catch (error) {
        setBookmarks(oldBookmarks)
        console.error('Error deleting bookmark:', error)
    }
  }

  // Filter based on search
  const filteredBookmarks = bookmarks.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return ( 
    <div className="space-y-8">
      {/* Create Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-500" />
            Add New Bookmark
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row items-end">
          <div className="flex-[2] space-y-2 w-full">
            <label htmlFor="url" className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">URL</label>
            <div className="relative">
                <input
                id="url"
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setURL(e.target.value)}
                onBlur={handleUrlBlur}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 transition-all"
                required
                />
                <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                {fetchingTitle && (
                    <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-blue-500" />
                )}
            </div>
          </div>
          <div className="flex-[2] space-y-2 w-full">
            <label htmlFor="title" className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">Site Name</label>
            <input
              id="title"
              type="text"
              placeholder="e.g., My Portfolio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Save</span>
          </button>
        </form>
      </div>

      <div className="h-px bg-gray-200 dark:bg-zinc-800" />
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-10 text-sm text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 transition-all"
        />
      </div>

      {/* List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBookmarks.length === 0 ? (
           <div className="col-span-full py-12 text-center text-gray-500 dark:text-zinc-500">
             <BookmarkIcon className="mx-auto h-12 w-12 opacity-20" />
             <p className="mt-2">
                {searchQuery ? 'No bookmarks match your search.' : 'No bookmarks yet. Add your first one above!'}
             </p>
           </div> 
        ) : (
            filteredBookmarks.map((bookmark) => (
                <div 
                  key={bookmark.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="mb-4">
                    <div className="mb-3 flex items-start justify-between">
                        <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                           {/* Add favicon fetching here for extra polish? */}
                           <img 
                             src={`https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=32`} 
                             alt="" 
                             className="h-4 w-4" 
                             onError={(e) => { e.currentTarget.style.display = 'none' }}
                           />
                        </div>
                        <form action={() => handleDelete(bookmark.id)}>
                            <button
                              type="submit"
                              className="rounded-lg p-2 text-gray-400 opacity-60 transition-all hover:bg-red-50 hover:text-red-600 hover:opacity-100 dark:hover:bg-red-900/20 dark:hover:text-red-400 group-hover:opacity-100"
                              title="Delete bookmark"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                    <h3 className="line-clamp-1 font-semibold text-gray-900 dark:text-white" title={bookmark.title}>
                      {bookmark.title}
                    </h3>
                    <a 
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="line-clamp-1 mt-1 text-sm text-gray-500 hover:text-blue-600 hover:underline dark:text-gray-400 dark:hover:text-blue-400"
                      title={bookmark.url}
                    >
                      {bookmark.url.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-600 border-t pt-3 border-gray-100 dark:border-zinc-800">
                    Added {new Date(bookmark.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
            ))
        )}
      </div>
    </div>
  )
}
