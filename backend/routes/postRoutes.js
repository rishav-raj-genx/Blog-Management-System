import { Router } from 'express'
import { authenticateUser } from '../middleware/auth.js'
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from '../controllers/postController.js'

const router = Router()

router.post('/', authenticateUser, createPost)
router.get('/', getPosts)
router.get('/:id', getPost)
router.put('/:id', authenticateUser, updatePost)
router.delete('/:id', authenticateUser, deletePost)

export default router
