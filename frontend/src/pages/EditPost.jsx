import { useState, useEffect } from 'react'
import { getPostById, updatePost } from '../services/postService.js'

function EditPost() {
  // Get post id from URL pathname
  const id = window.location.pathname.split('/').pop()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Fetch the existing post data on page load
  useEffect(() => {
    async function loadPost() {
      try {
        const post = await getPostById(id)
        setTitle(post.title || '')
        setContent(post.content || '')
        setCategory(post.category || '')
        if (Array.isArray(post.tags)) {
          setTags(post.tags.join(', '))
        } else if (typeof post.tags === 'string') {
          setTags(post.tags)
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()

    // Basic validation for required fields
    if (!title.trim() || !content.trim() || !category.trim()) {
      setError('Please fill in title, content, and category')
      return
    }

    // Convert comma-separated tags into an array of strings
    const tagsArray = tags
      ? tags.split(',').map((tag) => tag.trim()).filter((tag) => tag !== '')
      : []

    try {
      setSubmitting(true)
      setError('')
      await updatePost(id, {
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        tags: tagsArray,
      })
      window.location.href = '/'
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post')
    } finally {
      setSubmitting(false)
    }
  }

  // Show loading indicator while post data is being fetched
  if (loading) {
    return <p style={{ padding: '20px', textAlign: 'center' }}>Loading...</p>
  }

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
      <h2>Edit Post</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="news, tech, react"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter post content"
            rows="6"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '10px 16px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {submitting ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  )
}

export default EditPost
