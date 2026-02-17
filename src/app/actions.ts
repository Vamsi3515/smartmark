
'use server'

export async function fetchUrlMetadata(url: string) {
  try {
    // Basic URL validation
    const validUrl = new URL(url)
    
    // Fetch the HTML
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'SmartMark-Bot/1.0', // Polite bot user agent
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
        return { title: null, error: 'Failed to fetch page' }
    }

    const html = await response.text()
    
    // Simple regex to extract title
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : null

    return { title, error: null }
  } catch (error) {
    return { title: null, error: 'Invalid URL' }
  }
}
