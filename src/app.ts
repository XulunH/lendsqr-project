import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'Wallet service setup is successful!' });
});

app.listen(PORT, () => {
  console.log(`Server running smoothly on port ${PORT}`);
});