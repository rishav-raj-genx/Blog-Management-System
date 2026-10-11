import axios from 'axios'

// API base URL configured from environment variable or default
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '')
const API_URL = API_BASE_URL.endsWith('/api') ? `${API_BASE_URL}/posts` : `${API_BASE_URL}/api/posts`

// Create a new post with token in Authorization header
export async function createPost(postData) {
  const token = localStorage.getItem('token')
  const response = await axios.post(API_URL, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

// Get single post by id
export async function getPostById(id) {
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}

// Update an existing post with token in header
export async function updatePost(id, postData) {
  const token = localStorage.getItem('token')
  const response = await axios.put(`${API_URL}/${id}`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
