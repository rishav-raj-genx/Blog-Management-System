import { useState, useRef, useEffect } from 'react'
import { loginApi } from '../api.js'

export default function LoginForm({ onLoginSuccess, onError }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()

    if (!email.trim() || !password) {
      onError('Please enter both email and password.')
      return
    }

    setIsSubmitting(true)
    try {
      const data = await loginApi(email.trim(), password)
      localStorage.setItem('token', data.token)
      onLoginSuccess(data.user)
    } catch (err) {
      if (isMountedRef.current) {
        onError(err.message || 'Login failed. Please check your credentials.')
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="login-box">
      <h2>Admin Sign In</h2>
      <p>Log in with an administrator account to access the dashboard.</p>

      <form onSubmit={handleSubmit} className="simple-form">
        <div className="form-field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            disabled={isSubmitting}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            disabled={isSubmitting}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
