import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags) => tags.every((tag) => typeof tag === 'string'),
        message: 'Tags must be strings',
      },
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
)

export default mongoose.model('Post', postSchema)
