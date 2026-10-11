import { Link } from 'react-router-dom'

function ProtectedRoute(props) {
  const token = localStorage.getItem('token')

  // If there is no token, show login prompt
  if (!token) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Please login first</p>
        <Link to="/login">Login</Link>
      </div>
    )
  }

  // If there is a token, return child components
  return props.children
}

export default ProtectedRoute
