import { Profile } from "../models/profile.js"
import { Blog } from "../models/blog.js"

async function create(req,res) {
  try {
    req.body.author = req.user.profile
    const blog = await Blog.create(req.body)
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile,
      { $push: { blogs: blog } },
      { new: true }
    )
    blog.author = profile
    res.status(201).json(blog)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function index(req, res) {
  try {
    const blogs = await Blog.find({})
      .populate('author')
      .sort({ createdAt: 'desc' })
    res.status(200).json(blogs)
  } catch (error) {
    res.status(500).json(error)
  }
}

async function show(req, res) {
  try {
    const blog = await Blog.find(req.params.blogId)
      .populate(['author', 'comments.author'])
    res.status(200).json(blog)
  }
  catch (error){
    res.status(500).json(error)
  }
}

async function update(req, res) {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.blogId,
      req.body,
      { new: true }
      ).populate('author')
    res.status(200).json(blog)
  } catch (error) {
    res.status(500).json(error)
  }
}

async function deleteBlog(req,res) {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.blogId)
    const profile = await Profile.findById(req.user.profile)
    profile.blogs.remove({ _id: req.params.blogId })
    await profile.save()
    res.status(200).json(blog)
  } catch (error) {
    res.status(500).json(error)
  }
}


export { 
  create,
  index,
  show,
  update,
  deleteBlog as delete
}