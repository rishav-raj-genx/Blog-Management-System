import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getCurrentUserApi, getPostsApi } from './api.js'
import AdminDashboard from './components/AdminDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import CreatePost from './pages/CreatePost.jsx'
import EditPost from './pages/EditPost.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import './App.css'

function formatDate(date) {
  if (!date) return 'Recently published'
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(date))
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

function PublicFeed({ onLogin }) {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPostId, setSelectedPostId] = useState(() => {
    const match = window.location.pathname.match(/^\/posts\/([^/]+)$/)
    return match ? decodeURIComponent(match[1]) : null
  })

  const loadPosts = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getPostsApi()
      setPosts(Array.isArray(data) ? data : [])
    } catch (requestError) {
      setError(requestError.message || 'The posts could not be loaded right now.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    Promise.resolve().then(loadPosts)
    const handlePopState = () => {
      const match = window.location.pathname.match(/^\/posts\/([^/]+)$/)
      setSelectedPostId(match ? decodeURIComponent(match[1]) : null)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [loadPosts])

  const openPost = (postId) => {
    window.history.pushState({}, '', `/posts/${postId}`)
    setSelectedPostId(postId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goHome = () => {
    window.history.pushState({}, '', '/')
    setSelectedPostId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectedPost = posts.find((post) => post._id === selectedPostId)

  if (selectedPost) {
    return (
      <section className="feed-shell">
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
      </section>
    )
  }

  return (
    <section className="feed-shell">
      <header className="site-header">
        <button className="brand" type="button" onClick={goHome}>the / journal</button>
        <button className="feed-login" type="button" onClick={onLogin}>Admin sign in</button>
      </header>
      <section className="masthead">
        <p className="eyebrow">A collection of thoughtful notes</p>
        <h1>Stories for the<br /><em>curious mind.</em></h1>
        <p className="masthead__intro">Explore perspectives, lessons, and ideas from our community of writers.</p>
      </section>
      <section className="feed" aria-labelledby="feed-heading">
        <div className="feed__heading">
          <h2 id="feed-heading">Latest stories</h2>
          {!isLoading && !error && <span>{posts.length} {posts.length === 1 ? 'story' : 'stories'}</span>}
        </div>
        {isLoading && <div className="state-panel" role="status" aria-busy="true"><span className="loader" /> <p>Gathering the latest stories…</p></div>}
        {!isLoading && error && <div className="state-panel state-panel--error" role="alert"><p>{error}</p><button type="button" onClick={loadPosts}>Try again</button></div>}
        {!isLoading && !error && posts.length === 0 && <div className="state-panel"><p>No stories have been published yet.</p></div>}
        {!isLoading && !error && posts.length > 0 && <div className="post-grid">{posts.map((post) => <PostCard key={post._id} post={post} onOpen={openPost} />)}</div>}
      </section>
    </section>
  )
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthChecking, setIsAuthChecking] = useState(() => Boolean(localStorage.getItem('token')))
  const [alert, setAlert] = useState(null)
  const alertTimerRef = useRef(null)

  const showAlert = useCallback((message, type = 'error') => {
    if (!message) return
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current)
    setAlert({ message, type })
    alertTimerRef.current = setTimeout(() => setAlert(null), 4000)
  }, [])

  const handleAlertError = useCallback((message) => showAlert(message, 'error'), [showAlert])
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    setCurrentUser(null)
    showAlert('Logged out successfully.', 'success')
  }, [showAlert])

  useEffect(() => {
    let isMounted = true
    const token = localStorage.getItem('token')
    if (!token) {
      return undefined
    }
    getCurrentUserApi()
      .then((user) => { if (isMounted) setCurrentUser(user) })
      .catch((error) => {
        localStorage.removeItem('token')
        if (isMounted) showAlert(error.message, 'error')
      })
      .finally(() => { if (isMounted) setIsAuthChecking(false) })
    return () => {
      isMounted = false
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current)
    }
  }, [showAlert])

  const isAdmin = currentUser?.role?.toLowerCase() === 'admin'
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const isCreatePostPage = location.pathname === '/create-post'
  const isEditPostPage = location.pathname.startsWith('/edit-post/')
  const isDashboardPage = location.pathname === '/dashboard'

  return (
    <div className="app-container">
      {currentUser && (
        <header className="app-header">
          <h1 className="app-title">Blog Management</h1>
          <div className="user-bar">
            <span className="user-label">{currentUser.name} (<strong>{currentUser.role}</strong>)</span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>Log Out</button>
          </div>
        </header>
      )}
      {alert && <div className={`alert-banner alert-${alert.type}`} role="alert"><span>{alert.message}</span><button type="button" className="alert-close" onClick={() => setAlert(null)} aria-label="Dismiss alert">✕</button></div>}
      <main className="app-main">
        {isAuthPage ? (
          location.pathname === '/login' ? <Login /> : <Register />
        ) : isCreatePostPage ? (
          <ProtectedRoute><CreatePost /></ProtectedRoute>
        ) : isEditPostPage ? (
          <ProtectedRoute><EditPost /></ProtectedRoute>
        ) : isDashboardPage && isAuthChecking ? (
          <div className="state-box"><p>Checking authentication...</p></div>
        ) : isDashboardPage && currentUser && isAdmin ? (
          <AdminDashboard onError={handleAlertError} onSuccess={(message) => showAlert(message, 'success')} />
        ) : isDashboardPage && currentUser ? (
          <div className="access-denied-box"><h2>Access Denied</h2><p>You must have administrator privileges to view the dashboard.</p><button type="button" className="btn btn-primary" onClick={handleLogout}>Sign Out</button></div>
        ) : isDashboardPage ? (
          <ProtectedRoute><div className="state-box"><p>Checking authentication...</p></div></ProtectedRoute>
        ) : isAuthChecking ? <div className="state-box"><p>Checking authentication...</p></div>
          : currentUser && isAdmin ? <PublicFeed onLogin={() => navigate('/dashboard')} />
            : currentUser ? <div className="access-denied-box"><h2>Access Denied</h2><p>You must have administrator privileges to view the dashboard.</p><button type="button" className="btn btn-primary" onClick={handleLogout}>Sign Out</button></div>
              : <PublicFeed onLogin={() => navigate('/login')} />}
      </main>
      <footer className="app-footer"><p>Blog Management System &bull; College Assignment</p></footer>
    </div>
  )
}
