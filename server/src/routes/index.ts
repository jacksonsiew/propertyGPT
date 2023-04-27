import express from 'express';
import chat from './characterAI/chat';

const apiRouter = express.Router();

apiRouter.get('/', (req, res) => {
  res.send('ChatGPT Server running...');
});

apiRouter.post('/chat', chat);

export { apiRouter };
