import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from '../controllers/postController.js'

const router = Router()

router.post('/', authenticate, createPost)
router.get('/', getPosts)
router.get('/:id', getPost)
router.put('/:id', authenticate, updatePost)
router.delete('/:id', authenticate, deletePost)

export default router
