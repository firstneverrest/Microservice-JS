const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === 'POST_CREATED') {
    const { id, title } = data;
    posts[id] = {
      id,
      title,
      comments: [],
    };
  } else if (type === 'COMMENT_CREATED') {
    const { id, content, postId, status } = data;
    posts[postId].comments.push({ id, content, status });
  } else if (type === 'COMMENT_UPDATED') {
    const { id, content, postId, status } = data;
    const selectedPost = posts[postId];
    const selectedComment = selectedPost.comments.find(
      (comment) => comment.id === id
    );
    selectedComment.status = status;
    selectedComment.content = content;
  }
};

app.get('/posts', (req, res) => {
  console.log(res.type);
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log('Query service is listening on 4002');

  try {
    const res = await axios.get('http://event-bus-srv:4005/events');

    for (let event of res.data) {
      console.log('Processing event:', event.type);
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error);
  }
});
