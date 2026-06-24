import express from 'express';
import connectDb from './db/index.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

connectDb()
    .then(() => {
        app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log('Failed to connect to MongoDB', err);
    });