import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function authenticateUser(req, res, next) {
  const authorization = req.headers?.authorization

  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7).trim()
    : null

  if (!token) {
    return res.status(401).json({
      message: 'Authentication required',
    })
  }

  let payload

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired token',
    })
  }

  if (
    !payload ||
    typeof payload !== 'object' ||
    typeof payload.id !== 'string'
  ) {
    return res.status(401).json({
      message: 'Invalid token payload',
    })
  }

  try {
    const user = await User.findById(payload.id).select('_id role')

    if (!user) {
      return res.status(401).json({
        message: 'User no longer exists',
      })
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    }

    return next()
  } catch (error) {
    return next(error)
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required',
    })
  }

  if (req.user.role !== 'Admin') {
    return res.status(403).json({
      message: 'Administrator access required',
    })
  }

  return next()
}

// Preserve compatibility with existing post routes.
export const authenticate = authenticateUser
