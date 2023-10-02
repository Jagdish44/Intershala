const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    id: String, 
    image_url: String,
    title: String,
    content: String, 
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
