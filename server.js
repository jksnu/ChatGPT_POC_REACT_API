const express = require('express');
const axios = require('axios');

const app = express();
const port = 3001; // Set your desired port number

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-origin", "http://localhost:3000")
  res.setHeader('Access-Control-Allow-Methods', "GET,POST,OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next();
})

// Middleware to parse JSON request bodies
app.use(express.json());

// POST endpoint to handle user queries
app.post('/api/query', async (req, res) => {
  const { query } = req.body;

  try {
    // Make a POST request to the ChatGPT API
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: query }],
    }, {
      headers: {
        'Authorization': 'Your KEY', // Replace with your ChatGPT API key
        'Content-Type': 'application/json',
      },
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error.response.data);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
