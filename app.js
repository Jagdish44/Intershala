require("dotenv").config();
const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const memoize = require('lodash/memoize');

const app = express();
const port = process.env.PORT || 4000;

let blogs = [];

app.use(bodyParser.json());



mongoose.connect(process.env.mongoDB_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  // Check if the connection was successful
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
  
  //module.exports=Connect;


// Middleware for parsing JSON data
app.use(express.json());

const data={
    
    "blogs": [
      {
        "id": "4b66e146-6da5-46e4-8a0e-2b40c0f13b0a",
        "image_url": "https://cdn.subspace.money/whatsub_blogs/slate(1).png",
        "title": "Privacy policy"
      },
      {
        "id": "8f2ffbf6-4058-47cd-800b-8c65f25fdf3c",
        "image_url": "https://cdn.subspace.money/whatsub_blogs/q.png",
        "title": "Top 5 ways to save money on Subscriptions"
      },
    ]
}
// data.blogs.map((e)=>{
//   all.add(e.title);
// })

// Define the /api/blog-stats route for fetching and analyzing blog data

// Memoize the blog stats calculation function with a cache expiration of 5 minutes (300,000 milliseconds)

const memoizedCalculateBlogStats = memoize(calculateBlogStats, (blogs) => 'blogStats', 300000);
app.get("/",(req,res)=>{
    res.send("Hello i am running")
});
app.get('/api/blog-stats', async (req, res) => {
  try {
    // Fetch blog data
    blogs = await fetchBlogData();
    
    // Check if blogs are undefined or empty
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ error: 'No blog data found' });
    }

    // Calculate and respond with blog statistics
    const blogStats = await memoizedCalculateBlogStats(blogs);
    res.json(blogStats);
  } catch (error) {
    // console.error(error);
    res.send(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define the calculateBlogStats function (non-memoized)
async function calculateBlogStats(blogs) {
  // Check if blogs are undefined or empty
  if (!blogs || blogs.length === 0) {
    throw new Error('No blog data found');
  }

  // Perform data analysis using Lodash
  const totalBlogs = blogs.length;
  const longestTitleBlog = _.maxBy(blogs, 'title.length');
  const privacyTitleBlogs = _.filter(blogs, (blog) =>
    _.includes(blog.title.toLowerCase(), 'privacy')
  );
  const uniqueTitles = _.uniqBy(blogs, 'title');

  // Create a JSON response
  return {
    totalBlogs,
    longestTitle: longestTitleBlog.title,
    blogsWithPrivacy: privacyTitleBlogs.length,
    uniqueTitles,
  };
}

// Define the fetchBlogData function to make the API request
async function fetchBlogData() {
    const res=await fetch("https://intent-kit-16.hasura.app/api/rest/blogs",{
        method: 'GET',
        headers: {
          'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
        }
    })
    // console.log(res)
    return res;

}

// fetchBlogData()
app.get('/testapi',async(req,res)=>{
    const all=new Set();
    const priv=new Set();
    const pvc=[];
    var blogg=""
    const response=await fetch("https://intent-kit-16.hasura.app/api/rest/blogs",{
        method: 'GET',
        headers: {
          'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
        }
    })
    const data1 = await response.json();

    data1.blogs.map((e)=>{
        all.add(e.title);
        if(e.title.length>blogg.length){
            blogg=e.title;
        }
    })
    data1.blogs.filter((e)=>{
        if(e.title.includes("Privacy"))
      {  priv.add(e.title);
        pvc.push(e.title);}
    })
    console.log("Set",all)
    console.log(data1.blogs.length)
    console.log(blogg)
    console.log(priv)
    console.log(pvc)
    res.send(data1);
 
})

// Define the /api/blog-search route for searching blogs
app.get('/api/blog-search', async(req, res) => {
    try{
        const query=req.query.query;
        console.log(query);
        const pvc=[];
        const response=await fetch("https://intent-kit-16.hasura.app/api/rest/blogs",{
            method: 'GET',
            headers: {
              'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
            }
        })


        const data1 = await response.json();
        data1.blogs.filter((e)=>{
            if(e.title.includes(query))
          { 
            pvc.push(e.title);}
        })
      
        console.log(pvc)
        res.json(pvc);
        
         
    }catch(e){
        console.log(e);
    }
  });
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
