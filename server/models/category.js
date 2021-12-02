import mongoose from 'mongoose'
import crypto from 'crypto'

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: true,
      max: 32,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    image: {
      url: String,
      key: String,
    },
    content: {
      type: {},
      min: 20,
      max: 2000000,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const Category = mongoose.model('Category', categorySchema)

export default Category
