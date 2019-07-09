const express = require('express');
const postsRoutes = require('./posts/posts-routes');

const server = express();

server.use(express.json());

server.use('/api/posts', postsRoutes);

server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda BLOG API</h>
    <p>Welcome to the Lambda BLOG API</p>
  `);
});

server.listen(5000, () => {
  console.log('\n*** Server Running on http://localhost:5000 ***\n');
});