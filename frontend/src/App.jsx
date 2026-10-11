import { useState, useEffect, useCallback, useRef } from 'react'
import { getCurrentUserApi } from './api.js'
import LoginForm from './components/LoginForm.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import './App.css'

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthChecking, setIsAuthChecking] = useState(true)
  const [alert, setAlert] = useState(null)
  const alertTimerRef = useRef(null)

  const showAlert = useCallback((message, type = 'error') => {
    if (!message) return

    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current)
      alertTimerRef.current = null
    }

    setAlert({ message, type })

    alertTimerRef.current = setTimeout(() => {
      setAlert(null)
      alertTimerRef.current = null
    }, 4000)
  }, [])

  const handleDismissAlert = useCallback(() => {
    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current)
      alertTimerRef.current = null
    }
    setAlert(null)
  }, [])

  const handleAlertError = useCallback((message) => {
    if (!localStorage.getItem('token')) {
      setCurrentUser((prev) => (prev ? null : prev))
    }
    showAlert(message, 'error')
  }, [showAlert])

  const handleAlertSuccess = useCallback((message) => {
    showAlert(message, 'success')
  }, [showAlert])

  const handleLoginSuccess = useCallback((user) => {
    setCurrentUser(user)
    showAlert(`Welcome, ${user.name || 'User'}!`, 'success')
  }, [showAlert])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    setCurrentUser(null)
    showAlert('Logged out successfully.', 'success')
  }, [showAlert])

  useEffect(() => {
    let isMounted = true

    async function checkAuth() {
      const token = localStorage.getItem('token')
      if (!token) {
        if (isMounted) setIsAuthChecking(false)
        return
      }

      try {
        const user = await getCurrentUserApi()
        if (isMounted) {
          setCurrentUser(user)
        }
      } catch (err) {
        localStorage.removeItem('token')
        if (isMounted) {
          setCurrentUser(null)
          if (err?.message) {
            showAlert(err.message, 'error')
          }
        }
      } finally {
        if (isMounted) {
          setIsAuthChecking(false)
        }
      }
    }

    checkAuth()

    return () => {
      isMounted = false
      if (alertTimerRef.current) {
        clearTimeout(alertTimerRef.current)
        alertTimerRef.current = null
      }
    }
  }, [showAlert])

  const isAdmin = currentUser?.role?.toLowerCase() === 'admin'

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Blog Management</h1>

        {currentUser && (
          <div className="user-bar">
            <span className="user-label">
              {currentUser.name} (<strong>{currentUser.role}</strong>)
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        )}
      </header>

      {alert && (
        <div className={`alert-banner alert-${alert.type}`} role="alert">
          <span>{alert.message}</span>
          <button
            type="button"
            className="alert-close"
            onClick={handleDismissAlert}
            aria-label="Dismiss alert"
          >
            ✕
          </button>
        </div>
      )}

      <main className="app-main">
        {isAuthChecking ? (
          <div className="state-box">
            <p>Checking authentication...</p>
          </div>
        ) : !currentUser ? (
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            onError={handleAlertError}
          />
        ) : !isAdmin ? (
          <div className="access-denied-box">
            <h2>Access Denied</h2>
            <p>You must have administrator privileges to view the dashboard.</p>
            <p className="access-note">
              Signed in as <strong>{currentUser.email}</strong> (role: <code>{currentUser.role}</code>).
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLogout}
            >
              Sign In as Administrator
            </button>
          </div>
        ) : (
          <AdminDashboard
            onError={handleAlertError}
            onSuccess={handleAlertSuccess}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Blog Management System &bull; College Assignment</p>
      </footer>
    </div>
  )
}
