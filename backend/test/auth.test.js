import { describe, it, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { register, login } from '../controllers/authController.js'
import { authenticateUser, requireAdmin } from '../middleware/auth.js'

process.env.JWT_SECRET = 'test-secret-key'

function mockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(data) {
      this.body = data
      return this
    },
  }
  return res
}

describe('Auth API and Middleware', () => {
  const originalFindOne = User.findOne
  const originalCreate = User.create
  const originalFindById = User.findById

  afterEach(() => {
    User.findOne = originalFindOne
    User.create = originalCreate
    User.findById = originalFindById
  })
  it('register creates user with hashed password, default User role, and returns token', async () => {
    let created
    User.findOne = async () => null
    User.create = async (doc) => {
      created = doc
      return { _id: 'u1', ...doc, role: 'User' }
    }

    const res = mockRes()
    await register(
      { body: { name: 'Alice', email: '  ALICE@Test.com ', password: 'password123', role: 'Admin' } },
      res,
      () => {},
    )

    assert.equal(res.statusCode, 201)
    assert.equal(created.email, 'alice@test.com')
    assert.notEqual(created.password, 'password123')
    assert.equal(created.role, undefined)
    assert.equal(res.body.user.role, 'User')
    assert.ok(res.body.token)
  })

  it('register rejects missing fields (400) and duplicate emails (409)', async () => {
    const res1 = mockRes()
    await register({ body: { name: '', email: 'a@b.com', password: '123' } }, res1, () => {})
    assert.equal(res1.statusCode, 400)

    User.findOne = async () => ({ _id: 'u1', email: 'existing@test.com' })
    const res2 = mockRes()
    await register({ body: { name: 'Bob', email: 'existing@test.com', password: 'password123' } }, res2, () => {})
    assert.equal(res2.statusCode, 409)
  })

  it('login verifies password and returns token, or rejects invalid credentials with 401', async () => {
    const hash = await bcrypt.hash('secret', 10)
    User.findOne = (q) => ({
      select: async () => (q.email === 'user@test.com' ? { _id: 'u1', role: 'User', password: hash } : null),
    })

    const res1 = mockRes()
    await login({ body: { email: 'USER@test.com', password: 'secret' } }, res1, () => {})
    assert.equal(res1.statusCode, 200)
    assert.ok(res1.body.token)

    const res2 = mockRes()
    await login({ body: { email: 'user@test.com', password: 'wrong' } }, res2, () => {})
    assert.equal(res2.statusCode, 401)
  })

  it('authenticateUser rejects missing/invalid tokens with 401 and sets req.user from DB', async () => {
    const res1 = mockRes()
    await authenticateUser({ headers: {} }, res1, () => {})
    assert.equal(res1.statusCode, 401)

    const res2 = mockRes()
    await authenticateUser({ headers: { authorization: 'Bearer bad.token' } }, res2, () => {})
    assert.equal(res2.statusCode, 401)

    const token = jwt.sign({ id: 'u1', role: 'Admin' }, process.env.JWT_SECRET)
    User.findById = () => ({ select: async () => ({ _id: 'u1', role: 'User' }) })
    let nextCalled = false
    const req = { headers: { authorization: `Bearer ${token}` } }
    await authenticateUser(req, mockRes(), () => {
      nextCalled = true
    })

    assert.equal(nextCalled, true)
    assert.equal(req.user.role, 'User')
  })

  it('authenticateUser rejects expired tokens with 401', async () => {
    const expiredToken = jwt.sign({ id: 'u1', role: 'User' }, process.env.JWT_SECRET, {
      expiresIn: '-10s',
    })
    const res = mockRes()
    await authenticateUser({ headers: { authorization: `Bearer ${expiredToken}` } }, res, () => {})
    assert.equal(res.statusCode, 401)
  })

  it('authenticateUser rejects token if user no longer exists in DB with 401', async () => {
    const token = jwt.sign({ id: 'u1', role: 'User' }, process.env.JWT_SECRET)
    User.findById = () => ({ select: async () => null })
    const res = mockRes()
    await authenticateUser({ headers: { authorization: `Bearer ${token}` } }, res, () => {})
    assert.equal(res.statusCode, 401)
  })

  it('requireAdmin enforces authentication and Admin role', () => {
    const res1 = mockRes()
    requireAdmin({}, res1, () => {})
    assert.equal(res1.statusCode, 401)

    const res2 = mockRes()
    requireAdmin({ user: { role: 'User' } }, res2, () => {})
    assert.equal(res2.statusCode, 403)

    let nextCalled = false
    requireAdmin({ user: { role: 'Admin' } }, mockRes(), () => {
      nextCalled = true
    })
    assert.equal(nextCalled, true)
  })
})
