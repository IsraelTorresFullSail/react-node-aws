import Category from '../models/category.js'
import slugify from 'slugify'
import formidable from 'formidable'
import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

const s3 = new AWS.S3({
  signatureCache: 'v4',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: 'us-east-1',
})

export const Create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    console.log(files)
    if (err) {
      console.log(err)
      return res.status(400).json({
        error: 'Image could not upload',
      })
    }
    const { name, content } = fields
    const { image } = files

    const slug = slugify(name)
    const postedBy = req.user._id
    let category = new Category({ name, content, slug, postedBy })
    if (image.size > 2000000) {
      return res.status(400).json({
        error: 'Image should be less than 2MB',
      })
    }

    const params = {
      Bucket: 'react-node-aws-itorres',
      Key: `category/${uuidv4()}`,
      Body: `${fs.readFileSync(image.filepath)}`,
      ACL: 'public-read',
      ContentTye: `${image.mimetype}`,
    }

    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err)
        res.status(400).json({
          error: 'Upload to s3 failed',
        })
      }
      category.image.url = data.Location
      category.image.key = data.Key

      category.save((err, data) => {
        if (err) {
          return res.status(400).json({
            error: 'Error saving category to db',
          })
        }
        return res.json(data)
      })
    })
  })
}

export const List = (req, res) => {}
export const Read = (req, res) => {}
export const Update = (req, res) => {}
export const Remove = (req, res) => {}
