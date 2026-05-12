import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { personalizedLessonRecommendations } from '@/ai/flows/personalized-lesson-recommendations';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/recommendations', async (req, res) => {
  try {
    const input = req.body;
    const recommendations = await personalizedLessonRecommendations(input);
    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
