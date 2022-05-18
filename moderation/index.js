const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'COMMENT_CREATED') {
    const status = data.content.includes('bad') ? 'rejected' : 'approved';

    await axios.post('http://localhost:4005/events', {
      type: 'COMMENT_MODERATED',
      data: {
        ...data,
        status,
      },
    });
  }
  res.send({});
});

app.listen(4003, () => {
  console.log('Moderation services is listening on 4003');
});
