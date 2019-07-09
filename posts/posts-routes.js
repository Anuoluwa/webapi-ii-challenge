const express = require('express');
const Posts = require('../data/db');
const route = express.Router();

route.post('/', async (req, res) => {
    const { title, contents } = req.body;
    const post = {
        title, contents
    }
    try {
      const newPost = await Posts.insert(post);
      res.status(201).json({ message: "new post created successfully", newPost: { ...post} });
    } catch (error) {
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      });
    }
  });

  route.post('/:id/comments', async (req, res) => {
    const post = await Posts.findById(req.params.id);
    const { text } = req.body;
    const comment = {
        post_id: req.params.id,
        text
    }
    try { 
        if(post.length) {
            if(comment) {
                const newComment = await Posts.insertComment(comment);
               return res.status(201).json({ message: "new comment posted successfully", data: comment });
            }
        }  else {
            return res.status(404).json({ message: `The post with the specified ID ${req.params.id} does not exist.` });
        }
    } catch(error) {
        res.status(500).json({ error: "There was an error while saving the comment to the database" });
    }
  })

  route.get('/', async (req, res) => {
      try {
        const posts = await Posts.find(req.query);
        res.status(200).json(posts);
      } catch(error) {
        res.status(500).json({ error: "The posts information could not be retrieved." });
      }
  })

  route.get('/:id', async (req, res) => {
      const post = await Posts.findById(req.params.id);

      try {
          if(post.length) {
              res.status(200).json(post)
          } else {
              res.status(404).json({ message: `The post with the specified id ${req.params.id} does not exist.` })
          }
      } catch(error) {
          res.status(500).json({ error: "The post information could not be retrieved." })
      }
  })

  route.get('/:id/comments', async (req, res) => {
    const post = await Posts.findCommentById(Number(req.params.id));
    try {
        if(post.length) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: `The post with the specified id ${req.params.id} does not exist.` })
        }
    } catch(error) {
        res.status(500).json({ error: "The comments information could not be retrieved." })
    }
})

route.delete('/:id', async (req, res) => {
    const item = await Posts.findById(Number(req.params.id));
    try {
        if(item.length) {
            const post = await Posts.remove(Number(req.params.id));
            res.status(200).json({message: "This post has been deleted successfully",  post: item,})
        } else {
            res.status(404).json({ message: `The post with the specified ID ${req.params.id} does not exist.` })
        }
    } catch(error) {
        res.status(500).json({ error: "The post could not be removed" })
    }

})

route.put('/:id', async (req,res) => {
    const { id } =req.params;
    const { title, contents } = req.body;
    const posts = await Posts.findById(Number(req.params.id));
    const post = {
        title, contents
    }
    try {

        if(posts.length) {
            const updatedPost = await Posts.update(id, post);
            res.status(201).json({ message: "new post created successfully", updatedPost: { ...post} });
        } else {
            res.status(404).json({ message: `The post with the specified ID ${req.params.id} does not exist.` })

        }
    } catch (error) {
        res.status(500).json({ errorMessage: "Please provide title and contents for the post."  });
      }
}) 


  module.exports = route;