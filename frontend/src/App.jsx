import { useEffect, useReducer, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getPostIdFromPath() {
  const match = window.location.pathname.match(/^\/posts\/([^/]+)$/)
  return match ? decodeURIComponent(match[1]) : null
}

function formatDate(date) {
  if (!date) return 'Recently published'
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
  }).format(new Date(date))
}

function authorName(author) {
  if (!author) return 'Blog contributor'
  return typeof author === 'string' ? author : author.name || author.email
}

function PostCard({ post, onOpen }) {
  return (
    <article className="post-card">
      <div className="post-card__meta">
        <span>{post.category || 'Journal'}</span>
        <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
      </div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <div className="post-card__footer">
        <span>By {authorName(post.author)}</span>
        <button type="button" onClick={() => onOpen(post._id)}>
          Read article <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  )
}

function LoadingState() {
  return (
    <div className="state-panel" role="status" aria-busy="true">
      <span className="loader" aria-hidden="true" />
      <p>Gathering the latest stories…</p>
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="state-panel state-panel--error" role="alert">
      <p>{message}</p>
      <button type="button" onClick={onRetry}>Try again</button>
    </div>
  )
}

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [, refresh] = useReducer((value) => value + 1, 0)

  const loadPosts = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/posts`)
      if (!response.ok) throw new Error('The posts could not be loaded right now.')
      const data = await response.json()
      setPosts(Array.isArray(data) ? data : data.posts || [])
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    const fetchInitialPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/posts`)
        if (!response.ok) throw new Error('The posts could not be loaded right now.')
        const data = await response.json()
        if (active) setPosts(Array.isArray(data) ? data : data.posts || [])
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchInitialPosts()
    return () => { active = false }
  }, [])

  useEffect(() => {
    const handlePopState = () => refresh()
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const postId = getPostIdFromPath()
  const selectedPost = postId ? posts.find((post) => post._id === postId) : null

  const openPost = (postId) => {
    window.history.pushState({}, '', `/posts/${postId}`)
    refresh()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goHome = () => {
    window.history.pushState({}, '', '/')
    refresh()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (selectedPost) {
    return (
      <main className="site-shell">
        <header className="site-header">
          <button className="brand" type="button" onClick={goHome}>the / journal</button>
          <button className="back-link" type="button" onClick={goHome}>← All stories</button>
        </header>
        <article className="detail">
          <div className="detail__eyebrow">
            <span>{selectedPost.category || 'Journal'}</span>
            <time dateTime={selectedPost.createdAt}>{formatDate(selectedPost.createdAt)}</time>
          </div>
          <h1>{selectedPost.title}</h1>
          <p className="detail__byline">By {authorName(selectedPost.author)}</p>
          <div className="detail__rule" />
          <p className="detail__content">{selectedPost.content}</p>
          {selectedPost.tags?.length > 0 && (
            <ul className="tag-list" aria-label="Tags">
              {selectedPost.tags.map((tag) => <li key={tag}>#{tag}</li>)}
            </ul>
          )}
        </article>
      </main>
    )
  }

  return (
    <main className="site-shell">
      <header className="site-header">
        <button className="brand" type="button" onClick={goHome}>the / journal</button>
        <span className="header-note">Ideas worth sharing</span>
      </header>
      <section className="masthead">
        <p className="eyebrow">A collection of thoughtful notes</p>
        <h1>Stories for the<br /><em>curious mind.</em></h1>
        <p className="masthead__intro">Explore perspectives, lessons, and ideas from our community of writers.</p>
      </section>
      <section className="feed" aria-labelledby="feed-heading">
        <div className="feed__heading">
          <h2 id="feed-heading">Latest stories</h2>
          {!loading && !error && <span>{posts.length} {posts.length === 1 ? 'story' : 'stories'}</span>}
        </div>
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={loadPosts} />}
        {!loading && !error && posts.length === 0 && (
          <div className="state-panel"><p>No stories have been published yet.</p></div>
        )}
        {!loading && !error && posts.length > 0 && (
          <div className="post-grid">
            {posts.map((post) => <PostCard key={post._id} post={post} onOpen={openPost} />)}
          </div>
        )}
      </section>
    </main>
  )
}

export default App
