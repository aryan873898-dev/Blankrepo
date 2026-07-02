const Post = require("../models/Post")

const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and Content are required"
            });
        }

        const post = await Post.create({ title, content, user: req.user._id });
        res.status(201).json({
            success: true,
            message: "Post Created Successfully",
            post
        });
    }
    catch (err) {
        console.log("unable to Add posts", err);
        res.status(500).json({
            success: false,
            message: "Unable to add POST",
            error: err.message
        })
    }
};

const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(201).json({
            success: true,
            message: "All Posts",
            total: posts.length,
            posts
        });
    }
    catch (err) {
        console.log("unable to fetch posts", err);
        res.status(500).json({
            success: false,
            message: "Unable to Fetch Posts",
            error: err.message
        });
    }
};

const getMyPost = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user._id });
        res.status(201).json({
            success: true,
            message: "Your Posts",
            posts
        });
    }
    catch (err) {
        console.log("unable to get your posts", err);
        res.status(500).json({
            success: false,
            message: "Unable to get Your Posts",
            error: err.message
        })
    }
};

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if(!post){
            return res.status(401).json({
                success:false,
                message:"Post Not Found"
            })
        }

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({
                success:false,
                message:"You are update your own post only"
            })
        }
        
        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        await post.save();

        res.status(201).json({
            success: true,
            message: "Post Updated Successfully",
            post
        });
    }

   catch (err) {
        console.log("Unable to update post", err);
        res.status(500).json({
            success: false,
            message: "Unable to Update Post",
            error: err.message
        }) 
    }
};


const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if(!post){
            return res.status(401).json({
                success:false,
                message:"Post Not Found to delete"
            }) 
        }

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({
                success:false,
                message:"You are delete your own post only"
            })
        }
        
      
        await post.deleteOne();

        res.status(201).json({
            success: true,
            message: "Post Deleted Successfully",
            post
        });
    }

   catch (err) {
        console.log("Unable to delete post", err);
        res.status(500).json({
            success: false,
            message: "Unable to Delete Post",
            error: err.message
        }) 
    }
};

module.exports = { createPost, getAllPost, getMyPost, updatePost, deletePost };
