import { useState, useEffect, useCallback, useRef } from 'react'
import { getPostsApi, deletePostApi } from '../api.js'

export default function AdminDashboard({ onError, onSuccess }) {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [postToDelete, setPostToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const isMountedRef = useRef(true)

  const fetchPosts = useCallback(async () => {
    try {
      const data = await getPostsApi()
      if (isMountedRef.current) {
        setPosts(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      const msg = err.message || 'Failed to load posts.'
      if (isMountedRef.current) {
        setFetchError(msg)
        onError?.(msg)
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [onError])

  const handleRefresh = useCallback(() => {
    setIsLoading(true)
    setFetchError(null)
    return fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    isMountedRef.current = true

    async function load() {
      await fetchPosts()
    }
    load()

    return () => {
      isMountedRef.current = false
    }
  }, [fetchPosts])

  useEffect(() => {
    if (!postToDelete) return

    function handleKeyDown(e) {
      if (e.key === 'Escape' && !isDeleting) {
        setPostToDelete(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [postToDelete, isDeleting])

  async function handleConfirmDelete() {
    if (!postToDelete || isDeleting) return

    setIsDeleting(true)
    try {
      await deletePostApi(postToDelete._id)
      if (isMountedRef.current) {
        setPosts((prev) => prev.filter((p) => p._id !== postToDelete._id))
        setPostToDelete(null)
      }
      const title = postToDelete.title ? `"${postToDelete.title}"` : 'selected post'
      onSuccess?.(`Post ${title} deleted successfully.`)
    } catch (err) {
      if (isMountedRef.current) {
        onError?.(err.message || 'Failed to delete post.')
      }
    } finally {
      if (isMountedRef.current) {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-topbar">
        <div>
          <h2>Admin Dashboard</h2>
          <p className="subtitle">Manage published blog posts across the system.</p>
        </div>
        <div className="dashboard-controls">
          <span className="badge">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={isLoading || isDeleting}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="state-box">
          <p>Loading posts...</p>
        </div>
      )}

      {!isLoading && fetchError && (
        <div className="state-box error-box">
          <p>{fetchError}</p>
          <button type="button" className="btn btn-primary" onClick={handleRefresh}>
            Retry
          </button>
        </div>
      )}

      {!isLoading && !fetchError && posts.length === 0 && (
        <div className="state-box">
          <p>No posts found.</p>
        </div>
      )}

      {!isLoading && !fetchError && posts.length > 0 && (
        <div className="table-wrapper">
          <table className="posts-table">
            <thead>
              <tr>
                <th scope="col">Title & Excerpt</th>
                <th scope="col">Category</th>
                <th scope="col">Author</th>
                <th scope="col">Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const authorName = post.author?.name || 'Unknown'
                const postDate = post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString()
                  : 'N/A'
                const excerpt =
                  post.content && post.content.length > 90
                    ? `${post.content.slice(0, 90)}...`
                    : post.content || ''

                return (
                  <tr key={post._id}>
                    <td>
                      <div className="post-cell-title">{post.title || 'Untitled'}</div>
                      {excerpt && <div className="post-cell-excerpt">{excerpt}</div>}
                    </td>
                    <td>{post.category || 'General'}</td>
                    <td>{authorName}</td>
                    <td>{postDate}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setPostToDelete(post)}
                        disabled={isDeleting}
                        aria-label={`Delete post "${post.title || 'Untitled'}"`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {postToDelete && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleting) {
              setPostToDelete(null)
            }
          }}
        >
          <div className="modal-box">
            <h3 id="delete-dialog-title">Confirm Deletion</h3>
            <p>
              Are you sure you want to delete <strong>&ldquo;{postToDelete.title || 'Untitled Post'}&rdquo;</strong>?
            </p>
            <p className="modal-warning">This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setPostToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
