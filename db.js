const mongoose = require('mongoose');
const fetchBlogsFromAPI = require('./fetchBlog'); // Import the function
const Blog = require('./blogModel'); // Import the Mongoose model


async function fetchAndStoreBlogs() {
  try {
    const blogsData = await fetchBlogsFromAPI();

    
    await Blog.insertMany(blogsData);

    console.log('Data fetched and stored successfully.');
  } catch (error) {
    console.error('Error fetching and storing data:', error);
  } finally {
    
    mongoose.connection.close();
  }
}


fetchAndStoreBlogs();
