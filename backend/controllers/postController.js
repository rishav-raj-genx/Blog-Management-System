import mongoose from 'mongoose'
import Post from '../models/Post.js'

const editableFields = ['title', 'content', 'category', 'tags']

function isValidId(id) {
  return mongoose.isValidObjectId(id)
}

function canManagePost(req, post) {
  return req.user.role === 'Admin' || post.author._id.toString() === req.user.id
}

export async function createPost(req, res, next) {
  try {
    const { title, content, category, tags } = req.body
    const post = await Post.create({
      title,
      content,
      category,
      tags,
      author: req.user.id,
    })
    return res.status(201).json(post)
  } catch (error) {
    return next(error)
  }
}

export async function getPosts(req, res, next) {
  try {
    const posts = await Post.find().populate('author', 'name email role').sort({ createdAt: -1 })
    return res.json(posts)
  } catch (error) {
    return next(error)
  }
}

export async function getPost(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post id' })
    }

    const post = await Post.findById(req.params.id).populate('author', 'name email role')
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    return res.json(post)
  } catch (error) {
    return next(error)
  }
}

export async function updatePost(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post id' })
    }

    const post = await Post.findById(req.params.id).populate('author', 'name email role')
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    if (!canManagePost(req, post)) {
      return res.status(403).json({ message: 'You can only edit your own posts' })
    }

    for (const field of editableFields) {
      if (req.body[field] !== undefined) {
        post[field] = req.body[field]
      }
    }

    await post.save()
    return res.json(await post.populate('author', 'name email role'))
  } catch (error) {
    return next(error)
  }
}

export async function deletePost(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post id' })
    }

    const post = await Post.findById(req.params.id).populate('author', 'name email role')
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    if (!canManagePost(req, post)) {
      return res.status(403).json({ message: 'You can only delete your own posts' })
    }

    await post.deleteOne()
    return res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    return next(error)
  }
}
